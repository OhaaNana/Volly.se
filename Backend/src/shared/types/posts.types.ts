export type CreatePostInput = {
  user_id: number;
  category: string;
  title: string;
  description: string;
  help_type: string;
  tagg: string;
};

export type PostRow = {
  id: number;
  user_id: number;
  category: string;
  title: string;
  description: string | null;
  help_type: string | null;
  tagg: string;
  created_at: Date;
  updated_at: Date;
};
