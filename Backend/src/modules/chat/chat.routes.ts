import { getChatController } from "../auth/controllers/auth.chat.controller";
import {
  createChatHandler,
  listMyChatsHandler,
  updateChatStatusHandler,
} from "./chat.controller";
import { protect } from "../../middleware/auth.middleware";
import type { FastifyInstance } from "fastify";

export default async function chatRoutes(app: FastifyInstance) {
  app.get("/health", {
    schema: {
      tags: ["Health"],
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
          },
        },
      },
    },
    handler: async (_req, reply) => {
      return reply.send({ status: "ok" });
    },
  });

  app.post("/chat", { preHandler: protect }, createChatHandler);
  app.get("/my", { preHandler: protect }, listMyChatsHandler);
  app.patch(
    "/chat/:chatId/status",
    { preHandler: protect },
    updateChatStatusHandler
  );

  app.get("/chat/:roomId", { preHandler: protect }, getChatController);
}
