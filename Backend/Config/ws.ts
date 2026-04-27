import fastifyWebsocket from "@fastify/websocket";
import type { FastifyInstance } from "fastify";
import { connection } from "Backend/WebSocket/gateway";

export default function websocketSetup(app: FastifyInstance) {
  app.register(fastifyWebsocket)
  app.register(connection)
}
