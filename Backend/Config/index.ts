import type { FastifyInstance } from "fastify";
import pluginSetup from "./plugin";
import dbSetup from "./db";
import websocketSetup from "./ws";

export default function Setup(app: FastifyInstance) {
  app.register(websocketSetup);
  app.register(pluginSetup);
  app.register(dbSetup);
}
