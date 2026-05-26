export type SavedPost = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  postType?: "seek" | "offer";
  category?: string;
  tags?: string[];
  author_email?: string;
  first_name?: string;
  last_name?: string;
};

function storageKey(userEmail: string) {
  return `volly:savedPosts:${userEmail}`;
}

export function loadSavedPosts(userEmail: string): SavedPost[] {
  try {
    const raw = localStorage.getItem(storageKey(userEmail));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as SavedPost[];
  } catch {
    return [];
  }
}

export function persistSavedPosts(userEmail: string, posts: SavedPost[]) {
  localStorage.setItem(storageKey(userEmail), JSON.stringify(posts));
}
