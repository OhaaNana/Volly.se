export type InboxConversationCardProps = {
  /** Visningsnamn för motparten */
  name: string;
  /** Initialer i avatar-cirkeln */
  initials: string;
  /** Tailwind-klass för avatarbakgrund, t.ex. `bg-orange-400` */
  avatarClassName?: string;
  /** Tråd / inläggsrubrik (grön rad med ↳) */
  threadTitle: string;
  /** Senaste meddelandet i förhandsvisning */
  preview: string;
  /** Kort tidsstämpel, t.ex. `12m`, `2h` */
  timeLabel: string;
  /** Om raden är vald i listan */
  selected?: boolean;
  onClick: () => void;
  /** Antal olästa meddelanden, visas som röd badge */
  unreadCount?: number;
};

/**
 * En rad i inkorgslistan: avatar, namn, trådtitel, förhandsvisning och tid.
 */
export default function InboxConversationCard({
  name,
  initials,
  avatarClassName = "bg-orange-400",
  threadTitle,
  preview,
  timeLabel,
  selected = false,
  onClick,
  unreadCount,
}: InboxConversationCardProps) {
  return (
    <button
      type="button"
      role="listitem"
      onClick={onClick}
      className={`flex w-full flex-col border-b border-border px-5 py-4 text-left transition-colors hover:bg-Colors-muted/40 ${
        selected ? "bg-Colors-muted/35" : "bg-transparent"
      }`}
    >
      <div className="flex w-full items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-['DM_Sans'] text-sm font-semibold text-white ${avatarClassName}`}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-['DM_Sans'] text-base font-semibold text-foreground">
            {name}
          </div>

          <div className="mt-0.5 flex items-center gap-1 font-['DM_Sans'] text-xs font-medium text-green-700">
            <span aria-hidden className="text-green-600">
              ↳
            </span>
            <span>{threadTitle}</span>
          </div>

          <p className="mt-1 line-clamp-2 font-['DM_Sans'] text-sm font-normal text-Colors-muted-foreground">
            {preview}
          </p>
        </div>

        <div className="shrink-0 pt-0.5 text-right">
          <div className="font-['DM_Sans'] text-xs font-medium text-Colors-muted-foreground">
            {timeLabel}
          </div>

          {unreadCount && unreadCount > 0 ? (
            <div className="ml-auto flex items-center">
              <span className="mt-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}
