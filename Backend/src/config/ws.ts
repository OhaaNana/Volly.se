import fastifyWebsocket from "@fastify/websocket";
import type { FastifyInstance } from "fastify";
import { connection } from "../modules/chat/chat.gateway";

export default function websocketSetup(app: FastifyInstance) {
  app.register(fastifyWebsocket);
  app.register(connection);
}
