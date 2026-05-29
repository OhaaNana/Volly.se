import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createOrGetChat,
  getChatById,
  getMyChats,
  updateChatStatus,
} from "./chat.repo";
import type { ChatStatus } from "../../shared/types/chat.types";

export async function createChatHandler(
  request: FastifyRequest<{ Body: { postId: number } }>,
  reply: FastifyReply
) {
  const userId = Number(request.user?.id);
  const { postId } = request.body;

  if (!userId || !postId) {
    return reply.code(400).send({ message: "postId required" });
  }

  const postRes = await request.server.pg.query<{ user_id: number }>(
    "SELECT user_id FROM post WHERE id = $1",
    [postId]
  );

  const post = postRes.rows[0];

  if (!post) {
    return reply.code(404).send({ message: "Post not found" });
  }

  if (post.user_id === userId) {
    return reply.code(400).send({ message: "Cannot contact your own post" });
  }

  const chat = await createOrGetChat(postId, userId, request);
  return reply.send(chat);
}

export async function listMyChatsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = Number(request.user?.id);
  if (!userId) return reply.code(401).send({ message: "Not authenticated" });
  const chats = await getMyChats(userId, request);
  return reply.send(chats);
}

export async function updateChatStatusHandler(
  request: FastifyRequest<{
    Params: { chatId: string };
    Body: { status: ChatStatus };
  }>,
  reply: FastifyReply
) {
  const userId = Number(request.user?.id);
  if (!userId) {
    return reply.code(401).send({ message: "Not authenticated" });
  }

  const chatId = Number(request.params.chatId);
  const { status } = request.body;

  if (!["pending", "accepted", "denied"].includes(status)) {
    return reply.code(400).send({ message: "Invalid status" });
  }

  const existing = await getChatById(chatId, request);
  if (!existing) {
    return reply.code(404).send({ message: "Chat not found" });
  }

  if (existing.post_author_id !== userId) {
    return reply.code(403).send({ message: "Only the recipient can decide" });
  }

  const updated = await updateChatStatus(chatId, userId, status, request);
  return reply.send(updated);
}
