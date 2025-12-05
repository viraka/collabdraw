import { ErrorCode } from "@collabdraw/types";
import type { FastifyReply } from "fastify";

export function success<T>(
  reply: FastifyReply,
  data: T,
  message = "Success",
  statusCode = 200
) {
  return reply.status(statusCode).send({
    success: true,
    message,
    data,
  });
}

export function failure(
  reply: FastifyReply,
  message = "Something went wrong",
  statusCode = 400,
  code = ErrorCode.UNKNOWN_ERROR,
  details?: unknown
) {
  return reply.status(statusCode).send({
    success: false,
    message,
    error: {
      code,
      details,
    },
  });
}
