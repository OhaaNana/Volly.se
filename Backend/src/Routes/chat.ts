import { getChatController } from "Backend/Controllers/chat";
import type { FastifyInstance } from "fastify";

export default async function chatRoutes(app: FastifyInstance) {
  app.get("/chat/:roomId", getChatController);
}
