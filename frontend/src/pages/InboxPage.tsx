import { useState } from "react";

type InboxTab = "chattar" | "kalender";

/**
 * Inkorg – layout enligt design. Konversationslista fylls på när data hämtas från databasen.
 */
export default function InboxPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<InboxTab>("chattar");

  return (
    <div className="flex w-full min-w-0 flex-1 min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-Colors-card outline outline-1 -outline-offset-1 outline-Colors-border shadow-[0px_1px_2px_0px_rgba(22,26,38,0.04)] md:flex-row">
        {/* Vänster: lista / filter */}
        <aside className="flex w-full shrink-0 flex-col border-Colors-border bg-Colors-background md:max-w-[320px] md:border-r">
          <div className="flex flex-col gap-4 p-5">
            <h1 className="text-Colors-foreground text-2xl font-bold font-['DM_Sans'] tracking-tight sm:text-3xl">
              Inkorg
            </h1>

            <label className="relative block">
              <span className="sr-only">Sök bland chattar</span>
              <i
                className="fi fi-rr-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[16px] leading-none text-Colors-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök bland chattar..."
                className="w-full rounded-3xl border-0 bg-Colors-card py-3 pl-11 pr-4 text-Colors-foreground outline outline-1 -outline-offset-1 outline-Colors-border placeholder:text-Colors-muted-foreground font-['DM_Sans'] text-sm font-normal shadow-[0px_1px_2px_0px_rgba(22,26,38,0.04)] focus:outline-2 focus:-outline-offset-2 focus:outline-Colors-foreground/25"
              />
            </label>

            <div
              className="inline-flex w-full rounded-full bg-Colors-muted/90 p-1 outline outline-1 -outline-offset-1 outline-Colors-border/80"
              role="tablist"
              aria-label="Inkorgsvy"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "chattar"}
                onClick={() => setActiveTab("chattar")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold font-['DM_Sans'] transition-colors ${
                  activeTab === "chattar"
                    ? "bg-white text-Colors-foreground shadow-sm"
                    : "text-Colors-muted-foreground hover:text-Colors-foreground"
                }`}
              >
                <i
                  className="fi fi-rr-comments text-[15px] leading-none"
                  aria-hidden
                />
                Chattar
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "kalender"}
                onClick={() => setActiveTab("kalender")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold font-['DM_Sans'] transition-colors ${
                  activeTab === "kalender"
                    ? "bg-white text-Colors-foreground shadow-sm"
                    : "text-Colors-muted-foreground hover:text-Colors-foreground"
                }`}
              >
                <i
                  className="fi fi-rr-calendar text-[15px] leading-none"
                  aria-hidden
                />
                Kalender
              </button>
            </div>
          </div>

          {/* Plats för chattlista från databasen */}
          <div
            className="min-h-0 flex-1 bg-Colors-card p-3 sm:min-h-[280px]"
            role="tabpanel"
            aria-label={activeTab === "chattar" ? "Chattar" : "Kalender"}
          >
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl bg-Colors-background/80 px-4 py-10 text-center outline outline-1 -outline-offset-1 outline-Colors-border/60">
              <p className="max-w-[220px] text-Colors-muted-foreground text-sm font-medium font-['DM_Sans'] leading-relaxed">
                {activeTab === "chattar"
                  ? "Dina chattkonversationer visas här när de hämtats från databasen."
                  : "Kalendervyn kommer när den är kopplad till backend."}
              </p>
            </div>
          </div>
        </aside>

        {/* Höger: aktiv chatt */}
        <section
          className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-Colors-border bg-Colors-background md:border-t-0"
          aria-label="Chatt"
        >
          <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center px-6 py-16 md:min-h-0">
            <p className="max-w-md text-center text-Colors-muted-foreground text-base font-medium font-['DM_Sans'] leading-relaxed">
              Välj en chatt i listan till vänster för att visa meddelanden här.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
