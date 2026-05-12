import PostCard from "../components/PostCard";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  postType?: "seek" | "offer";
};

type Props = {
  firstName: string;
  onCreatePost: () => void;
  onExploreCategories?: () => void;
  onProfile?: () => void;
  posts?: Post[];
};

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

function badgeForPost(post: Post | undefined): string {
  if (post?.postType === "seek") return "Söker hjälp";
  if (post?.postType === "offer") return "Erbjuder hjälp";
  return "Erbjuder hjälp";
}

export default function LoggedInStartPage({
  firstName,
  onCreatePost,
  onExploreCategories,
  onProfile,
  posts,
}: Props) {
  const latestPost = posts?.[0];
  return (
    <div className="w-full min-w-0 self-stretch px-6 py-12 inline-flex flex-col justify-start items-center gap-8">
      <div className="w-[750px] max-w-[750px] p-10 bg-gradient-to-b from-green-100 to-red-50 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 flex flex-col justify-start items-start gap-5 overflow-hidden">
        <div className="px-3.5 py-[5px] bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-stone-300/60 flex flex-col justify-center items-start gap-2.5 overflow-hidden">
          <div className="justify-center text-green-600 text-sm font-semibold font-['DM_Sans'] leading-5">
            Välkommen tillbaka, {firstName}
          </div>
        </div>
        <div className="self-stretch py-2.5 flex flex-col justify-start items-start gap-2.5">
          <div className="justify-start text-dark-gray text-4xl font-bold font-['DM_Sans'] leading-10">
            Vad kan vi lösa tillsammans idag?
          </div>
          <div className="self-stretch justify-start text-neutral-500 text-lg font-normal font-['DM_Sans'] leading-7">
            Skriv ett inlägg och nå ut till någon med rätt kunskap - eller utforska vad du själv kan bidra med.
          </div>
        </div>
        <div className="inline-flex justify-start items-center gap-3">
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
            onClick={onExploreCategories}
            className="px-6 py-3.5 bg-white-2 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-400/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden"
          >
            <div className="justify-start text-dark-gray text-base font-semibold font-['DM_Sans'] leading-5">
              Utforska kategorier
            </div>
          </button>
        </div>
      </div>

      <div className="self-stretch flex flex-col justify-start items-center gap-4">
        <div className="w-[750px] max-w-[750px] p-2.5 bg-white-3 rounded-[40px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.07)] outline outline-1 outline-offset-[-1px] outline-stone-300/40 inline-flex justify-start items-center gap-3 overflow-hidden">
          <i
            aria-hidden
            className="fi fi-br-search-heart ml-1 shrink-0 text-[20px] leading-none text-zinc-500"
          />
          <div className="flex-1 p-[5px] flex justify-start items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-zinc-500 text-base font-normal font-['DM_Sans'] leading-5">
              Sök efter inlägg, ämnen, taggar...
            </div>
          </div>
        </div>

        <div className="w-full max-w-[750px] inline-flex justify-between items-center overflow-hidden">
          <div className="px-7 py-1.5 bg-indigo-200/60 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-blue-900/80 text-sm font-semibold font-['DM_Sans'] leading-5">
              Teknik
            </div>
          </div>
          <div className="px-7 py-1.5 bg-amber-100/60 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-yellow-900/80 text-sm font-semibold font-['DM_Sans'] leading-5">
              Vardag
            </div>
          </div>
          <div className="px-7 py-1.5 bg-fuchsia-200/60 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-purple-950/80 text-sm font-semibold font-['DM_Sans'] leading-5">
              Språk
            </div>
          </div>
          <div className="px-7 py-1.5 bg-cyan-100/60 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-teal-800/80 text-sm font-semibold font-['DM_Sans'] leading-5">
              Studier
            </div>
          </div>
          <div className="px-7 py-1.5 bg-green-200/60 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-green-900/80 text-sm font-semibold font-['DM_Sans'] leading-5">
              Mental hälsa
            </div>
          </div>
          <div className="px-7 py-1.5 bg-orange-100/60 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-amber-900/80 text-sm font-semibold font-['DM_Sans'] leading-5">
              Karriär
            </div>
          </div>
        </div>
      </div>

      <div className="w-[750px] max-w-[750px] inline-flex justify-start items-center gap-3.5 overflow-hidden">
        <div className="px-7 py-1.5 bg-neutral-700 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
          <div className="justify-start text-zinc-100 text-xs font-semibold font-['DM_Sans'] leading-5">Allt</div>
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

      <PostCard
        authorName="Anna Andersson"
        authorInitials="AA"
        timeLabel={latestPost ? formatTimeAgo(latestPost.createdAt) : "2h sen"}
        rating={4.7}
        badgeLabel={badgeForPost(latestPost)}
        title={latestPost?.title ?? "Subject"}
        body={latestPost?.content ?? "Body"}
        onProfile={onProfile}
      />
    </div>
  );
}

