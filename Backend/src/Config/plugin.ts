import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

export default async function pluginSetup(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Volly API",
        version: "1.0.0",
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.register(fastifyCors, {
    origin: ["http://localhost:5174"],
  });
  app.register(fastifyHelmet);
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
}
