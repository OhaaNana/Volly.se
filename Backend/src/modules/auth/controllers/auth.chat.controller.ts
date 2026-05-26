<<<<<<< Updated upstream
import { getChat } from "../../chat/chat.repo";
=======
import { getChat, getChatById } from "../../chat/chat.repo.ts";
>>>>>>> Stashed changes
import type { FastifyReply, FastifyRequest } from "fastify";

export async function getChatController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { roomId } = request.params as { roomId: string };
<<<<<<< Updated upstream
=======
  const userId = Number(request.user?.id);

  const chat = await getChatById(Number(roomId), request);

  if (!chat) {
    return reply.code(404).send({ message: "Chat not found" }); 
  }

  if (userId !== chat.creator_id && userId !== chat.post_author_id) {
    return reply.code(403).send({ message: "Not a participant" });
  }

>>>>>>> Stashed changes
  const result = await getChat(Number(roomId), request);
  return reply.send(result);
}
