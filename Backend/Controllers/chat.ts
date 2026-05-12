import type { FastifyReply, FastifyRequest } from "fastify";
import { getChat } from "../Repository/chat.ts";

export async function getChatController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { roomId } = request.params as { roomId: string };
  const result = getChat(Number(roomId), request);
  return reply.send(result);
}
