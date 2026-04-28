import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify/types/instance";

export default function pluginSetup(app:FastifyInstance) {
  app.register(fastifyCors, {
    origin: ["http://localhost:3000", "http://localhost:3001"]
  })
  app.register(fastifyHelmet)
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
}