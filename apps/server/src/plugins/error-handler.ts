import type { FastifyPluginAsync } from "fastify";
import { ZodError } from "zod";
import { AppError, ErrorCode } from "@/utils/app-error";

export const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error, req, reply) => {
    // ✅ 1. ZOD VALIDATION ERRORS
    if (error instanceof ZodError) {
      return reply.status(422).send({
        success: false,
        message: "Validation failed",
        error: {
          code: ErrorCode.ZOD_VALIDATION_ERROR,
          details: error.flatten(),
        },
      });
    }

    // ✅ 2. DOMAIN / BUSINESS ERRORS
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        message: error.message,
        error: {
          code: error.code,
          details: error.details,
        },
      });
    }

    // ✅ 3. UNKNOWN / SYSTEM ERRORS
    console.error("🔥 UNHANDLED ERROR:", error);

    return reply.status(500).send({
      success: false,
      message: "Internal server error",
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
      },
    });
  });
};
