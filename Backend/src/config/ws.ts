import fastifyWebsocket from "@fastify/websocket";
import type { FastifyInstance } from "fastify";
import { connection } from "../modules/chat/chat.gateway";
import { videoChat } from "../modules/video-chat/video-chat";

export default async function websocketSetup(app: FastifyInstance) {
  await app.register(fastifyWebsocket);
  await app.register(connection, { prefix: "/api" });
  await app.register(videoChat);
}
