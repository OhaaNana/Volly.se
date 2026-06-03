const HOW_IT_WORKS_CARDS = [
  {
    icon: "fi fi-rr-apps",
    title: "Hitta eller skapa ett inlägg",
    description:
      "Utforska flödet för att hitta människor som söker eller erbjuder stöd - eller skapa ett eget inlägg för att be eller erbjuda hjälp till andra.\n\nNär du hittar ett inlägg du vill svara på skickas en meddelandeförfrågan för att starta en privat chatt mellan er.",
  },
  {
    icon: "fi fi-rr-video-camera-alt",
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
          <h2 className="font-display text-xl font-bold mb-3">
            Hur Volly fungerar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {HOW_IT_WORKS_CARDS.map((card) => (
              <article
                key={card.title}
                className="p-4 rounded-2xl bg-card border border-border"
              >
                <div className="size-12 rounded-full bg-accent text-primary inline-flex items-center justify-center mb-3">
                  <i
                    className={`${card.icon} text-xl leading-0`}
                    aria-hidden="true"
                  />
                </div>

                <p className="font-semibold text-base mb-1">{card.title}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
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
    <section id="Funkar" className="w-full py-12">
      <div className="flex flex-col gap-6">
        <h2 className="self-stretch text-icon-active text-4xl font-semibold leading-17">
          Hur Volly fungerar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {HOW_IT_WORKS_CARDS.map((card) => (
            <article
              key={card.title}
              className="p-6 bg-card rounded-2xl border border-border flex flex-col gap-4"
            >
              <div className="size-14 rounded-full bg-accent inline-flex items-center justify-center shrink-0">
                <i
                  className={`${card.icon} text-2xl text-primary leading-none`}
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-base text-muted-foreground leading-6 whitespace-pre-line">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowVollyWorks;
