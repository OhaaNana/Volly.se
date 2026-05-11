import type { ReactNode } from "react";

export type MenuItem<Id extends string = string> = {
  id: Id;
  label: string;
  icon?: string;
  activeIcon?: string;
  flaticonClassName?: string;
};

export type MenuLoggedInUser = {
  name: string;
  initials: string;
  rating?: number;
};

function SidebarItem({
  item,
  activePage,
  onNavigate,
}: {
  item: MenuItem<string>;
  activePage: string;
  onNavigate: (next: string) => void;
}) {
  const isActive = activePage === item.id;

  return (
    <button
      type="button"
      onClick={() => onNavigate(item.id)}
      aria-current={isActive ? "page" : undefined}
      className={`self-stretch px-5 py-3.5 rounded-3xl inline-flex justify-start items-center gap-2.5 overflow-hidden ${
        isActive ? "bg-[#D3FBD5]" : ""
      }`}
    >
      <div className="w-5 h-5 flex justify-center items-center gap-2.5">
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
                ? item.activeIcon ?? "outline outline-2 outline-offset-[-1px] outline-green-800"
                : item.icon ?? ""
            }`}
          />
        )}
      </div>

      <div
        className={`justify-start text-base font-medium font-['DM_Sans'] leading-5 ${
          isActive ? "text-green-800" : "text-Forest"
        }`}
      >
        {item.label}
      </div>
    </button>
  );
}

function Sidebar({
  items,
  activePage,
  onNavigate,
  brandName,
  brandInitial,
  user,
}: {
  items: readonly MenuItem<string>[];
  activePage: string;
  onNavigate: (next: string) => void;
  brandName: string;
  brandInitial: string;
  user?: MenuLoggedInUser;
}) {
  return (
    <aside className="w-72 shrink-0 min-h-dvh p-7 bg-Colors-background border-r border-Colors-border inline-flex flex-col justify-between items-start overflow-hidden">
      <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
        <div className="inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <div className="w-12 h-12 relative">
            <div className="w-12 h-12 left-0 top-0 absolute bg-green-400 rounded-full" />
            <div className="left-[17px] top-[15px] absolute justify-start text-white text-2xl font-semibold font-['DM_Sans'] leading-5">
              {brandInitial}
            </div>
          </div>

          <div className="justify-end text-dark-gray text-4xl font-extrabold font-['DM_Sans'] leading-5">
            {brandName}
          </div>
        </div>

        <nav className="self-stretch py-5 flex flex-col justify-center items-start gap-[5px] overflow-hidden">
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              activePage={activePage}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </div>

      {user ? (
        <div className="self-stretch p-3.5 bg-gradient-to-b from-green-100 to-red-50 rounded-3xl outline outline-1 outline-offset-[-1px] outline-neutral-800/10 inline-flex justify-start items-center gap-2.5">
          <div className="inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="w-10 h-10 relative">
              <div className="w-10 h-10 left-0 top-0 absolute bg-sky-400 rounded-full" />
              <div className="left-[9px] top-[10px] absolute justify-start text-white text-base font-semibold font-['DM_Sans'] leading-5">
                {user.initials}
              </div>
            </div>
          </div>

          <div className="flex-1 self-stretch pt-1.5 inline-flex flex-col justify-center items-start gap-2 overflow-hidden">
            <div className="justify-start text-dark-gray text-base font-semibold font-['DM_Sans'] leading-[10px]">
              {user.name}
            </div>

            {typeof user.rating === "number" ? (
              <div className="inline-flex justify-start items-end gap-1">
                <div className="w-3 h-3 bg-gradient-to-bl from-amber-300 to-yellow-500 outline outline-[0.30px] outline-offset-[-0.15px] outline-neutral-800/30" />
                <div className="justify-end text-zinc-600 text-xs font-medium font-['DM_Sans'] leading-[10px]">
                  {user.rating}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export type MenuLoggedInProps<Id extends string = string> = {
  items: readonly MenuItem<Id>[];
  activeId: Id;
  onNavigate: (next: Id) => void;
  brandName: string;
  brandInitial: string;
  user?: MenuLoggedInUser;
  children?: ReactNode;
};

export default function MenuLoggedIn<Id extends string>({
  items,
  activeId,
  onNavigate,
  brandName,
  brandInitial,
  user,
  children,
}: MenuLoggedInProps<Id>) {
  return (
    <div className="flex min-h-dvh w-full bg-Colors-background">
      <Sidebar
        items={items as readonly MenuItem<string>[]}
        activePage={activeId}
        onNavigate={onNavigate as (next: string) => void}
        brandName={brandName}
        brandInitial={brandInitial}
        user={user}
      />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-Colors-background p-6">
        {children ?? <h1>{activeId}</h1>}
      </main>
    </div>
  );
}