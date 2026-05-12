import { type FastifyInstance } from "fastify";
import fastifyPostgres from "@fastify/postgres";

export default async function dbSetup(app: FastifyInstance) {
  await app.register(fastifyPostgres, {
    connectionString: process.env.POSTGRES_URI,
  });
}
