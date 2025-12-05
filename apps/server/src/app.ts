import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { env } from "./config/env";
import { registerRouters } from "./routers";
import { authPlugin } from "./plugins/auth";
import { errorHandlerPlugin } from "./plugins/error-handler";
import fastifyCookie from "@fastify/cookie";

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
  app.register(fastifyCookie, {
    secret: env.COOKIE_SECRET,
  });
  app.register(authPlugin);
  app.register(errorHandlerPlugin);
  // Registers health, example, db-status and future routes
  registerRouters(app);

  return app;
}
