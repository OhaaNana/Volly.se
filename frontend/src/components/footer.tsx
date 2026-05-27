import { Link } from "react-router-dom";

function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-primary-soft rounded-tl-[30px] rounded-tr-[30px]">
      <div className="w-full max-w-7xl mx-auto px-12 pt-12 pb-6 flex flex-col gap-3.5">
        <div className="p-8 flex justify-start items-start gap-24 flex-wrap">
          <div className="inline-flex flex-col justify-start items-start gap-4">
            <div className="text-warm-foreground text-3xl font-semibold font-['DM_Sans'] leading-6">
              Om oss
            </div>
            <div className="flex flex-col justify-start items-start gap-2.5">
              <button
                type="button"
                onClick={() => scrollTo("Vision")}
                className="text-left text-warm-foreground text-xl font-normal font-['DM_Sans'] underline leading-6 hover:opacity-80"
              >
                Vår vision
              </button>
              <button
                type="button"
                onClick={() => scrollTo("Funkar")}
                className="text-left text-warm-foreground text-xl font-normal font-['DM_Sans'] underline leading-6 hover:opacity-80"
              >
                Hur Volly fungerar
              </button>
              <Link
                to="/faq"
                className="text-warm-foreground text-xl font-normal font-['DM_Sans'] underline leading-6 hover:opacity-80"
              >
                FAQ
              </Link>
            </div>
          </div>

          <div className="inline-flex flex-col justify-start items-start gap-12">
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="w-64 text-warm-foreground text-3xl font-semibold font-['DM_Sans'] leading-6">
                Kontakta oss
              </div>
              <a
                href="mailto:info@volly.nu"
                className="text-warm-foreground text-xl font-normal font-['DM_Sans'] underline leading-6 hover:opacity-80"
              >
                info@volly.nu
              </a>
            </div>
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="text-warm-foreground text-3xl font-semibold font-['DM_Sans'] leading-6">
                Säkerhet & Villkor
              </div>
              <button
                type="button"
                className="text-left text-warm-foreground text-xl font-normal font-['DM_Sans'] underline leading-6 hover:opacity-80"
              >
                Användarvillkor
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-50 inline-flex flex-col justify-between items-end">
            <div className="py-16 flex flex-col justify-center items-end gap-2.5">
              <div className="opacity-70 text-primary text-7xl font-normal font-emblema leading-6">
                Volly
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <p className="text-muted-foreground text-xl font-normal font-['DM_Sans'] leading-6">
            © 2026 Volly
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
