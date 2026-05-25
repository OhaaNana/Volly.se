import { getChatController } from "../auth/controllers/auth.chat.controller";
import type { FastifyInstance } from "fastify";

export default async function chatRoutes(app: FastifyInstance) {
  app.get("/chat/:roomId", {
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

  // Test route
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
}
