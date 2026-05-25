export type CreatePostInput = {
  user_id: number;
  category: string;
  title: string;
  description: string;
  help_type: string;
};

export type PostRow = {
  id: number;
  user_id: number;
  category: string;
  title: string;
  description: string | null;
  help_type: string | null;
  created_at: Date;
  updated_at: Date;
};
