type Props = {
  firstName: string;
  onCreatePost: () => void;
  onExploreCategories?: () => void;
  onProfile?: () => void;
  posts?: Array<{ id: string; title: string; content: string; createdAt: number }>;
};

export default function LoggedInStartPage({
  firstName,
  onCreatePost,
  onExploreCategories,
  onProfile,
  posts,
}: Props) {
  const latestPost = posts?.[0];
  return (
    <div className="self-stretch px-6 py-12 inline-flex flex-col justify-start items-center gap-8">
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
        <div className="w-[750px] max-w-[750px] p-2.5 bg-white-3 rounded-[40px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.07)] outline outline-1 outline-offset-[-1px] outline-stone-300/40 inline-flex justify-start items-center overflow-hidden">
          <div className="px-2.5 py-[5px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="w-4 h-4 relative overflow-hidden">
              <div className="w-3.5 h-3.5 left-[1.50px] top-[1.50px] absolute rounded-full outline outline-2 outline-offset-[-1px] outline-zinc-400" />
              <div className="w-[1.50px] h-[1.50px] left-[15px] top-[15px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-400" />
            </div>
          </div>
          <div className="flex-1 p-[5px] flex justify-start items-start gap-2.5 overflow-hidden">
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

      <div className="w-[750px] max-w-[750px] p-7 bg-white-3 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-stone-300/40 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="self-stretch inline-flex justify-between items-start overflow-hidden">
          <div className="rounded-3xl flex justify-start items-center gap-2.5">
            <div className="inline-flex flex-col justify-start items-start overflow-hidden">
              <div className="w-10 h-10 relative">
                <div className="w-10 h-10 left-0 top-0 absolute bg-sky-400 rounded-full" />
                <div className="left-[9px] top-[10px] absolute justify-start text-white text-base font-semibold font-['DM_Sans'] leading-5">
                  AA
                </div>
              </div>
            </div>
            <div className="self-stretch pt-1.5 inline-flex flex-col justify-center items-start gap-2 overflow-hidden">
              <div className="justify-start text-dark-gray text-base font-medium font-['DM_Sans'] leading-[10px]">
                Anna Andersson
              </div>
              <div className="inline-flex justify-start items-end gap-[5px]">
                <div className="self-stretch flex justify-start items-end gap-1">
                  <div className="justify-end text-zinc-600 text-xs font-medium font-['DM_Sans'] leading-[10px]">
                    2h sen
                  </div>
                </div>
                <div className="justify-end text-zinc-600 text-xs font-medium font-['DM_Sans'] leading-[10px]">
                  ·
                </div>
                <div className="flex justify-start items-end gap-1">
                  <div className="w-3 h-3 bg-gradient-to-bl from-amber-300 to-yellow-500 outline outline-[0.30px] outline-offset-[-0.15px] outline-neutral-800/30" />
                  <div className="justify-end text-zinc-600 text-xs font-medium font-['DM_Sans'] leading-[10px]">
                    4.7
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-3.5 py-0.5 bg-green-200/40 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-green-900/60 text-xs font-semibold font-['DM_Sans'] leading-5">
              Erbjuder hjälp
            </div>
          </div>
        </div>

        <div className="self-stretch py-2.5 flex flex-col justify-start items-start gap-[5px] overflow-hidden">
          <div className="justify-end text-dark-gray text-lg font-semibold font-['DM_Sans'] leading-5">
            {latestPost?.title ?? "Subject"}
          </div>
          <div className="justify-end text-zinc-600 text-base font-normal font-['DM_Sans'] leading-6">
            {latestPost?.content ?? "Body"}
          </div>
        </div>

        <div className="self-stretch p-2.5 inline-flex justify-between items-start overflow-hidden">
          <div className="px-14 py-3.5 bg-green-400 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-400/30 flex justify-center items-center gap-2.5 overflow-hidden">
            <div className="w-4 h-4 flex justify-center items-center gap-2.5">
              <i className="fi fi-rs-comment-dots text-dark-gray" aria-hidden="true" />
            </div>
            <div className="justify-center text-dark-gray text-base font-medium font-['DM_Sans'] leading-4">
              Kontakta
            </div>
          </div>
          <button
            type="button"
            onClick={onProfile}
            className="px-6 py-3.5 bg-neutral-50 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-400/30 flex justify-center items-center gap-2.5 overflow-hidden"
          >
            <div className="w-5 h-5 flex justify-center items-center gap-2.5">
              <i className="fi fi-rr-circle-user text-dark-gray" aria-hidden="true" />
            </div>
            <div className="justify-center text-dark-gray text-base font-medium font-['DM_Sans'] leading-4">
              Profil
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

