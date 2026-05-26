export type UserMeta = {
  userId: string;
  roomId: string;
};

export type Payload = {
  id?: number;
  request_id: number;
  sender_id: number;
  sender_email?: string;
  text_message: string;
  created_at: string;
};

export type ChatStatus = "pending" | "accepted" | "denied";

export type ChatRow = {
  id: number;
  post_id: number;
  creator_id: number;
  status: ChatStatus;
  created_at: string;
  post_title: string;
  post_author_id: number;
  creator_first_name: string | null;
  creator_last_name: string | null;
  creator_email: string;
  author_first_name: string | null;
  author_last_name: string | null;
  author_email: string;
};
