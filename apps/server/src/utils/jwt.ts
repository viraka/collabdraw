import jwt from "jsonwebtoken";
import type { Actor } from "@collabdraw/types";
import { env } from "@/config/env";
const ACCESS_SECRET = env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET!;

export function signAccessToken(actor: Actor) {
  return jwt.sign(actor, ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

export function signRefreshToken(actor: Actor) {
  return jwt.sign(actor, REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as Actor;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as Actor;
}
