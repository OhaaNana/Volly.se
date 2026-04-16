import type { WebSocket } from "@fastify/websocket";
import type { FastifyRequest } from "fastify";
import type { FastifyInstance } from "fastify/types/instance";

export async function chatroom(app: FastifyInstance) {
  app.get(
    "/chat/:room",
    { websocket: true },
    (socket: WebSocket, request: FastifyRequest) => {
      const room = request.params;
      socket.data = { room };

      socket.on("message", (msg: string) => {});
    },
  );
}
