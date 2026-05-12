import postgres from "@fastify/postgres";
import type { FastifyInstance } from "fastify";

export default function dbSetup(app: FastifyInstance) {
  app.register(postgres, {
    connectionString: process.env.DATABASE_URL,
  });
}
