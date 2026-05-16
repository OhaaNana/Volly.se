import fastify from "fastify";
import dotenv from "dotenv";
import Setup from "./Config";
import setupErrorHandlers from "./shared/error/errorHanders";

dotenv.config();

async function start() {
  const app = fastify({ logger: true });

  setupErrorHandlers(app);

  await Setup(app);

  const port = Number(process.env.PORT) || 3001;

  app.listen({ port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    console.log(`Server is running at ${address}`);
  });
}

start();
