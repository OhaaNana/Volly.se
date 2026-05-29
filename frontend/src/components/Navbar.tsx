import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  hideLinks?: boolean;
}

function Navbar({ hideLinks = false }: NavbarProps) {
  const { pathname } = useLocation();
  const onHome = pathname === "/";

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
    <header className="w-full relative bg-primary-soft ">
      <div className="w-full mx-auto h-28 pl-14 pr-12 py-10 flex justify-between items-center">
        <div className="h-12 flex justify-start items-center gap-3">
          <Link
            to="/"
            className="justify-start flex flex-row gap-2 hover:opacity-80 transition-opacit"
          >
            <div className="size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-glow">
              V
            </div>

            <div className="font-display text-5xl font-bold tracking-tight text-warm-foreground">
              Volly
            </div>
          </Link>
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
              ) : onHome ? (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className="px-4 py-2 rounded-3xl flex justify-center items-center gap-2.5 text-warm-foreground text-2xl font-semibold font-['DM_Sans'] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.id}
                  to={`/#${link.id}`}
                  className="px-4 py-2 rounded-3xl flex justify-center items-center gap-2.5 text-warm-foreground text-2xl font-semibold font-['DM_Sans'] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
