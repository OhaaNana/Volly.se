import { type FastifyInstance } from "fastify";
import postgres from "@fastify/postgres";

export default function dbSetup(app: FastifyInstance){
  app.register(postgres, {
    connectionString: process.env.DATABASE_URL,
  });
  console.log(process.env.DATABASE_URL)
  console.log("Postgres Has Been Connected")
}