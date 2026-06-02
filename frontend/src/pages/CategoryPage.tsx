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
  | "halsa"
  | "teknik"
  | "vardag"
  | "studier"
  | "sprak"
  | "karriar"
  | "administration"
  | "socialt"
  | "funktionsvariation"
  | "ovrigt";

const CATEGORY_CARDS: readonly {
  id: CategoryKey;
  label: string;
  icon: string;
  filterLabel: string | null;
}[] = [
  { id: "allt", label: "Allt", icon: "✨", filterLabel: null },
  { id: "halsa", label: "Hälsa", icon: "💚", filterLabel: "Hälsa" },
  { id: "teknik", label: "Teknik", icon: "💻", filterLabel: "Teknik" },

  { id: "vardag", label: "Vardag", icon: "🤝", filterLabel: "Vardag" },

  { id: "studier", label: "Studier", icon: "📚", filterLabel: "Studier" },

  { id: "sprak", label: "Språk", icon: "🗣️", filterLabel: "Språk" },

  { id: "karriar", label: "Karriär", icon: "💼", filterLabel: "Karriär" },

  {
    id: "administration",
    label: "Administration",
    icon: "📋",
    filterLabel: "Administration",
  },

  { id: "socialt", label: "Socialt", icon: "👥", filterLabel: "Socialt" },

  {
    id: "funktionsvariation",
    label: "Funktionsvariation",
    icon: "🧩",
    filterLabel: "Funktionsvariation",
  },

  { id: "ovrigt", label: "Övrigt", icon: "📦", filterLabel: "Övrigt" },
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

  const headingLabel =
    activeCategory === "allt"
      ? "Alla inlägg"
      : (CATEGORY_CARDS.find((cat) => cat.id === activeCategory)?.label ??
        "Alla inlägg");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
      <header className="mb-6">
        <h1 className="font-display mb-1 text-3xl font-bold tracking-tight">
          Kategorier
        </h1>
        <p className="text-muted-foreground">
          Hitta hjälp inom ett ämne — eller erbjuda din egen.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORY_CARDS.map((cat) => {
          const selected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={selected}
              className={`rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <div className="mb-1 text-2xl" aria-hidden>
                {cat.icon}
              </div>
              <div className="text-sm font-semibold leading-tight">
                {cat.label}
              </div>
            </button>
          );
        })}
      </div>

      <label className="mb-6 inline-flex w-full items-center gap-3 overflow-hidden rounded-full border border-border bg-card p-3 shadow-soft">
        <i
          aria-hidden
          className="fi fi-br-search-heart ml-1 shrink-0 text-4 leading-none text-zinc-500"
        />
        <span className="sr-only">Sök efter inlägg, ämnen, taggar</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Sök efter inlägg, ämnen, taggar..."
          className="min-w-0 flex-1 text-sm font-normal text-foreground outline-none placeholder:text-zinc-500"
        />
      </label>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-bold">
          {headingLabel}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({count})
          </span>
        </h2>

        <div
          className="inline-flex w-fit rounded-full border border-border bg-muted p-1"
          role="group"
          aria-label="Filtrera på typ av hjälp"
        >
          <button
            type="button"
            onClick={() => setPostKind("seek")}
            aria-pressed={postKind === "seek"}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              postKind === "seek"
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Söker
          </button>
          <button
            type="button"
            onClick={() => setPostKind("offer")}
            aria-pressed={postKind === "offer"}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              postKind === "offer"
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Erbjuder
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-6">
        {filteredPosts.length === 0 ? (
          <p className="rounded-2xl bg-card px-5 py-8 text-center text-sm font-medium text-muted-foreground outline -outline-offset-1 outline-border">
            {emptyMessage}
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredPosts.map((post) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
