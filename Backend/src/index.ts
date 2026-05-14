import fastify from "fastify";
import Setup from "./Config";
import setupErrorHandlers from "./shared/error/errorHanders";

async function start() {
  const app = await fastify({ logger: true });

  setupErrorHandlers(app);
  await Setup(app);

  const port = Number(process.env.PORT) || 3001;
  try {
    const address = await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`Server is running at ${address}`);
  } catch (err) {
    app.log.error(err);
    if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code === "EADDRINUSE") {
      app.log.error(`Port ${port} is already in use. Stop the other process or set PORT to another value.`);
    }
    process.exit(1);
  }
}

start();
