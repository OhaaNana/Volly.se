import type { Payload, UserMeta } from "../../shared/types/chat.types";

export function createPayload(user: UserMeta, text: string): Payload {
  return {
    request_id: Number(user.roomId),
    sender_id: Number(user.userId),
    text_message: text,
    created_at: new Date().toISOString(),
  };
}
