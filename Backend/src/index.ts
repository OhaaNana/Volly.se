import fastify from "fastify";
import Setup from "./config/index.ts";
import setupErrorHandlers from "./shared/error/errorHanders";

async function start() {
  const app = await fastify({ logger: true });

  setupErrorHandlers(app);
  await Setup(app);

  app.listen({ port: 3001, host: "0.0.0.0" }, (address) =>
    console.log(`Server is running at ${address}`)
  );
}

start();
