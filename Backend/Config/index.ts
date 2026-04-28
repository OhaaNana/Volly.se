import type { FastifyInstance } from "fastify";
import pluginSetup from "./plugin";
import dbSetup from "./db";
import websocketSetup from "./ws";

export default function Setup(app: FastifyInstance) {
  dbSetup(app)
  pluginSetup(app);
  websocketSetup(app);
}
