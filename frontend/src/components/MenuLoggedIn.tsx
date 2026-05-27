/* eslint-disable react-refresh/only-export-components -- menu items co-located with layout */
import { useState } from "react";
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
    flaticonClassName: "fi fi-rs-comment-dots",
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
  collapsed,
}: {
  item: MenuItem<Id>;
  activePage: Id;
  onNavigate: (next: Id) => void;
  collapsed?: boolean;
}) {
  const isActive = activePage === item.id;

  return (
    <button
      type="button"
      onClick={() => onNavigate(item.id)}
      aria-current={isActive ? "page" : undefined}
      className={`w-full py-3.5 rounded-3xl inline-flex items-center transition-all duration-500 ease-in-out ${
        collapsed
          ? "px-2 justify-center rounded-full gap-0"
          : "px-5 justify-start gap-2.5"
      } ${isActive ? "bg-[#D3FBD5]" : ""}`}
    >
      <div className="w-5 h-5 shrink-0 flex justify-center items-center">
        {item.flaticonClassName ? (
          <i
            aria-hidden="true"
            className={`${item.flaticonClassName} text-[16px] leading-none ${
              isActive ? "text-green-800" : "text-Forest"
            }`}
          />
        ) : (
          <div
            className={`w-4 h-4 ${
              isActive
                ? (item.activeIcon ??
                  "outline outline-2 outline-offset-[-1px] outline-green-800")
                : (item.icon ?? "")
            }`}
          />
        )}
      </div>

      <div
        className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap text-base font-medium font-['DM_Sans'] leading-5 ${
          isActive ? "text-green-800" : "text-Forest"
        } ${collapsed ? "max-w-0 transition-[max-width] duration-[100ms] delay-[400ms]" : "max-w-[1000px]"}`}
      >
        {item.label}
      </div>
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative shrink-0 h-dvh sticky top-0 bg-Colors-background border-r border-Colors-border flex flex-col justify-between overflow-hidden transition-all duration-500 ease-in-out ${collapsed ? "w-[68px] px-2 py-6" : "w-72 p-6"}`}
    >
      {/* Toggle — below logo when collapsed, hugging right edge when open, always green */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expandera meny" : "Dölj meny"}
        className={`absolute z-10 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-neutral-400 flex items-center justify-center opacity-30 hover:opacity-20 transition-all duration-500 ease-in-out ${collapsed ? "left-1/2 -translate-x-1/2" : "right-3"}`}
      >
        <i
          aria-hidden="true"
          className={`fi fi-rr-angle-small-left text-[14px] leading-none text-white transition-transform duration-500 ${collapsed ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      <div className="flex flex-col gap-2.5">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("start" as Id)}
          className={`w-full inline-flex items-center ${collapsed ? "gap-0" : "gap-2.5 pr-10"}`}
        >
          <div className="w-12 h-12 shrink-0 rounded-full bg-green-400 flex items-center justify-center text-white text-2xl font-semibold font-['DM_Sans']">
            {brandInitial}
          </div>
          <div
            className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap text-dark-gray text-4xl font-extrabold font-['DM_Sans'] leading-none ${collapsed ? "max-w-0 transition-[max-width] duration-[100ms] delay-[400ms]" : "max-w-[1000px]"}`}
          >
            {brandName}
          </div>
        </button>

        <nav className="py-5 flex flex-col gap-[5px]">
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              activePage={activePage}
              onNavigate={onNavigate}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        {user ? (
          <button
            type="button"
            onClick={() => onNavigate("profil" as Id)}
            className={`shrink-0 bg-gradient-to-b from-green-100 to-red-50 outline outline-1 outline-offset-[-1px] outline-neutral-800/10 inline-flex items-center hover:opacity-95 transition-all duration-500 ease-in-out overflow-hidden ${collapsed ? "w-12 h-12 rounded-full mx-auto justify-center" : "w-full rounded-3xl justify-start p-3.5 gap-2.5 text-left"}`}
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-sky-400 flex items-center justify-center text-white text-base font-semibold font-['DM_Sans']">
              {user.initials}
            </div>
            <div
              className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap pt-1.5 ${collapsed ? "max-w-0 transition-[max-width] duration-[100ms] delay-[400ms]" : "max-w-[1000px]"}`}
            >
              <div className="text-dark-gray text-base font-semibold font-['DM_Sans'] leading-[10px] truncate">
                {user.name}
              </div>
            </div>
          </button>
        ) : null}

        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className={`shrink-0 inline-flex items-center text-Colors-muted-foreground hover:bg-Colors-muted transition-all duration-500 ease-in-out ${collapsed ? "w-10 h-10 rounded-full mx-auto justify-center" : "w-full py-3.5 px-5 rounded-3xl gap-2.5 justify-start"}`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <i
                aria-hidden="true"
                className="fi fi-rr-sign-out-alt text-[16px] leading-none"
              />
            </div>
            <div
              className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap text-base font-medium font-['DM_Sans'] leading-5 ${collapsed ? "max-w-0 transition-[max-width] duration-[100ms] delay-[400ms]" : "max-w-[1000px]"}`}
            >
              Logga ut
            </div>
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
    <div className="flex h-dvh w-full overflow-hidden bg-Colors-background">
      <Sidebar
        items={items}
        activePage={activeId}
        onNavigate={onNavigate}
        onLogout={onLogout}
        brandName={brandName}
        brandInitial={brandInitial}
        user={user}
      />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-Colors-background p-6">
        {children ?? <h1>{activeId}</h1>}
      </main>
    </div>
  );
}
