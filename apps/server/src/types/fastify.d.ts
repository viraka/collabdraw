import "fastify";
import type { Actor } from "@collabdraw/types";

declare module "fastify" {
  interface FastifyRequest {
    actor: Actor | null;
  }
}
