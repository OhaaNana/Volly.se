import type { WebSocket } from "@fastify/websocket";
import type { FastifyRequest } from "fastify";
import type { FastifyInstance } from "fastify/types/instance";
import type { UserMeta } from "Backend/Types/chat";

const rooms = new Map<string, Set<WebSocket>>();
const users = new Map<WebSocket, UserMeta>();

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

      socket.on("message", (message: any) => {
        const text = message.toString();
        const user = users.get(socket);
        if (!user) return;

        const payload = JSON.stringify({
          userId: user.userId,
          roomId: user.roomId,
          message: text,
          created_at: Date.now(),
        });

        const roomClients = rooms.get(user.roomId) ?? new Set();

        for (const client of roomClients) {
          if (client !== socket && client.readyState === WebSocket.OPEN) {
            console.log("Sending", payload);
            client.send(payload);
          }
        }
      });
      socket.on("close", () => {
        const user = users.get(socket);
        if (!user) return;

        const room = rooms.get(user.roomId);
        room?.delete(socket);

        users.delete(socket);

        console.log(`${user.userId} disconnected`);
      });
    },
  );
}
