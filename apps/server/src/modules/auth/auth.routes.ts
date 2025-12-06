import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";

import { guestSchema, registerSchema, loginSchema } from "./auth.schema";

import { generateId, generateTag } from "@/utils/identity";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt";

import { hashPassword, comparePassword } from "@/utils/password";
import { success } from "@/utils/response";
import { AppError } from "@/utils/app-error";

import { ErrorCode } from "@/utils/app-error";

import { type Actor } from "@collabdraw/types";

import { db } from "@/db";
import { users } from "@/db/schema";
import { env } from "@/config/env";

// ============================================================
// ✅ GUEST LOGIN  (NO REFRESH TOKEN)
// ============================================================
export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/guest", async (req, reply) => {
    const { username } = guestSchema.parse(req.body);

    const actor: Actor = {
      id: generateId(),
      username,
      tag: generateTag(),
      type: "guest",
    };

    const accessToken = signAccessToken(actor);

    return success(
      reply,
      {
        accessToken,
        actor,
      },
      "Guest session created",
      201
    );
  });

  // ============================================================
  // ✅ USER REGISTER
  // ============================================================
  fastify.post("/register", async (req, reply) => {
    const { username, password } = registerSchema.parse(req.body);

    const passwordHash = await hashPassword(password);

    const result = await db
      .insert(users)
      .values({
        id: generateId(),
        username,
        tag: generateTag(),
        passwordHash,
      })
      .returning();

    const user = result[0];

    if (!user) {
      throw new AppError(
        "User creation failed",
        500,
        ErrorCode.USER_CREATE_FAILED
      );
    }

    const actor: Actor = {
      id: user.id,
      username: user.username,
      tag: user.tag,
      type: "user",
    };

    const accessToken = signAccessToken(actor);
    const refreshToken = signRefreshToken(actor);

    // ✅ Store REFRESH TOKEN HASH in DB
    await db
      .update(users)
      .set({
        refreshTokenHash: await hashPassword(refreshToken),
      })
      .where(eq(users.id, user.id));

    // ✅ Set HttpOnly Cookie
    reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: env.JWT_REFRESH_EXPIRES_IN, // 7d
    });

    return success(reply, { accessToken, actor }, "User registered", 201);
  });

  // ============================================================
  // ✅ USER LOGIN
  // ============================================================
  fastify.post("/login", async (req, reply) => {
    const { username, password } = loginSchema.parse(req.body);

    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = result[0];

    if (!user) {
      throw new AppError(
        "Invalid credentials",
        401,
        ErrorCode.INVALID_CREDENTIALS
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      throw new AppError(
        "Invalid credentials",
        401,
        ErrorCode.INVALID_CREDENTIALS
      );
    }

    const actor: Actor = {
      id: user.id,
      username: user.username,
      tag: user.tag,
      type: "user",
    };

    const accessToken = signAccessToken(actor);
    const refreshToken = signRefreshToken(actor);

    await db
      .update(users)
      .set({
        refreshTokenHash: await hashPassword(refreshToken),
      })
      .where(eq(users.id, user.id));

    reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: env.JWT_REFRESH_EXPIRES_IN,
    });

    return success(reply, { accessToken, actor }, "Login successful");
  });

  // ============================================================
  // ✅ REFRESH TOKEN
  // ============================================================
  fastify.post("/refresh", async (req, reply) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
      throw new AppError("Refresh token missing", 401, ErrorCode.AUTH_REQUIRED);
    }

    const actor = verifyRefreshToken(token);

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, actor.id))
      .limit(1);

    const user = result[0];

    if (!user || !user.refreshTokenHash) {
      throw new AppError("Invalid refresh token", 401, ErrorCode.TOKEN_INVALID);
    }

    const isValid = await comparePassword(token, user.refreshTokenHash);

    if (!isValid) {
      throw new AppError("Invalid refresh token", 401, ErrorCode.TOKEN_INVALID);
    }

    const newAccessToken = signAccessToken(actor);

    return success(
      reply,
      { accessToken: newAccessToken, actor },
      "Token refreshed"
    );
  });

  // ============================================================
  // ✅ LOGOUT
  // ============================================================
  fastify.post("/logout", async (req, reply) => {
    const actor = req.actor;

    if (!actor || actor.type !== "user") {
      throw new AppError("Not authenticated", 401, ErrorCode.AUTH_REQUIRED);
    }

    await db
      .update(users)
      .set({ refreshTokenHash: null })
      .where(eq(users.id, actor.id));

    reply.clearCookie("refreshToken", { path: "/" });

    return success(reply, null, "Logged out successfully");
  });
}
