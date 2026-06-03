import { getChat, getChatById } from "../../chat/chat.repo";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function getChatController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { roomId } = request.params as { roomId: string };
  const userId = Number(request.user?.id);

  const chat = await getChatById(Number(roomId), request);

  if (!chat) {
    return reply.code(404).send({ message: "Chat not found" });
  }

  if (userId !== chat.creator_id && userId !== chat.post_author_id) {
    return reply.code(403).send({ message: "Not a participant" });
  }

  const result = await getChat(Number(roomId), request);
  return reply.send(result);
}
