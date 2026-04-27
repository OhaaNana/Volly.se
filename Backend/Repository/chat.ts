import type { Payload } from "Backend/Types/index";

export async function saveMessage(
  payload: Payload,
  db: any,
): Promise<Payload> {
  const query = `
    INSERT INTO messages 
    (sender_id, id, text_message, created_at)
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await db.server.pg.query(query, [
    payload.userId,
    payload.roomId,
    payload.text_message,
    payload.created_at,
  ]);
  return result.rows[0];
}

export async function getChat(
  room_id: number,
  db:any
): Promise<Payload[]> {
  const query = `
    SELECT id, text_message, sender_id, room_id, created_at
    FROM messages
    WHERE room_id = $1
    ORDER BY created_at ASC`;
  const result = await db.server.pg.query(query, [room_id]);
  return result.rows;
}
