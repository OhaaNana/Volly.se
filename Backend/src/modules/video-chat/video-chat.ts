import { type FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { getChatById } from "../chat/chat.repo";

const rooms = new Map<string, Set<any>>();

export async function videoChat(app: FastifyInstance) {
  app.get("/ws/:roomId", { websocket: true }, async (socket, req) => {
    const { roomId } = req.params as { roomId: string };
    const { token } = req.query as { token?: string };

    if (!token) {
      socket.close(1008, "Missing token");
      return;
    }

    let userId: number;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { id: string };
      userId = Number(decoded.id);
    } catch {
      socket.close(1008, "Invalid token");
      return;
    }

    const chat = await getChatById(Number(roomId), req);
    if (!chat) {
      socket.close(1008, "Chat not found");
      return;
    }
    if (userId !== chat.creator_id && userId !== chat.post_author_id) {
      socket.close(1008, "Not a participant");
      return;
    }
    if (chat.status !== "accepted") {
      socket.close(1008, "Chat not accepted");
      return;
    }

    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
    const room = rooms.get(roomId)!;

    // Only allow 2 people per room
    if (room.size >= 2) {
      socket.send(JSON.stringify({ type: "room-full" }));
      socket.close();
      return;
    }

    room.add(socket);
    const isFirst = room.size === 1;
    console.log(`Room ${roomId}: ${room.size} peer(s)`);

    socket.send(
      JSON.stringify({
        type: "room-joined",
        role: isFirst ? "waiter" : "caller",
      })
    );

    if (!isFirst) {
      for (const client of room) {
        if (client !== socket) {
          client.send(JSON.stringify({ type: "peer-joined" }));
        }
      }
    }

    socket.on("message", (signalingData: Buffer | ArrayBuffer | Buffer[]) => {
      const signal = signalingData.toString();

      for (const client of room) {
        if (client !== socket && client.readyState === 1) {
          client.send(signal);
        }
      }
    });

    socket.on("close", () => {
      room.delete(socket);
      for (const client of room) {
        client.send(JSON.stringify({ type: "peer-left" }));
      }
      if (room.size === 0) rooms.delete(roomId);
    });
  });
}
