import fastifyWebsocket from "@fastify/websocket";
import type { FastifyInstance } from "fastify/types/instance";
import { connection } from "Backend/WebSocket";

export default async function websocketSetup(app: FastifyInstance) {
  app.register(fastifyWebsocket)
  app.register(connection)
}
