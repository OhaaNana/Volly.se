import type { FastifyInstance } from "fastify";
import dbSetup from "./db";
import pluginSetup from "./plugin";
import websocketSetup from "./ws";

export default function Setup(app: FastifyInstance) {
  dbSetup(app);
  pluginSetup(app);
  websocketSetup(app);
}
