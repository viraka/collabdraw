import type { FastifyInstance } from "fastify";
import { exampleRoutes } from "@/modules/example/example.routes";
import { authRoutes } from "@/modules/auth/auth.routes";

export async function registerRouters(app: FastifyInstance) {
  app.register(exampleRoutes, { prefix: "" });
  app.register(authRoutes, { prefix: "/auth" });
  // app.register(roomRoutes, { prefix: "/rooms" });
  // app.register(drawRoutes, { prefix: "/draw" });
}
