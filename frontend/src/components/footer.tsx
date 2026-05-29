import { Link } from "react-router-dom";

function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-primary-soft rounded-tl-[30px] rounded-tr-[30px]">
      <div className="w-full mx-auto px-12 pt-12 pb-6 flex flex-col gap-3.5">
        <div className="p-8 flex justify-start items-start gap-24 flex-wrap">
          <div className="inline-flex flex-col justify-start items-start gap-4">
            <div className="text-warm-foreground text-2xl font-semibold leading-6">
              Om oss
            </div>
            <div className="flex flex-col justify-start items-start gap-2.5">
              <button
                type="button"
                onClick={() => scrollTo("Vision")}
                className="text-left text-warm-foreground text-lg font-normal underline leading-6 hover:opacity-80"
              >
                Vår vision
              </button>
              <button
                type="button"
                onClick={() => scrollTo("Funkar")}
                className="text-left text-warm-foreground text-lg font-normal underline leading-6 hover:opacity-80"
              >
                Hur Volly fungerar
              </button>
              <Link
                to="/faq"
                className="text-warm-foreground text-lg font-normal underline leading-6 hover:opacity-80"
              >
                FAQ
              </Link>
            </div>
          </div>

          <div className="inline-flex flex-col justify-start items-start gap-12">
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="w-64 text-warm-foreground text-2xl font-semibold leading-6">
                Kontakta oss
              </div>
              <a
                href="mailto:info@volly.nu"
                className="text-warm-foreground text-lg font-normal underline leading-6 hover:opacity-80"
              >
                info@volly.nu
              </a>
            </div>
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="text-warm-foreground text-2xl font-semibold leading-6">
                Säkerhet & Villkor
              </div>
              <button
                type="button"
                className="text-left text-warm-foreground text-lg font-normal underline leading-6 hover:opacity-80"
              >
                Användarvillkor
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-50 inline-flex flex-col justify-between items-end">
            <div className="py-16 pr-10 justify-center items-end flex flex-row gap-2">
              <div className="size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-glow">
                V
              </div>

              <div className="font-display text-5xl font-bold tracking-tight text-warm-foreground">
                Volly
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <p className="text-muted-foreground text-lg font-normal leading-6">
            © 2026 Volly
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
