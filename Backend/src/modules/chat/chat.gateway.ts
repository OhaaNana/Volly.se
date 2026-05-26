import type { FastifyInstance, FastifyRequest } from "fastify";
import { users, rooms } from "./chat.rooms";
import type { WebSocket } from "@fastify/websocket";

import { registerChatevents } from "./chat.events";
import { getChatById } from "./chat.repo";

export async function connection(app: FastifyInstance) {
  app.get(
    "/chat",
    { websocket: true },
    async (socket: WebSocket, request: FastifyRequest) => {
      const { userId, roomId } = request.query as {
        userId: string;
        roomId: string;
      };

      if (!userId || !roomId) {
        socket.close(1008, "Missing userId/roomId");
        return;
      }

      const chat = await getChatById(Number(roomId), request);
      if (!chat) {
        socket.close(1008, "Chat not found");
        return;
      }

      const uid = Number(userId);
      if (uid !== chat.creator_id && uid !== chat.post_author_id) {
        socket.close(1008, "Not a participant");
        return;
      }

      users.set(socket, { userId, roomId });
      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId)!.add(socket);

      registerChatevents(socket, request);
    }
  );
}
