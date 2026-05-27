import { Link } from "react-router-dom";

function Navbar({ hideLinks = false }: { hideLinks?: boolean }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "Vision", label: "Vår vision" },
    { id: "Funkar", label: "Hur Volly fungerar" },
    { id: "faq", label: "FAQ", isRoute: true },
    { id: "Skapa konto", label: "Skapa konto" },
  ] as const;

  return (
    <header className="w-full bg-primary-soft">
      <div className="w-full max-w-[1280px] mx-auto h-32 pl-14 pr-12 py-10 flex justify-between items-center">
        <div className="h-12 flex justify-start items-center gap-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="justify-start text-primary text-5xl font-normal font-emblema leading-[48px]"
          >
            Volly
          </button>
        </div>

        {!hideLinks && (
          <nav className="flex justify-start items-center gap-1">
            {navLinks.map((link) =>
              "isRoute" in link && link.isRoute ? (
                <Link
                  key={link.id}
                  to="/faq"
                  className="px-4 py-2 rounded-3xl flex justify-center items-center gap-2.5 text-warm-foreground text-2xl font-semibold font-['DM_Sans'] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className="px-4 py-2 rounded-3xl flex justify-center items-center gap-2.5 text-warm-foreground text-2xl font-semibold font-['DM_Sans'] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </button>
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
