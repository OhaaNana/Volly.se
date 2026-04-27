import type { WebSocket } from "@fastify/websocket";
import type { FastifyRequest } from "fastify";

import { createPayload } from "Backend/Services/chat";
import { saveMessage } from "Backend/Repository";
import { users, rooms } from "./rooms"; 

export function registerChatevents(socket: WebSocket, request: FastifyRequest) {
  socket.on("message", async (message: any) => {
    const text = message.toString();
    const user = users.get(socket);
    if (!user) return;

    const payload = createPayload(user, text);

    await saveMessage(payload, request);

    const roomClients = rooms.get(user.roomId) ?? new Set();

    for (const client of roomClients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        console.log("Sending", JSON.stringify(payload));
        client.send(JSON.stringify(payload));
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
}
