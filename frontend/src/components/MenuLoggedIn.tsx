/* eslint-disable react-refresh/only-export-components -- menu items co-located with layout */
import type { ReactNode } from "react";

export type MenuItem<Id extends string = string> = {
  id: Id;
  label: string;
  icon?: string;
  activeIcon?: string;
  flaticonClassName?: string;
};

export const LOGGED_IN_MENU_ITEMS = [
  { id: "start", label: "Start", flaticonClassName: "fi fi-rr-home" },
  {
    id: "kategorier",
    label: "Kategorier",
    flaticonClassName: "fi fi-rr-apps",
  },
  { id: "skapa", label: "Skapa", flaticonClassName: "fi fi-rr-edit" },
  {
    id: "inkorg",
    label: "Inkorg",
    flaticonClassName: "fi fi-rr-comment-dots",
  },
  {
    id: "profil",
    label: "Profil",
    flaticonClassName: "fi fi-rr-circle-user",
  },
] as const satisfies readonly MenuItem<
  "start" | "kategorier" | "skapa" | "inkorg" | "profil"
>[];

export type LoggedInMenuId = (typeof LOGGED_IN_MENU_ITEMS)[number]["id"];

export type MenuLoggedInUser = {
  name: string;
  initials: string;
};

function SidebarItem<Id extends string>({
  item,
  activePage,
  onNavigate,
}: {
  item: MenuItem<Id>;
  activePage: Id;
  onNavigate: (next: Id) => void;
}) {
  const isActive = activePage === item.id;

  return (
    <button
      type="button"
      onClick={() => onNavigate(item.id)}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 px-4 py-3 rounded-full text-base font-medium transition-all ${
        isActive
          ? "bg-accent text-active"
          : "hover:bg-muted hover:text-foreground"
      }`}
    >
      <div className="size-5 flex justify-center items-center">
        {item.flaticonClassName ? (
          <i
            aria-hidden="true"
            className={`${item.flaticonClassName} text-[16px] leading-none ${
              isActive ? "" : ""
            }`}
          />
        ) : (
          <div
            className={`w-4 h-4 ${
              isActive
                ? (item.activeIcon ??
                  "outline-2 -outline-offset-1 outline-active")
                : (item.icon ?? "")
            }`}
          />
        )}
      </div>

      <div>{item.label}</div>
    </button>
  );
}

function Sidebar<Id extends string>({
  items,
  activePage,
  onNavigate,
  onLogout,
  brandName,
  brandInitial,
  user,
}: {
  items: readonly MenuItem<Id>[];
  activePage: Id;
  onNavigate: (next: Id) => void;
  onLogout?: () => void;
  brandName: string;
  brandInitial: string;
  user?: MenuLoggedInUser;
}) {
  return (
    <aside className="w-64 flex flex-col h-screen border-r border-border bg-sidebar p-6 pt-8 sticky top-0">
      <div className="flex items-center gap-2 mb-8">
        <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-glow">
          {brandInitial}
        </div>

        <div className="font-display text-3xl font-bold tracking-tight">
          {brandName}
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            activePage={activePage}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      {/* </div> */}

      <div className="mt-auto space-y-2">
        {user ? (
          <div className="p-4 rounded-3xl bg-gradient-soft border border-border flex overflow-hidden">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-none size-10 bg-warm rounded-full inline-flex justify-center items-center text-primary-foreground font-semibold">
                {user.initials}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="truncate whitespace-nowrap text-sm font-semibold">
                  {user.name}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-foreground hover:bg-destructive/10 hover:text-destructive transition"
          >
            <div className="size-5 flex justify-center items-center">
              <i
                aria-hidden="true"
                className="fi fi-rr-exit text-[16px] leading-none"
              />
            </div>
            <div className="text-base font-medium">Logga ut</div>
          </button>
        ) : null}
      </div>
    </aside>
  );
}

export type MenuLoggedInProps<Id extends string = string> = {
  items: readonly MenuItem<Id>[];
  activeId: Id;
  onNavigate: (next: Id) => void;
  onLogout?: () => void;
  brandName: string;
  brandInitial: string;
  user?: MenuLoggedInUser;
  children?: ReactNode;
};

export default function MenuLoggedIn<Id extends string>({
  items,
  activeId,
  onNavigate,
  onLogout,
  brandName,
  brandInitial,
  user,
  children,
}: MenuLoggedInProps<Id>) {
  return (
    <div className="h-screen w-full overflow-hidden flex bg-background">
      <Sidebar
        items={items}
        activePage={activeId}
        onNavigate={onNavigate}
        onLogout={onLogout}
        brandName={brandName}
        brandInitial={brandInitial}
        user={user}
      />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-Colors-background">
        {children ?? <h1>{activeId}</h1>}
      </main>
    </div>
  );
}
