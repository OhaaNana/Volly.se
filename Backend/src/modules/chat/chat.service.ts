import type { Payload, UserMeta } from "../../shared/types/chat.types";

export function createPayload(user: UserMeta, text: string): Payload {
  return {
    userId: Number(user.userId),
    roomId: Number(user.roomId),
    text_message: text,
    created_at: new Date().toISOString(),
  };
}
