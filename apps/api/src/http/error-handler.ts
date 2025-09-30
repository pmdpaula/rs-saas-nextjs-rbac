import type { FastifyInstance } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { ZodError } from "zod";

import { BadRequestError } from "./routes/_errors/bad-request-error";
import { UnauthorizedError } from "./routes/_errors/unauthorized-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  // console.log(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({ message: "Validation error", errors: error.issues });
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    console.error("Zod schema validation error", error);
    return reply.status(400).send({ message: "Validation error", errors: error.message });
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({ message: error.message });
  }

  console.error(error);

  // send error to Sentry, Datadog, etc.

  return reply.status(500).send({ message: "Internal Server Error" });
};
