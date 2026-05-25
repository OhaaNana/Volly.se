import { getChat } from "../../chat/chat.repo";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function getChatController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { roomId } = request.params as { roomId: string };
  const result = await getChat(Number(roomId), request);
  return reply.send(result);
}
