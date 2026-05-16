import type { FastifyInstance } from "fastify";
import postgres from "@fastify/postgres";

export default async function dbSetup(app: FastifyInstance) {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(" DATABASE_URL is missing in .env");
  }

  app.register(postgres, {
    connectionString,
  });

  app.addHook("onReady", async () => {
    try {
      await app.pg.query("SELECT 1");
      app.log.info(" PostgreSQL connected successfully");
    } catch (err) {
      app.log.error(" PostgreSQL connection failed");
      throw err;
    }
  });
}
