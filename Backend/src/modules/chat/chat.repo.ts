import type {
  ChatRow,
  ChatStatus,
  Payload,
} from "../../shared/types/chat.types";
import type { FastifyRequest } from "fastify";

export async function saveMessage(
  payload: Payload,
  request: FastifyRequest
): Promise<Payload> {
  const result = await request.server.pg.query<Payload>(
    `INSERT INTO messages (request_id, sender_id, text_message, created_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id, request_id, sender_id, text_message, created_at,
       (SELECT email FROM users WHERE id = $2) AS sender_email`,
    [
      payload.request_id,
      payload.sender_id,
      payload.text_message,
      payload.created_at,
    ]
  );
  return result.rows[0];
}

export async function getChat(
  request_id: number,
  request: FastifyRequest
): Promise<Payload[]> {
  const result = await request.server.pg.query<Payload>(
    `SELECT id, request_id, sender_id, text_message, created_at
     FROM messages
     WHERE request_id = $1
     ORDER BY created_at ASC`,
    [request_id]
  );

  const messages = result.rows;

  for (const message of messages) {
    if (message.sender_id) {
      const user = await request.server.pg.query<{ email: string }>(
        `SELECT email FROM users WHERE id = $1`,
        [message.sender_id]
      );
      message.sender_email = user.rows[0]?.email ?? null;
    }
  }

  return messages;
}

export async function getChatById(
  chatId: number,
  request: FastifyRequest
): Promise<ChatRow | null> {
  const chat = await request.server.pg.query<{
    id: number;
    post_id: number;
    creator_id: number;
    status: ChatStatus;
    created_at: string;
  }>(
    `SELECT id, post_id, creator_id, status, created_at FROM request WHERE id = $1`,
    [chatId]
  );
  if (!chat.rows[0]) return null;
  const r = chat.rows[0];

  const post = await request.server.pg.query<{
    title: string;
    user_id: number;
  }>(`SELECT title, user_id FROM post WHERE id = $1`, [r.post_id]);
  const p = post.rows[0];

  const creator = await request.server.pg.query<{
    first_name: string;
    last_name: string;
    email: string;
  }>(`SELECT first_name, last_name, email FROM users WHERE id = $1`, [
    r.creator_id,
  ]);
  const c = creator.rows[0];

  const author = await request.server.pg.query<{
    first_name: string;
    last_name: string;
    email: string;
  }>(`SELECT first_name, last_name, email FROM users WHERE id = $1`, [
    p.user_id,
  ]);
  const a = author.rows[0];

  return {
    id: r.id,
    post_id: r.post_id,
    creator_id: r.creator_id,
    status: r.status,
    created_at: r.created_at,
    post_title: p.title,
    post_author_id: p.user_id,
    creator_first_name: c.first_name,
    creator_last_name: c.last_name,
    creator_email: c.email,
    author_first_name: a.first_name,
    author_last_name: a.last_name,
    author_email: a.email,
  };
}

export async function createOrGetChat(
  postId: number,
  creatorId: number,
  request: FastifyRequest
): Promise<ChatRow | null> {
  const result = await request.server.pg.query<{ id: number }>(
    `INSERT INTO request (post_id, creator_id, status)
     VALUES ($1, $2, 'pending')
     ON CONFLICT (post_id, creator_id) DO UPDATE SET post_id = EXCLUDED.post_id
     RETURNING id`,
    [postId, creatorId]
  );
  return getChatById(result.rows[0].id, request);
}

export async function getMyChats(
  userId: number,
  request: FastifyRequest
): Promise<ChatRow[]> {
  const result = await request.server.pg.query<{ id: number }>(
    `SELECT id FROM request WHERE creator_id = $1 OR post_id IN (
       SELECT id FROM post WHERE user_id = $1
     )
     ORDER BY created_at DESC`,
    [userId]
  );

  const chats: ChatRow[] = [];
  for (const row of result.rows) {
    const chat = await getChatById(row.id, request);
    if (chat) chats.push(chat);
  }
  return chats;
}

export async function updateChatStatus(
  chatId: number,
  recipientId: number,
  status: ChatStatus,
  request: FastifyRequest
): Promise<ChatRow | null> {
  const chat = await getChatById(chatId, request);
  if (!chat || chat.post_author_id !== recipientId) return null;

  await request.server.pg.query(
    `UPDATE request SET status = $1 WHERE id = $2`,
    [status, chatId]
  );

  return getChatById(chatId, request);
}
