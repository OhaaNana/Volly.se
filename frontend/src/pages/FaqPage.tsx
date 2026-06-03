import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

type FaqSubItem = { q: string; a: string };
type FaqSection = {
  id: number;
  title: string;
  items: FaqSubItem[];
  email?: string;
};

const FAQ_SECTIONS: FaqSection[] = [
  {
    id: 1,
    title: "Konto & inloggning",
    items: [
      {
        q: "Hur skapar jag ett konto?",
        a: 'För att skapa ett konto, klicka på "Registrera dig" och fyll i dina uppgifter. Du kan även registrera dig via tredjepartstjänster som Google.',
      },
      {
        q: "Jag har glömt mitt lösenord – vad gör jag?",
        a: 'Klicka på "Glömt lösenord?" på inloggningssidan och följ instruktionerna för att återställa det.',
      },
      {
        q: "Kan jag ändra min e-postadress?",
        a: "Ja, du kan uppdatera din e-postadress i dina kontoinställningar.",
      },
      {
        q: "Hur raderar jag mitt konto?",
        a: 'Gå till kontoinställningar och välj "Radera konto". Observera att detta är permanent och inte kan ångras.',
      },
    ],
  },
  {
    id: 2,
    title: "Profil & inställningar",
    items: [
      {
        q: "Hur uppdaterar jag min profil?",
        a: 'Du kan redigera din profil genom att gå till "Min profil" och klicka på "Redigera".',
      },
      {
        q: "Vilken information är synlig för andra?",
        a: "Endast information du väljer att dela visas offentligt. Du kan justera detta i sekretessinställningarna.",
      },
      {
        q: "Kan jag vara anonym?",
        a: "Ja, du kan välja att dölja vissa uppgifter eller använda ett visningsnamn.",
      },
    ],
  },
  {
    id: 3,
    title: "Säkerhet & integritet",
    items: [
      {
        q: "Hur skyddar ni mina uppgifter?",
        a: "Vi använder kryptering och säkerhetsrutiner för att skydda din data.",
      },
      {
        q: "Delar ni min information med tredje part?",
        a: "Vi delar inte din personliga information utan ditt samtycke, förutom när det krävs enligt lag.",
      },
      {
        q: "Kan jag aktivera tvåfaktorsautentisering?",
        a: "Ja, du kan aktivera 2FA i säkerhetsinställningarna för extra skydd.",
      },
    ],
  },
  {
    id: 4,
    title: "Användning av tjänsten",
    items: [
      {
        q: "Hur fungerar plattformen?",
        a: "När du har ett konto kan du [utföra huvudfunktion X], [interagera med andra användare], och [hantera dina inställningar].",
      },
      {
        q: "Är tjänsten gratis att använda?",
        a: "Helt gratis!",
      },
    ],
  },
  {
    id: 5,
    title: "Kontakta oss",
    email: "info@volly.nu",
    items: [
      {
        q: "Hur kontaktar jag support?",
        a: "Du kan nå oss via kontaktformuläret eller e-post på info@volly.nu",
      },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="#321A16"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccordionSection({
  section,
  isOpen,
  onToggle,
}: {
  section: FaqSection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-[20px] overflow-hidden transition-colors"
      style={{ backgroundColor: "rgba(214, 232, 217, 0.4)" }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-8 py-7 text-left cursor-pointer"
      >
        <span
          className="text-lg font-semibold font-['DM_Sans']"
          style={{ color: "#321A16" }}
        >
          {section.title}
        </span>
        <ChevronIcon open={isOpen} />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-8 pb-8 flex flex-col gap-5">
            {section.items.map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <p
                  className="text-sm font-semibold font-['DM_Sans']"
                  style={{ color: "#321A16" }}
                >
                  {item.q}
                </p>
                <p
                  className="text-sm font-normal font-['DM_Sans'] leading-relaxed"
                  style={{ color: "#321A16", opacity: 0.6 }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 py-16">
        <h1
          className="text-4xl font-bold font-['DM_Sans'] tracking-tight"
          style={{ color: "#321A16" }}
        >
          Vanliga frågor och svar
        </h1>
        <p
          className="mt-3 text-base font-['DM_Sans'] leading-relaxed"
          style={{ color: "#321A16", opacity: 0.5 }}
        >
          Här samlar vi svar på de vanligaste frågorna om Volly och hur sidan
          fungerar.
        </p>

        <section
          aria-label="Vanliga frågor"
          className="mt-10 flex flex-col gap-4"
        >
          {FAQ_SECTIONS.map((section, index) => (
            <AccordionSection
              key={section.id}
              section={section}
              isOpen={openIndexes.has(index)}
              onToggle={() => toggle(index)}
            />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
