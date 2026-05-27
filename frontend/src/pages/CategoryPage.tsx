import { useMemo, useState } from "react";
import PostCard from "../components/PostCard";

export type CategoryPost = {
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

export type CategoryKey =
  | "allt"
  | "mental"
  | "teknik"
  | "vardag"
  | "studier"
  | "sprak"
  | "karriar";

const CATEGORY_CARDS: readonly {
  id: CategoryKey;
  label: string;
  icon: string;
  filterLabel: string | null;
}[] = [
  { id: "allt", label: "Allt", icon: "✨", filterLabel: null },
  {
    id: "mental",
    label: "Mental hälsa",
    icon: "🌿",
    filterLabel: "Mental hälsa",
  },
  { id: "teknik", label: "Teknik", icon: "💻", filterLabel: "Teknik" },
  { id: "vardag", label: "Vardag", icon: "🤝", filterLabel: "Vardag" },
  { id: "studier", label: "Studier", icon: "📚", filterLabel: "Studier" },
  { id: "sprak", label: "Språk", icon: "🗣️", filterLabel: "Språk" },
  { id: "karriar", label: "Karriär", icon: "💼", filterLabel: "Karriär" },
] as const;

function formatTimeAgo(createdAt: number): string {
  if (typeof createdAt !== "number" || Number.isNaN(createdAt)) return "Okänt";
  const normalized = createdAt < 1e12 ? createdAt * 1000 : createdAt;
  const sec = Math.floor((Date.now() - normalized) / 1000);
  if (sec < 60) return "nyss";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min sen`;
  const h = Math.floor(min / 60);
  if (h < 48) return `${h}h sen`;
  const d = Math.floor(h / 24);
  return `${d} d sen`;
}

function badgeForPost(post: CategoryPost): string {
  if (post.postType === "seek") return "Söker hjälp";
  if (post.postType === "offer") return "Erbjuder hjälp";
  return "Inlägg";
}

type Props = {
  posts: CategoryPost[];
  onProfile?: (authorEmail?: string) => void;
  onDeletePost?: (postId: string) => void;
  currentUserEmail?: string | null;
  initialCategory?: CategoryKey;
  onContact?: (post: CategoryPost) => void;
};

function formatDisplayName(post: CategoryPost) {
  const fullName = `${post.first_name ?? ""} ${post.last_name ?? ""}`.trim();
  if (fullName) return fullName;
  if (post.author_email) {
    const localPart = post.author_email.split("@")[0] ?? "";
    const parts = localPart.split(/[._-]/).filter(Boolean);
    if (parts.length > 0) {
      return parts
        .slice(0, 2)
        .map((part) => part.replace(/^\w/, (char) => char.toUpperCase()))
        .join(" ");
    }
  }
  return "Okänt namn";
}

export default function CategoryPage({
  posts,
  onProfile,
  onDeletePost,
  currentUserEmail,
  onContact,
  initialCategory,
  onContact,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(
    initialCategory ?? "allt"
  );
  const [prevInitialCategory, setPrevInitialCategory] =
    useState(initialCategory);
  const [postKind, setPostKind] = useState<"seek" | "offer">("seek");
  const [searchQuery, setSearchQuery] = useState("");

  if (initialCategory !== prevInitialCategory) {
    setPrevInitialCategory(initialCategory);
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }

  const activeFilterLabel =
    CATEGORY_CARDS.find((c) => c.id === activeCategory)?.filterLabel ?? null;

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts.filter((p) => {
      const typeOk = !p.postType || p.postType === postKind;
      if (!typeOk) return false;
      if (activeFilterLabel !== null && p.category !== activeFilterLabel) {
        return false;
      }

      if (!query) return true;

      const authorName = formatDisplayName(p).toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        (p.category?.toLowerCase().includes(query) ?? false) ||
        authorName.includes(query) ||
        (p.author_email?.toLowerCase().includes(query) ?? false) ||
        (p.first_name?.toLowerCase().includes(query) ?? false) ||
        (p.last_name?.toLowerCase().includes(query) ?? false) ||
        (p.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false)
      );
    });
  }, [posts, activeFilterLabel, postKind, searchQuery]);

  const count = filteredPosts.length;
  const emptyMessage = searchQuery.trim()
    ? "Inga inlägg matchar din sökning."
    : "Inga inlägg matchar filtret ännu.";

  return (
    <div className="w-full min-w-0 self-stretch px-6 py-10 inline-flex flex-col justify-start items-center gap-8">
      <div className="w-full max-w-[900px] flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-Colors-foreground text-3xl font-bold font-['DM_Sans'] tracking-tight sm:text-4xl">
            Kategorier
          </h1>
          <p className="text-Colors-muted-foreground text-base font-medium font-['DM_Sans']">
            Hitta inlägg inom specifika kategorier
          </p>
        </header>

        <div className="self-stretch pb-8 inline-flex justify-start items-start gap-3">
          {CATEGORY_CARDS.map((cat) => {
            const selected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={selected}
                className={`flex-1 min-w-0 p-4 rounded-2xl outline outline-1 outline-offset-[-1px] inline-flex flex-col justify-center items-start font-['DM_Sans'] ${
                  selected
                    ? "bg-Colors-foreground outline-Colors-foreground"
                    : "bg-Colors-card outline-Colors-border"
                }`}
              >
                <div className="pb-1 flex flex-col justify-center items-center">
                  <div
                    className="justify-start text-foreground text-2xl font-semibold font-['DM_Sans']"
                    aria-hidden
                  >
                    {cat.icon}
                  </div>
                </div>
                <div
                  className={`justify-start text-sm font-semibold font-['DM_Sans'] ${
                    selected
                      ? "text-Colors-background"
                      : "text-Colors-foreground"
                  }`}
                >
                  {cat.label}
                </div>
              </button>
            );
          })}
        </div>

        <label className="w-full p-2.5 bg-white-3 rounded-[40px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.07)] outline outline-1 outline-offset-[-1px] outline-stone-300/40 inline-flex justify-start items-center gap-3 overflow-hidden cursor-text">
          <i
            aria-hidden
            className="fi fi-br-search-heart ml-1 shrink-0 text-[20px] leading-none text-zinc-500"
          />
          <span className="sr-only">Sök efter inlägg, ämnen, taggar</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök efter inlägg, ämnen, taggar..."
            className="flex-1 min-w-0 bg-transparent font-['DM_Sans'] text-base font-normal leading-5 text-foreground outline-none placeholder:text-zinc-500"
          />
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-Colors-foreground text-lg font-semibold font-['DM_Sans'] sm:text-xl">
            Alla inlägg ({count})
          </h2>
          <div
            className="inline-flex w-fit rounded-full bg-Colors-muted/90 p-1 outline outline-1 -outline-offset-1 outline-Colors-border"
            role="group"
            aria-label="Filtrera på typ av hjälp"
          >
            <button
              type="button"
              onClick={() => setPostKind("seek")}
              aria-pressed={postKind === "seek"}
              className={`rounded-full px-5 py-2 text-sm font-semibold font-['DM_Sans'] transition-colors ${
                postKind === "seek"
                  ? "bg-white text-Colors-foreground shadow-sm"
                  : "text-Colors-muted-foreground hover:text-Colors-foreground"
              }`}
            >
              Söker
            </button>
            <button
              type="button"
              onClick={() => setPostKind("offer")}
              aria-pressed={postKind === "offer"}
              className={`rounded-full px-5 py-2 text-sm font-semibold font-['DM_Sans'] transition-colors ${
                postKind === "offer"
                  ? "bg-white text-Colors-foreground shadow-sm"
                  : "text-Colors-muted-foreground hover:text-Colors-foreground"
              }`}
            >
              Erbjuder
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col items-stretch gap-6">
          {filteredPosts.length === 0 ? (
            <p className="rounded-2xl bg-Colors-card px-5 py-8 text-center text-Colors-muted-foreground outline outline-1 -outline-offset-1 outline-Colors-border font-['DM_Sans'] text-sm font-medium">
              {emptyMessage}
            </p>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                authorName={formatDisplayName(post)}
                authorFirstName={post.first_name}
                authorLastName={post.last_name}
                authorInitials={
                  post.first_name || post.last_name
                    ? `${post.first_name ?? ""}${post.last_name ?? ""}`
                        .trim()
                        .slice(0, 2)
                        .toUpperCase()
                    : post.author_email
                      ? post.author_email
                          .split("@")[0]
                          .split(/[._-]/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0]?.toUpperCase() ?? "")
                          .join("")
                      : undefined
                }
                timeLabel={formatTimeAgo(post.createdAt)}
                badgeLabel={badgeForPost(post)}
                title={post.title}
                body={post.content}
                category={post.category}
                tags={post.tags}
                onProfile={
                  onProfile ? () => onProfile(post.author_email) : undefined
                }
                onContact={onContact ? () => onContact(post) : undefined}
                onDelete={
                  onDeletePost &&
                  currentUserEmail &&
                  post.author_email === currentUserEmail
                    ? () => onDeletePost(post.id)
                    : undefined
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
