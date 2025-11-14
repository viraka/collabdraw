import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { env } from "./env";
const baseCorsConfig = {
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
};

const fastify = Fastify({
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

fastify.register(fastifyCors, baseCorsConfig);

// Health check route
fastify.get("/health", async (request, reply) => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  };
});

// Example protected route using JWT_SECRET
fastify.get("/api/example", async (request, reply) => {
  return {
    message: "This route uses JWT",
    // You would verify JWT here using env.JWT_SECRET
  };
});

// Example database route
fastify.get("/api/db-status", async (request, reply) => {
  return {
    database: env.DATABASE_URL ? "configured" : "not configured",
    // You would check actual DB connection here
  };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log(`
🚀 Server ready at http://${env.HOST}:${env.PORT}
📝 Environment: ${env.NODE_ENV}
🔧 Log Level: ${env.LOG_LEVEL}
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
const closeGracefully = async (signal: string) => {
  console.log(`\n⚠️  Received signal to terminate: ${signal}`);
  await fastify.close();
  process.exit(0);
};

process.on("SIGINT", () => closeGracefully("SIGINT"));
process.on("SIGTERM", () => closeGracefully("SIGTERM"));

start();
