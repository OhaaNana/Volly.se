import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import Setup from "./Config";
import routes from "./Routes";
import setupErrorHandlers from "./Config/errorHanders";

async function start() {
  const app = await fastify({ logger: true });

  await Setup(app);
  await app.register(routes);
  // await app.register(cors, {
  //   origin: "http://localhost:5173"
  // });

  app.get("/api/health", async () => {
    return { ok: true };
  });

  setupErrorHandlers(app);

  app.listen({ port: 3001, host: "0.0.0.0" }, (address) =>
    console.log(`Server is running at ${address}`),
  );
}

start();
