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
};

type CategoryKey =
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
  /** Ikon – byts till riktiga assets när du levererar dem */
  icon: string;
  /** Matchar `post.category` från skapa-flödet; `null` = Allt */
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
  const sec = Math.floor((Date.now() - createdAt) / 1000);
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
};

export default function CategoryPage({ posts }: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("allt");
  const [postKind, setPostKind] = useState<"seek" | "offer">("seek");

  const activeFilterLabel =
    CATEGORY_CARDS.find((c) => c.id === activeCategory)?.filterLabel ?? null;

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const typeOk = !p.postType || p.postType === postKind;
      if (!typeOk) return false;
      if (activeFilterLabel === null) return true;
      return p.category === activeFilterLabel;
    });
  }, [posts, activeFilterLabel, postKind]);

  const count = filteredPosts.length;

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

        <div className="-mx-1 flex gap-3 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]">
          {CATEGORY_CARDS.map((cat) => {
            const selected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={selected}
                className={`flex min-w-[104px] shrink-0 flex-col items-center gap-2 rounded-2xl px-4 py-4 font-['DM_Sans'] transition-[background-color,color,box-shadow,outline-color] ${
                  selected
                    ? "bg-Colors-foreground text-white shadow-md outline outline-2 -outline-offset-2 outline-Colors-foreground"
                    : "bg-Colors-card text-Colors-foreground outline outline-1 -outline-offset-1 outline-Colors-border hover:bg-Colors-muted/60"
                }`}
              >
                <span className="text-2xl leading-none" aria-hidden>
                  {cat.icon}
                </span>
                <span
                  className={`text-center text-sm font-semibold leading-tight ${selected ? "text-white" : "text-Colors-foreground"}`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-Colors-foreground text-lg font-semibold font-['DM_Sans'] sm:text-xl">
            Alla inlägg ({count})
          </h2>
          <fieldset
            className="inline-flex w-fit rounded-full bg-Colors-muted/90 p-1 outline outline-1 -outline-offset-1 outline-Colors-border"
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
          </fieldset>
        </div>

        <div className="flex w-full flex-col items-stretch gap-6">
          {filteredPosts.length === 0 ? (
            <p className="rounded-2xl bg-Colors-card px-5 py-8 text-center text-Colors-muted-foreground outline outline-1 -outline-offset-1 outline-Colors-border font-['DM_Sans'] text-sm font-medium">
              Inga inlägg matchar filtret ännu.
            </p>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                authorName="Anna Andersson"
                authorInitials="AA"
                timeLabel={formatTimeAgo(post.createdAt)}
                rating={4.7}
                badgeLabel={badgeForPost(post)}
                title={post.title}
                body={post.content}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
