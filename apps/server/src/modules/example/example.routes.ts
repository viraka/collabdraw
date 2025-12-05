import { type FastifyInstance } from "fastify";
import { env } from "@/config/env";

export async function exampleRoutes(app: FastifyInstance) {
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
}
