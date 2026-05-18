import { type FastifyInstance} from "fastify";
import websocket from "@fastify/websocket";

const rooms = new Map<string, Set<any>>()

export async function videoChat(app: FastifyInstance) {
  app.get("/ws/:roomId", { websocket: true }, (socket, req) => {
    const { roomId } = req.params as { roomId: string };

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

    socket.on("signal", (signalingData: Buffer | ArrayBuffer | Buffer[]) => {
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
