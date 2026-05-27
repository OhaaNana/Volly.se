import PostCard from "../components/PostCard";
import type { CategoryKey, CategoryPost } from "./CategoryPage";
import HowVollyWorks from "../components/HowVollyWorks";

type Props = {
  firstName: string;
  onCreatePost: () => void;
  onExploreCategories?: (category?: CategoryKey) => void;
  onProfile?: (authorEmail?: string) => void;
  onContact?: (post: CategoryPost) => void;
  posts?: CategoryPost[];
};

const POPULAR_CATEGORIES: {
  id: CategoryKey;
  label: string;
  bgClass: string;
  textClass: string;
}[] = [
  {
    id: "mental",
    label: "Hälsa",
    bgClass: "bg-rose-200",
    textClass: "text-rose-900",
  },
  {
    id: "teknik",
    label: "Teknik",
    bgClass: "bg-teal-200",
    textClass: "text-teal-800",
  },
  {
    id: "vardag",
    label: "Vardag",
    bgClass: "bg-yellow-200",
    textClass: "text-yellow-900",
  },
  {
    id: "studier",
    label: "Studier",
    bgClass: "bg-green-200",
    textClass: "text-green-900",
  },
  {
    id: "sprak",
    label: "Språk",
    bgClass: "bg-pink-200",
    textClass: "text-fuchsia-800",
  },
  {
    id: "karriar",
    label: "Karriär",
    bgClass: "bg-blue-200",
    textClass: "text-blue-900",
  },
];

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

function getAuthorName(post: CategoryPost): string {
  const fullName = `${post.first_name ?? ""} ${post.last_name ?? ""}`.trim();
  if (fullName) return fullName;
  if (post.author_email) {
    const localPart = post.author_email.split("@")[0] ?? "";
    const parts = localPart.split(/[._-]/).filter(Boolean);
    if (parts.length > 0) {
      return parts
        .slice(0, 2)
        .map((part) => part.replace(/^\w/, (c) => c.toUpperCase()))
        .join(" ");
    }
  }
  return "Okänt namn";
}

function getInitials(post: CategoryPost): string {
  if (post.first_name || post.last_name) {
    return `${post.first_name ?? ""}${post.last_name ?? ""}`
      .trim()
      .slice(0, 2)
      .toUpperCase();
  }
  if (post.author_email) {
    return post.author_email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }
  return "??";
}

export default function LoggedInStartPage({
  firstName,
  onCreatePost,
  onExploreCategories,
  onProfile,
  onContact,
  posts,
}: Props) {
  return (
    <div className="max-w-4xl w-full mx-auto px-10 sm:px-10 py-12 lg:py-10 space-y-8">
      <section className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-card border border-border relative overflow-hidden">
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-warm/15 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 size-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card text-xs font-semibold text-primary border border-border mb-4">
          Välkommen tillbaka, {firstName}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
          Vad kan vi lösa tillsammans idag?
        </h1>
        <p className="text-muted-foreground lg:max-w-xl md:max-w-sm">
          Skriv ett inlägg och nå ut till någon med rätt kunskap - eller
          utforska vad du själv kan bidra med.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onCreatePost}
            className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-gradient-warm text-warm-foreground font-semibold shadow-soft hover:shadow-glow transition"
          >
            Skriv ett inlägg
          </button>
          <button
            type="button"
            onClick={() => onExploreCategories?.()}
            className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-card border border-border font-semibold hover:bg-muted transition"
          >
            Utforska kategorier
          </button>
        </div>
      </section>

      <section className="w-full">
        <div className="w-full inline-flex flex-col justify-center items-start gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">
              Populära kategorier
            </h2>
            <p className="text-xs text-muted-foreground">
              Klicka på en kategori för att komma till flödet
            </p>
          </div>
          <div className="w-full flex gap-2">
            {POPULAR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onExploreCategories?.(cat.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-border ${cat.bgClass} hover:bg-muted transition`}
              >
                <span className={`${cat.textClass} text-xs font-medium`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full">
        <HowVollyWorks compact />
      </section>
      <div
        className={`w-full max-w-[920px] space-y-4 ${
          posts && posts.length > 1
            ? "overflow-y-auto max-h-[64vh] pr-2 green-scrollbar"
            : ""
        }`}
      >
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              authorName={getAuthorName(post)}
              authorInitials={getInitials(post)}
              timeLabel={formatTimeAgo(post.createdAt)}
              badgeLabel={badgeForPost(post)}
              title={post.title}
              body={post.content}
              tags={post.tags}
              onProfile={
                onProfile ? () => onProfile(post.author_email) : undefined
              }
              onContact={onContact ? () => onContact(post) : undefined}
            />
          ))
        ) : (
          <div className="p-6 text-center text-zinc-500">Inga inlägg än.</div>
        )}
      </div>
    </div>
  );
}
