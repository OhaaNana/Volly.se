export type UserMeta = {
  userId: string;
  roomId: string;
};

export type Payload = {
  userId: number;
  roomId: number;
  text_message: string;
  created_at: string;
};
