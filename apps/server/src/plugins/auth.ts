import type { FastifyPluginAsync } from "fastify";
import { verifyAccessToken } from "@/utils/jwt";

export const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest("actor", null);

  fastify.addHook("preHandler", async (req: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return;

    if (!authHeader.startsWith("Bearer ")) return;

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      req.actor = decoded;
    } catch {
      // ✅ Invalid or expired access token → user is treated as unauthenticated
      req.actor = null;
    }
  });
};
