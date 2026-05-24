import fastify from "fastify";
import dotenv from "dotenv";
import websocket from "@fastify/websocket";

import Setup from "./Config";
import setupErrorHandlers from "./shared/error/errorHanders";

dotenv.config();

async function start() {
  const app = fastify({ logger: true });

  setupErrorHandlers(app);

  await app.register(websocket);

  await Setup(app);

  app.get("/chat", { websocket: true }, (connection) => {
    console.log("Client connected");

    connection.on("message", (message: { toString: () => any }) => {
      console.log("Received:", message.toString());

      connection.send(message.toString());
    });

    connection.on("close", () => {
      console.log("Client disconnected");
    });
  });

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
