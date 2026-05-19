import { type FastifyReply, type FastifyRequest } from "fastify";
import type { FastifyInstance } from "fastify/types/instance";

type AppError = Error & {
  validation?: unknown;
  code?: string; // PostgreSQL uses error codes like 23505
  statusCode?: number;
};

function isAppError(error: unknown): error is AppError {
  return typeof error === "object" && error !== null;
}

export default function setupErrorHandlers(app: FastifyInstance) {
  app.setErrorHandler(
    (error: unknown, request: FastifyRequest, reply: FastifyReply) => {
      if (!isAppError(error)) {
        console.log(error);
        return reply.status(500).send({
          error: "Internal Server Error",
          message: "Something Went Wrong",
        });
      }

      if (error.validation) {
        return reply.status(400).send({
          error: "Validation Failed",
          details: error.validation,
        });
      }

      if (error.code === "23505") {
        return reply.status(409).send({
          error: "Conflict",
          message: "This resource already exists",
        });
      }

      if (error.statusCode && error.statusCode < 500) {
        return reply.status(error.statusCode).send({
          error: error.name,
          message: error.message,
        });
      }

      console.log(error);

      return reply.status(500).send({
        error: "Internal Server Error",
        message: "Something Went Wrong",
      });
    }
  );

  app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    console.log(`Route not found: ${request.method}:${request.url}`);

    return reply.status(404).send({
      error: "Not Found",
      message: `Route ${request.method}:${request.url} does not exist`,
    });
  });
}