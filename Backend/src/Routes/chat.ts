import type { FastifyInstance } from "fastify";
import { getChatController } from "../../Controllers/chat";

export default async function chatRoutes(app: FastifyInstance) {
  app.get("/chat/:roomId", getChatController);
}
