import fastifyWebsocket from "@fastify/websocket";
import type { FastifyInstance } from "fastify";
import { connection } from "../modules/chat/chat.gateway";

export default async function websocketSetup(app: FastifyInstance) {
  await app.register(fastifyWebsocket);
  await app.register(connection, { prefix: "/api" });
}
