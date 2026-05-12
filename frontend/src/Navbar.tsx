import { Link } from "react-router-dom";

function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="self-stretch h-32 px-14 py-10 relative bg-neutral-200 inline-flex justify-between items-center">
      <div className="h-12 flex justify-start items-center gap-3">
        <div className="justify-start text-black text-5xl font-normal font-['Emblema_One'] leading-[48px]">
          Volly
        </div>
      </div>

      <div className="flex justify-start items-start gap-9">
        {[
          { id: "Vision", label: "Vår vision" },
          { id: "Funkar", label: "Hur volly fungerar" },
          { id: "Skapa konto", label: "Skapa konto" },
        ].map((link) => (
          <button
            type="button"
            key={link.id}
            onClick={() => scrollTo(link.id)}
            className="px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-[#000000] rounded-full transition-all duration-200 hover:text-[#bbb7b1] hover:bg-[rgba(214,207,196,0.75)] hover:shadow-[0_8px_25_rgba(120,100,70,0.2)] hover:-translate-y-px"
          >
            {link.label}
          </button>
        ))}
        <Link
          to="/faq"
          className="justify-start text-black text-3xl font-normal font-['DM_Sans'] leading-8 transition-all duration-200 hover:text-[#bbb7b1] hover:bg-[rgba(214,207,196,0.75)] hover:shadow-[0_8px_25_rgba(120,100,70,0.2)] hover:-translate-y-px"
        >
          FAQ
        </Link>
      </div>
      <div className="w-[1600px] h-0 left-[-80px] top-[128px] absolute outline outline-2 outline-offset-[-1px] outline-black/50" />
    </header>
  );
}

export default Navbar;
