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

  const badgeToneClassName =
    badgeLabel?.toLowerCase().includes("sök") ||
    badgeLabel?.toLowerCase().includes("needs")
      ? "bg-warm/20 text-warm-foreground"
      : "bg-success/15 text-success";

  return (
    <article className="w-full rounded-3xl border border-border/60 bg-card p-5 shadow-card transition-shadow hover:shadow-glow sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-11 shrink-0 rounded-full ring-2 ring-background">
            <div
              className={`size-11 rounded-full ${avatarBgClassName} flex items-center justify-center text-sm font-semibold text-white`}
            >
              {resolvedInitials}
            </div>
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {resolvedAuthorName}
            </p>
            <p className="text-xs text-muted-foreground">
              {timeLabel ?? "Nyss"} · {badgeLabel ?? "Inlägg"}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badgeToneClassName}`}
        >
          {badgeLabel ?? "Inlägg"}
        </span>
      </div>

      <h3 className="font-display mb-1.5 text-lg font-bold leading-snug">
        {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {body}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {category ? (
          <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
            {category}
          </span>
        ) : null}

        {tags && tags.length > 0
          ? tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))
          : null}
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={onContact}
          disabled={!onContact}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <i
            className="fi fi-rs-comment-dots text-base leading-none"
            aria-hidden="true"
          />
          Kontakta
        </button>
        {onProfile ? (
          <button
            type="button"
            onClick={onProfile}
            className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted"
          >
            Profil
          </button>
        ) : null}
      </div>
    </article>
  );
}
