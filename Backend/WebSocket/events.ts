import type { WebSocket } from "@fastify/websocket";
import type { FastifyRequest } from "fastify";
import { createPayload } from "../Services/chat";
import { rooms, users } from "./rooms";

export function registerChatevents(socket: WebSocket, request: FastifyRequest) {
  console.log("User has been connected to a room");
  socket.on("message", async (message: Buffer) => {
    try {
      const text = message.toString();
      const user = users.get(socket);
      if (!user) return;

      const payload = createPayload(user, text);
      // Needs post tabel
      // await saveMessage(payload, request);

      const roomClients = rooms.get(user.roomId) ?? new Set();

      for (const client of roomClients) {
        if (client !== socket && client.readyState === 1) {
          client.send(JSON.stringify(payload));
        }
      }
    } catch (err) {
      console.error("WS message error:", err);
    }
  });

  socket.on("close", () => {
    const user = users.get(socket);
    if (!user) return;

    rooms.get(user.roomId)?.delete(socket);
    users.delete(socket);
  });
}
