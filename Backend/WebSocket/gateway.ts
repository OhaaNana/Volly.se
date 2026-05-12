import type { WebSocket } from "@fastify/websocket";
import type { FastifyInstance, FastifyRequest } from "fastify";
import { registerChatevents } from "./events";
import { rooms, users } from "./rooms";

export async function connection(app: FastifyInstance) {
  app.get(
    "/chat",
    { websocket: true },
    (socket: WebSocket, request: FastifyRequest) => {
      const { userId, roomId } = request.query as {
        userId: string;
        roomId: string;
      };

      //if (!query || !query.userId || !query.roomId) {
      //console.log("Invalid query:", request.query);
      //socket.close(1009, "Invalid query parameters");
      //return;
      //}

      if (!userId || !roomId) {
        console.log("Missing query params");
        socket.close(1008, "Invalid query parameters bla");
        return;
      }
      users.set(socket, { userId, roomId });

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId)!.add(socket);

      registerChatevents(socket, request);
    }
  );
}
