import { getChatController } from "../auth/controllers/auth.chat.controller";
import {
  createChatHandler,
  listMyChatsHandler,
  updateChatStatusHandler,
} from "./chat.controller";
import { protect } from "../../middleware/auth.middleware";
import type { FastifyInstance } from "fastify";

export default async function chatRoutes(app: FastifyInstance) {
<<<<<<< Updated upstream
=======
  app.post("/chat", { preHandler: protect }, createChatHandler);
  app.get("/my", { preHandler: protect }, listMyChatsHandler);
  app.patch(
    "/chat/:chatId/status",
    { preHandler: protect },
    updateChatStatusHandler
  );

  app.get("/chat/:roomId", { preHandler: protect }, getChatController);

  // Test route
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

  app.get("/:roomId", {
    schema: {
      tags: ["Chat"],
      params: {
        type: "object",
        properties: {
          roomId: { type: "string", description: "Room ID" },
        },
      },
      response: {
        200: {
          description: "Chat messages",
          type: "object",
        },
      },
    },
    handler: getChatController,
  });
=======
>>>>>>> Stashed changes
}
