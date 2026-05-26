export type PostCardProps = {
  authorName?: string;
  authorFirstName?: string;
  authorLastName?: string;
  authorInitials?: string;
  timeLabel?: string;
  badgeLabel?: string;
  title: string;
  body: string;
  category?: string;
  tags?: string[];
  avatarBgClassName?: string;
  onContact?: () => void;
  onProfile?: () => void;
  onDelete?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
};

export default function PostCard({
  authorName,
  authorFirstName,
  authorLastName,
  authorInitials,
  timeLabel,
  badgeLabel,
  title,
  body,
  category,
  avatarBgClassName = "bg-sky-400",
  onContact,
  onProfile,
  onDelete,
  tags,
}: PostCardProps) {
  const resolvedAuthorName =
    authorName ?? `${authorFirstName ?? ""} ${authorLastName ?? ""}`.trim();

  const resolvedInitials =
    authorInitials ??
    (
      (authorFirstName?.trim()?.[0] ??
        authorName?.trim().split(" ")[0]?.[0] ??
        "") +
      (authorLastName?.trim()?.[0] ??
        authorName?.trim().split(" ").slice(-1)[0]?.[0] ??
        "")
    ).toUpperCase();

  const contactButtonClassName =
    "flex-1 min-w-0 inline-flex items-center justify-center gap-2.5 rounded-full bg-green-400 px-6 py-3.5 outline outline-1 outline-offset-[-1px] outline-zinc-400/30";

  return (
    <article className="w-full max-w-[750px] p-7 bg-white-3 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-stone-300/40 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      <div className="self-stretch inline-flex justify-between items-start overflow-hidden">
        <div className="rounded-3xl flex justify-start items-center gap-2.5">
          <div className="inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="w-10 h-10 relative">
              <div
                className={`w-10 h-10 left-0 top-0 absolute rounded-full ${avatarBgClassName}`}
              />
              <div className="left-[9px] top-[10px] absolute justify-start text-white text-base font-semibold font-['DM_Sans'] leading-5">
                {resolvedInitials}
              </div>
            </div>
          </div>
          <div className="self-stretch pt-1.5 inline-flex flex-col justify-center items-start gap-2 overflow-hidden">
            <div className="justify-start text-dark-gray text-base font-medium font-['DM_Sans'] leading-[10px]">
              {resolvedAuthorName}
            </div>
            <div className="inline-flex justify-start items-end gap-[5px]">
              <div className="self-stretch flex justify-start items-end gap-1">
                <div className="justify-end text-zinc-600 text-xs font-medium font-['DM_Sans'] leading-[10px]">
                  {timeLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-3.5 py-0.5 bg-orange-100 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
          <div className="justify-start text-amber-900/80 text-xs font-semibold font-['DM_Sans'] leading-5">
            {badgeLabel}
          </div>
        </div>
      </div>

      <div className="self-stretch py-2.5 flex flex-col justify-start items-start gap-[5px] overflow-hidden">
        <h2 className="justify-end text-dark-gray text-lg font-semibold font-['DM_Sans'] leading-5">
          {title}
        </h2>
        <p className="justify-end text-zinc-600 text-base font-normal font-['DM_Sans'] leading-6 line-clamp-3">
          {body}
        </p>
        {category || (tags && tags.length > 0) ? (
          <div className="pt-1 flex flex-wrap items-center gap-2">
            {category ? (
              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-900 font-['DM_Sans']">
                {category}
              </span>
            ) : null}
            {tags && tags.length > 0
              ? tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex rounded-full bg-Colors-muted/60 px-3 py-1 text-xs font-medium text-Colors-muted-foreground font-['DM_Sans']"
                  >
                    {t}
                  </span>
                ))
              : null}
          </div>
        ) : null}
      </div>

      <div className="self-stretch border-t border-stone-300/30 pt-4 flex items-center gap-2.5">
        <button
          type="button"
          onClick={onContact}
          disabled={!onContact}
          className={contactButtonClassName}
        >
          <i
            className="fi fi-rs-comment-dots text-white text-base leading-none"
            aria-hidden="true"
          />
          <span className="text-white text-base font-semibold font-['DM_Sans'] leading-4">
            Kontakta
          </span>
        </button>
        <div className="flex items-center gap-3">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              aria-label="Ta bort inlägg"
              title="Ta bort inlägg"
              className="size-12 rounded-full bg-red-50 outline outline-1 -outline-offset-1 outline-red-200 flex justify-center items-center hover:bg-red-100 transition-colors"
            >
              <i
                className="fi fi-rr-trash text-red-600 text-lg leading-none"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="size-12" aria-hidden="true" />
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
      </div>
    </article>
  );
}
