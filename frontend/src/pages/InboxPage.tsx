import { useState } from "react";
import InboxConversationCard, {
  type InboxConversationCardProps,
} from "../components/InboxConversationCard";

type ChatPreview = Pick<
  InboxConversationCardProps,
  | "name"
  | "initials"
  | "avatarClassName"
  | "threadTitle"
  | "preview"
  | "timeLabel"
> & { id: string };

const MOCK_CHATS: ChatPreview[] = [
  {
    id: "1",
    initials: "NN",
    avatarClassName: "bg-orange-400",
    name: "Namn Namnsson",
    threadTitle: "Titel",
    preview: "Hej! Jag skulle behöva lite hjälp med…",
    timeLabel: "12m",
  },
  {
    id: "2",
    initials: "NN",
    avatarClassName: "bg-orange-400",
    name: "Namn Namnsson",
    threadTitle: "Titel",
    preview: "Hej! Jag skulle behöva lite hjälp med…",
    timeLabel: "2h",
  },
  {
    id: "3",
    initials: "NN",
    avatarClassName: "bg-orange-400",
    name: "Namn Namnsson",
    threadTitle: "Titel",
    preview: "Hej! Jag skulle behöva lite hjälp med…",
    timeLabel: "1d",
  },
];

function SearchIcon() {
  return (
    <i
      aria-hidden
      className="fi fi-sr-member-search shrink-0 text-[16px] leading-none text-Colors-muted-foreground"
    />
  );
}

/**
 * Inkorg – matchar layout från design. Lista kan senare bytas mot data från databasen.
 */
export default function InboxPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_CHATS[0]?.id ?? null
  );

  const filtered = MOCK_CHATS.filter(
    (c) =>
      query.trim() === "" ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.threadTitle.toLowerCase().includes(query.toLowerCase()) ||
      c.preview.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="inline-flex min-h-0 w-full flex-1 flex-row justify-start items-stretch self-stretch overflow-hidden">
      {/* Vänster: inkorgslista (w-96) */}
      <div className="inline-flex w-96 shrink-0 flex-col items-start justify-start self-stretch overflow-hidden border-r border-border bg-sidebar">
        <div className="flex w-96 flex-col items-start justify-start gap-3 border-b border-border p-5">
          <div className="justify-start font-['DM_Sans'] text-2xl font-bold text-foreground">
            Inkorg
          </div>

          <label className="inline-flex h-10 max-h-10 min-h-10 w-full cursor-text items-center justify-start gap-3 self-stretch rounded-3xl bg-Colors-card px-4 outline outline-1 -outline-offset-1 outline-Colors-border">
            <span className="sr-only">Sök bland chattar</span>
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök bland chattar..."
              className="min-h-0 min-w-0 flex-1 self-stretch bg-transparent font-['DM_Sans'] text-sm font-normal leading-4 text-foreground outline-none placeholder:text-Colors-muted-foreground"
            />
          </label>
        </div>

        <div
          className="flex min-h-0 w-96 flex-1 flex-col overflow-y-auto"
          role="list"
        >
          {filtered.map((chat) => (
            <InboxConversationCard
              key={chat.id}
              name={chat.name}
              initials={chat.initials}
              avatarClassName={chat.avatarClassName}
              threadTitle={chat.threadTitle}
              preview={chat.preview}
              timeLabel={chat.timeLabel}
              selected={selectedId === chat.id}
              onClick={() => setSelectedId(chat.id)}
            />
          ))}
        </div>
      </div>

      {/* Höger: tom chattvy */}
      <section
        className="flex min-h-0 min-w-0 flex-1 flex-col bg-Colors-background"
        aria-label="Chatt"
      >
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
          <p className="max-w-md text-center font-['DM_Sans'] text-base font-medium leading-relaxed text-Colors-muted-foreground">
            Välj en chatt i listan till vänster för att visa meddelanden här.
          </p>
        </div>
      </section>
    </div>
  );
}
