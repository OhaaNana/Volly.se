import { type FastifyInstance } from "fastify";
import fastifyPostgres from "@fastify/postgres";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export default async function dbSetup(app: FastifyInstance){
  await app.register(fastifyPostgres, {
    connectionString: process.env.POSTGRES_URI,
  });
}