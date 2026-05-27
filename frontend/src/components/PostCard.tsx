const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Teknik: { bg: "bg-teal-200", text: "text-teal-800" },
  Språk: { bg: "bg-pink-200", text: "text-fuchsia-800" },
  "Socialt & sällskap": { bg: "bg-orange-200", text: "text-orange-900" },
  Karriär: { bg: "bg-blue-200", text: "text-blue-900" },
  Studier: { bg: "bg-green-200", text: "text-green-900" },
  "Dokument & byråkrati": { bg: "bg-slate-300", text: "text-slate-900" },
  "Funktionsvariation & NPF": { bg: "bg-violet-200", text: "text-violet-900" },
  "Mental hälsa": { bg: "bg-rose-200", text: "text-rose-900" },
  Vardag: { bg: "bg-yellow-200", text: "text-yellow-900" },
};

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
  isSaved,
  onToggleSave,
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
    <article className="w-full p-7 bg-Colors-card rounded-[30px] outline outline-1 outline-offset-[-1px] outline-stone-300/40 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      <div className="self-stretch inline-flex justify-between items-start overflow-hidden">
        <div className="rounded-3xl flex justify-start items-center gap-2.5">
          <div className="inline-flex flex-col justify-start items-start overflow-hidden">
            <div
              className={`w-10 h-10 rounded-full ${avatarBgClassName} flex items-center justify-center text-white text-base font-semibold font-['DM_Sans']`}
            >
              {resolvedInitials}
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
          <div className="pt-1 flex flex-wrap gap-2">
            {category ? (
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium font-['DM_Sans'] ${CATEGORY_COLORS[category]?.bg ?? "bg-green-100"} ${CATEGORY_COLORS[category]?.text ?? "text-green-900"}`}
              >
                {category}
              </span>
            ) : null}
            {tags?.map((t) => (
              <span
                key={t}
                className="inline-flex rounded-full bg-Colors-muted px-3 py-1 text-xs font-medium text-Colors-foreground font-['DM_Sans']"
              >
                {t}
              </span>
            ))}
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
        {onToggleSave ? (
          <button
            type="button"
            onClick={onToggleSave}
            aria-label={isSaved ? "Ta bort bokmärke" : "Spara inlägg"}
            className="size-[52px] shrink-0 flex items-center justify-center rounded-full bg-neutral-50 outline outline-1 outline-offset-[-1px] outline-zinc-400/30 hover:bg-neutral-100 transition-colors"
          >
            <svg
              width="42"
              height="42"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15.7139 13.8496H24.2861C24.5404 13.8497 24.7697 13.9424 24.9268 14.085C25.0812 14.2251 25.1504 14.3967 25.1504 14.5557V25.4365L20.4619 22.3975C20.2159 22.2382 19.9079 22.2183 19.6465 22.3379L19.5381 22.3975L14.8496 25.4365V14.5557C14.8496 14.3967 14.9188 14.2251 15.0732 14.085C15.2303 13.9424 15.4596 13.8497 15.7139 13.8496Z"
                fill={isSaved ? "#282828" : "none"}
                stroke="#282828"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
        {onProfile ? (
          <button
            type="button"
            onClick={onProfile}
            className="px-6 py-3.5 bg-neutral-50 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-400/30 flex justify-center items-center gap-2.5 overflow-hidden shrink-0"
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
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Ta bort inlägg"
            className="size-[52px] shrink-0 flex items-center justify-center rounded-full bg-red-50 outline outline-1 outline-offset-[-1px] outline-red-200 hover:bg-red-100 transition-colors"
          >
            <i
              className="fi fi-rr-trash text-red-500 text-base leading-none"
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>
    </article>
  );
}
