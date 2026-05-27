const HOW_IT_WORKS_CARDS = [
  {
    icon: "fi fi-rr-apps",
    title: "Hitta eller skapa ett inlägg",
    description:
      "Utforska flödet för att hitta människor som söker eller erbjuder stöd - eller skapa ett eget inlägg för att be eller erbjuda hjälp till andra.\n\nNär du hittar ett inlägg du vill svara på skickas en meddelandeförfrågan för att starta en privat chatt mellan er.",
  },
  {
    icon: "fi fi-rr-video-camera",
    title: "Chatta & videosamtala",
    description:
      "Lär känna varandra tryggt direkt i Volly genom chatt och videosamtal.\n\nVideosamtal blir tillgängligt först efter att en chatt har startats, vilket fungerar som en extra säkerhetsåtgärd och ger båda parter möjlighet att känna sig bekväma innan vidare kontakt.",
  },
  {
    icon: "fi fi-rr-shield-check",
    title: "Hjälp tryggt & säkert",
    description:
      "Verifierade konton, betyg och recensioner hjälper dig att skapa säkra kontakter, samtidigt som möjligheten att vara anonym ger extra integritet vid behov.\n\nFör din säkerhet rekommenderar vi att du aldrig delar känsliga eller personliga uppgifter med andra användare.",
  },
] as const;

type HowVollyWorksProps = {
  compact?: boolean;
};

function HowVollyWorks({ compact = false }: HowVollyWorksProps) {
  if (compact) {
    return (
      <section className="w-full">
        <div className="mx-auto">
          <h2 className="font-display text-lg font-bold mb-3">
            Hur Volly fungerar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {HOW_IT_WORKS_CARDS.map((card) => (
              <article
                key={card.title}
                className="p-4 rounded-2xl bg-card border border-border"
              >
                <div className="w-9 h-9 rounded-full bg-accent text-primary inline-flex items-center justify-center mb-3">
                  <i
                    className={`${card.icon} text-xl leading-0`}
                    aria-hidden="true"
                  />
                </div>

                <p className="font-semibold text-sm mb-1">{card.title}</p>
                <p className="text-xs text-muted-foreground whitespace-pre-line">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section
      id="Funkar"
      className="w-full self-stretch min-h-200 bg-background"
    >
      <div className="self-stretch h-200 pl-65 pr-8 pb-24 bg-background inline-flex flex-col justify-center items-end">
        <div className="self-stretch flex flex-col justify-center items-center gap-12 overflow-hidden">
          <h2 className="text-center text-icon-active text-5xl font-semibold font-['DM_Sans'] leading-13">
            Hur Volly fungerar
          </h2>
          <div className="w-full max-w-5xl inline-flex justify-end items-center gap-7 flex-col lg:flex-row flex-wrap">
            {HOW_IT_WORKS_CARDS.map((card) => (
              <article
                key={card.title}
                className="w-full lg:w-[320px] p-5 bg-card rounded-2xl outline -outline-offset-1 outline-border inline-flex flex-col justify-start items-start gap-4 overflow-hidden"
              >
                <div className="size-16 bg-pastel-lime rounded-[50px] flex flex-col justify-center items-center overflow-hidden">
                  <div className="size-14 inline-flex justify-center items-center">
                    <i
                      className={`${card.icon} text-2xl text-primary`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1 overflow-hidden">
                  <h3 className="self-stretch text-Forest text-lg font-semibold font-['DM_Sans']">
                    {card.title}
                  </h3>
                  <p className="self-stretch text-muted-foreground text-lg font-normal font-['DM_Sans'] leading-6 whitespace-pre-line">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowVollyWorks;
