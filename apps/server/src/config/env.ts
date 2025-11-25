import "dotenv/config";
import { z } from "zod";

// Define your environment variable schema
const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),

  // Database
  DATABASE_URL: z.string().url({
    message: "DATABASE_URL must be a valid URL",
  }),

  // Auth
  JWT_SECRET: z.string().min(32, {
    message: "JWT_SECRET must be at least 32 characters for security",
  }),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // CORS (optional - Fastify CORS configuration)
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  // Optional services
  REDIS_URL: z.string().url().optional(),

  // Logging
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  // Add any other environment variables your app needs
  // STRIPE_SECRET_KEY: z.string().optional(),
  // AWS_REGION: z.string().default('us-east-1'),
  // SENTRY_DSN: z.string().url().optional(),
});

// Parse and validate
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;

// Export type for use in tests or type definitions
export type Env = z.infer<typeof envSchema>;

// Log successful load (only in development)
if (env.NODE_ENV === "development") {
  console.log("✅ Environment variables loaded successfully");
  console.log(`   NODE_ENV: ${env.NODE_ENV}`);
  console.log(`   PORT: ${env.PORT}`);
  console.log(`   HOST: ${env.HOST}`);
  console.log(`   LOG_LEVEL: ${env.LOG_LEVEL}`);
}
