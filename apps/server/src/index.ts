import { buildApp } from "./app";
import { env } from "./config/env";

const app = buildApp();

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log(`
🚀 Server ready at http://${env.HOST}:${env.PORT}
📝 Environment: ${env.NODE_ENV}
🔧 Log Level: ${env.LOG_LEVEL}
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
const closeGracefully = async (signal: string) => {
  console.log(`\n⚠️  Received signal to terminate: ${signal}`);
  await app.close();
  process.exit(0);
};

process.on("SIGINT", () => closeGracefully("SIGINT"));
process.on("SIGTERM", () => closeGracefully("SIGTERM"));

start();
