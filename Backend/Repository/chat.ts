import type { Payload } from "Backend/Types/chat";
import type { FastifyRequest } from "fastify";

export async function saveMessage(
  payload: Payload,
  request: FastifyRequest,
): Promise<Payload> {
  const query = `INSERT INTO messages (message, sender_id, id, created_at) VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await request.server.pg.query(query, [
    payload.message,
    payload.userId,
    payload.roomId,
    payload.created_at,
  ]);
  return result.rows[0];
}

export async function getChat(
  room_id: number,
  request: FastifyRequest,
): Promise<Payload[]> {
  const query = `SELECT id, text_message, sender_id, room_id, created_at FROM messages WHERE room_id = $1 ORDER BY created_at ASC`;
  const result = await request.server.pg.query(query, [room_id]);
  return result.rows;
}
