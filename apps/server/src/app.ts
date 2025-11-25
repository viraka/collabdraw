import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { env } from "./config/env";
import { registerRouters } from "./routers";

export function buildApp() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
  });

  // CORS config
  const baseCorsConfig = {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  };

  app.register(fastifyCors, baseCorsConfig);

  // Registers health, example, db-status and future routes
  registerRouters(app);

  return app;
}
