import type { FastifyInstance } from "fastify";
import { env } from "../config/env";
import {} from "@collabdraw/types";

export async function registerRouters(app: FastifyInstance) {
  // Health check
  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  }));

  // Example protected route
  app.get("/api/example", async () => ({
    message: "This route uses JWT",
  }));

  // Database check
  app.get("/api/db-status", async () => ({
    database: env.DATABASE_URL ? "configured" : "not configured",
  }));

  // future:
  // app.register(authRoutes, { prefix: "/auth" });
  // app.register(roomRoutes, { prefix: "/rooms" });
  // app.register(drawRoutes, { prefix: "/draw" });
}
