import type { FastifyInstance } from "fastify";
import pluginSetup from "./plugin";
import dbSetup from "./db";
import websocketSetup from "./ws";

export default async function Setup(app: FastifyInstance) {
  dbSetup(app);
  await pluginSetup(app);
  await websocketSetup(app);
}
