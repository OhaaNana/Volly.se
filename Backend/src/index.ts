import fastify from "fastify";
import Setup from "./Config";
import routes from "./Routes";
import setupErrorHandlers from "./Config/errorHanders";

async function start() {
  const app = await fastify({ logger: true });

  setupErrorHandlers(app);
  await Setup(app);
  await app.register(routes);

  app.listen({ port: 3001, host: "0.0.0.0" }, (address) =>
    console.log(`Server is running at ${address}`)
  );
}

start();
