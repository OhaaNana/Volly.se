import type { CategoryKey } from "./CategoryPage";

type Props = {
  firstName: string;
  onCreatePost: () => void;
<<<<<<< Updated upstream
  onExploreCategories?: (category?: CategoryKey) => void;
=======
  onExploreCategories?: () => void;
  onProfile?: (authorEmail?: string) => void;
  onContact?: (post: Post) => void;
  posts?: Post[];
  formatDisplayName?: (
    firstName?: string,
    lastName?: string,
    authorEmail?: string
  ) => string;
>>>>>>> Stashed changes
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

export default function LoggedInStartPage({
  firstName,
  onCreatePost,
  onExploreCategories,
<<<<<<< Updated upstream
=======
  onProfile,
  onContact,
  posts,
  formatDisplayName,
>>>>>>> Stashed changes
}: Props) {
  return (
    <div className="w-full min-w-0 self-stretch overflow-x-hidden px-4 py-10 sm:px-6 sm:py-12 inline-flex flex-col justify-start items-center gap-8">
      <div className="w-full max-w-[920px] p-6 sm:p-10 bg-gradient-to-b from-green-100 to-red-50 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 flex flex-col justify-start items-start gap-5 overflow-hidden shadow-[0px_10px_24px_-14px_rgba(22,26,38,0.35)]">
        <div className="px-3.5 py-[5px] bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-stone-300/60 flex flex-col justify-center items-start gap-2.5 overflow-hidden">
          <div className="justify-center text-green-600 text-sm font-semibold font-['DM_Sans'] leading-5">
            Välkommen tillbaka, {firstName}
          </div>
        </div>
        <div className="self-stretch py-2.5 flex flex-col justify-start items-start gap-2.5">
          <div className="justify-start text-dark-gray text-3xl sm:text-4xl font-bold font-['DM_Sans'] leading-10">
            Vad kan vi lösa tillsammans idag?
          </div>
          <div className="self-stretch justify-start text-neutral-500 text-base sm:text-lg font-normal font-['DM_Sans'] leading-7">
            Skriv ett inlägg och nå ut till någon med rätt kunskap - eller
            utforska vad du själv kan bidra med.
          </div>
        </div>
        <div className="inline-flex flex-wrap justify-start items-center gap-3">
          <button
            type="button"
            onClick={onCreatePost}
            className="px-6 py-3.5 bg-orange-300 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-400/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden"
          >
            <div className="justify-start text-dark-gray text-base font-semibold font-['DM_Sans'] leading-5">
              Skriv ett inlägg
            </div>
          </button>
          <button
            type="button"
            onClick={() => onExploreCategories?.()}
            className="px-6 py-3.5 bg-white-2 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-400/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden"
          >
            <div className="justify-start text-dark-gray text-base font-semibold font-['DM_Sans'] leading-5">
              Utforska kategorier
            </div>
          </button>
        </div>
      </div>

      <div className="w-full max-w-[920px] flex flex-col items-start">
        <div className="flex flex-col gap-1">
          <h2 className="text-foreground text-lg font-bold font-['DM_Sans'] leading-7">
            Populära kategorier
          </h2>
          <p className="text-muted-foreground text-xs font-normal font-['DM_Sans'] leading-4">
            Klicka på en kategori för att komma till flödet
          </p>
        </div>
        <div className="mt-6 self-stretch inline-flex justify-start items-center gap-2">
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onExploreCategories?.(cat.id)}
              className={`flex-1 min-w-0 px-5 py-2.5 ${cat.bgClass} rounded-full outline outline-1 outline-offset-[-1px] outline-Colors-border inline-flex flex-col justify-center items-center`}
            >
              <span
                className={`${cat.textClass} text-xs font-medium font-['DM_Sans'] leading-4`}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
<<<<<<< Updated upstream
=======

      <div className="w-full max-w-[920px] inline-flex flex-wrap justify-start items-center gap-3">
        <div className="px-7 py-1.5 bg-neutral-700 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
          <div className="justify-start text-zinc-100 text-xs font-semibold font-['DM_Sans'] leading-5">
            Allt
          </div>
        </div>
        <div className="px-7 py-1.5 bg-white-2 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
          <div className="justify-start text-neutral-700 text-xs font-semibold font-['DM_Sans'] leading-5">
            Söker hjälp
          </div>
        </div>
        <div className="px-7 py-1.5 bg-white-2 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
          <div className="justify-start text-neutral-700 text-xs font-semibold font-['DM_Sans'] leading-5">
            Erbjuder hjälp
          </div>
        </div>
        <div className="px-7 py-1.5 bg-white-2 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
          <div className="justify-start text-neutral-700 text-xs font-semibold font-['DM_Sans'] leading-5">
            Video
          </div>
        </div>
        <div className="px-7 py-1.5 bg-white-2 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
          <div className="justify-start text-neutral-700 text-xs font-semibold font-['DM_Sans'] leading-5">
            Chatt
          </div>
        </div>
      </div>

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
>>>>>>> Stashed changes
    </div>
  );
}
