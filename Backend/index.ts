import fastify, { type FastifyInstance } from "fastify";
import Setup from "./Config";
import routes from "./Routes";
import setupErrorHandlers from "./Config/errorHanders"
import plugin from "./Config/plugin";
import dbSetup from "./Config/db";
import websocketSetup from "./Config/ws";

;

async function start() {
  const app = await fastify({ logger: true });

  app.register(websocketSetup);
  app.register(plugin);
  app.register(dbSetup); 
  
  await app.register(routes);

  setupErrorHandlers(app);

  app.listen({ port: 3001, host: "0.0.0.0" }, (address) =>
    console.log(`Server is running at ${address}`),
  );
}

start();
