import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify/types/instance";

export default async function pluginSetup(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Volly API",
        version: "1.0.0",
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  app.register(fastifyCors, {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://staging-volly.labb.k3s.chas-lab.dev",
      "https://volly.labb.k3s.chas-lab.dev",
    ],
  });
  app.register(fastifyHelmet);
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
}
