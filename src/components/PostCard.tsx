export type PostCardProps = {
  authorName: string;
  authorInitials: string;
  timeLabel: string;
  rating: number;
  badgeLabel: string;
  title: string;
  body: string;
  /** Tailwind-klass för avatar-cirkelns bakgrund, t.ex. `bg-sky-400` */
  avatarBgClassName?: string;
  onContact?: () => void;
  onProfile?: () => void;
};

export default function PostCard({
  authorName,
  authorInitials,
  timeLabel,
  rating,
  badgeLabel,
  title,
  body,
  avatarBgClassName = "bg-sky-400",
  onContact,
  onProfile,
}: PostCardProps) {
  const contactClassName =
    "px-14 py-3.5 bg-green-400 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-400/30 flex justify-center items-center gap-2.5 overflow-hidden";

  return (
    <article className="w-[750px] max-w-[750px] p-7 bg-white-3 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-stone-300/40 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      <div className="self-stretch inline-flex justify-between items-start overflow-hidden">
        <div className="rounded-3xl flex justify-start items-center gap-2.5">
          <div className="inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="w-10 h-10 relative">
              <div
                className={`w-10 h-10 left-0 top-0 absolute rounded-full ${avatarBgClassName}`}
              />
              <div className="left-[9px] top-[10px] absolute justify-start text-white text-base font-semibold font-['DM_Sans'] leading-5">
                {authorInitials}
              </div>
            </div>
          </div>
          <div className="self-stretch pt-1.5 inline-flex flex-col justify-center items-start gap-2 overflow-hidden">
            <div className="justify-start text-dark-gray text-base font-medium font-['DM_Sans'] leading-[10px]">
              {authorName}
            </div>
            <div className="inline-flex justify-start items-end gap-[5px]">
              <div className="self-stretch flex justify-start items-end gap-1">
                <div className="justify-end text-zinc-600 text-xs font-medium font-['DM_Sans'] leading-[10px]">
                  {timeLabel}
                </div>
              </div>
              <div className="justify-end text-zinc-600 text-xs font-medium font-['DM_Sans'] leading-[10px]">
                ·
              </div>
              <div className="flex justify-start items-end gap-1">
                <div className="w-3 h-3 bg-gradient-to-bl from-amber-300 to-yellow-500 outline outline-[0.30px] outline-offset-[-0.15px] outline-neutral-800/30" />
                <div className="justify-end text-zinc-600 text-xs font-medium font-['DM_Sans'] leading-[10px]">
                  {rating}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-3.5 py-0.5 bg-green-200/40 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
          <div className="justify-start text-green-900/60 text-xs font-semibold font-['DM_Sans'] leading-5">
            {badgeLabel}
          </div>
        </div>
      </div>

      <div className="self-stretch py-2.5 flex flex-col justify-start items-start gap-[5px] overflow-hidden">
        <h2 className="justify-end text-dark-gray text-lg font-semibold font-['DM_Sans'] leading-5">
          {title}
        </h2>
        <p className="justify-end text-zinc-600 text-base font-normal font-['DM_Sans'] leading-6">
          {body}
        </p>
      </div>

      <div className="self-stretch p-2.5 inline-flex justify-between items-start overflow-hidden">
        {onContact ? (
          <button
            type="button"
            onClick={onContact}
            className={contactClassName}
          >
            <span className="w-4 h-4 flex justify-center items-center gap-2.5">
              <i
                className="fi fi-rs-comment-dots text-dark-gray"
                aria-hidden="true"
              />
            </span>
            <span className="justify-center text-dark-gray text-base font-medium font-['DM_Sans'] leading-4">
              Kontakta
            </span>
          </button>
        ) : (
          <div className={contactClassName}>
            <div className="w-4 h-4 flex justify-center items-center gap-2.5">
              <i
                className="fi fi-rs-comment-dots text-dark-gray"
                aria-hidden="true"
              />
            </div>
            <div className="justify-center text-dark-gray text-base font-medium font-['DM_Sans'] leading-4">
              Kontakta
            </div>
          </div>
        )}
        {onProfile ? (
          <button
            type="button"
            onClick={onProfile}
            className="px-6 py-3.5 bg-neutral-50 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-400/30 flex justify-center items-center gap-2.5 overflow-hidden"
          >
            <span className="w-5 h-5 flex justify-center items-center gap-2.5">
              <i
                className="fi fi-rr-circle-user text-dark-gray"
                aria-hidden="true"
              />
            </span>
            <span className="justify-center text-dark-gray text-base font-medium font-['DM_Sans'] leading-4">
              Profil
            </span>
          </button>
        ) : null}
      </div>
    </article>
  );
}
