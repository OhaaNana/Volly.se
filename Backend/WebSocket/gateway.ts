import type { FastifyInstance, FastifyRequest } from "fastify";
import { users, rooms } from "./rooms";
import type { WebSocket } from "@fastify/websocket";

import { registerChatevents } from "./events";

export async function connection(app: FastifyInstance) {
  app.get(
    "/chat",
    { websocket: true },
    (socket: WebSocket, request: FastifyRequest) => {
      const { userId, roomId } = request.query as {
        userId: string;
        roomId: string;
      };

      console.log("Connected Server");

      users.set(socket, { userId, roomId });

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId)!.add(socket);

      console.log(`${userId} has Connected to Room: ${roomId}`);

      registerChatevents(socket, request);
    }
  );
}