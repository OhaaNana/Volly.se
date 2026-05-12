import { Link } from "react-router-dom";

const faqs = [
  {
    question: "Konto & inloggning",
    answer:
      "För att använda Volly behöver du skapa ett konto med din e-postadress och ett lösenord. När kontot är skapat kan du enkelt logga in för att hitta och delta i volontäruppdrag. Om du har problem med inloggningen kan du återställa ditt lösenord via 'Glömt lösenord'-funktionen.",
  },
  {
    question: "Profil & inställningar",
    answer:
      "Du kan uppdatera din profil genom att gå till dina kontoinställningar efter att du har loggat in. Där kan du ändra information som namn, e-post, lösenord och andra personliga uppgifter.",
  },
  {
    question: "Säkerhet & integritet",
    answer:
      "Vi värnar om din säkerhet och integritet. Dina personuppgifter hanteras enligt gällande dataskyddsregler och delas aldrig med tredje part utan ditt samtycke. Du har alltid möjlighet att uppdatera eller radera dina uppgifter via dina kontoinställningar.",
  },
  {
    question: "andvänding av tjänsten",
    answer:
      "Volly gör det enkelt att hitta och delta i volontärinsatser. När du är inloggad kan du söka efter uppdrag, anmäla dig och följa dina aktiviteter direkt på plattformen.",
  },
  {
    question: "Kontakta oss",
    answer:
      "Har du frågor eller behöver hjälp? Du kan kontakta oss via e-post. Vi strävar efter att svara så snabbt som möjligt. Epost: volly@gmail.com",
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white via-slate-50 to-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="text-2xl font-black tracking-[0.25em] uppercase text-black"
          >
            Volly
          </Link>
          <Link
            to="/"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Till startsidan
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black">
          FAQ
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
          Vanliga frågor
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Här samlar vi svar på de vanligaste frågorna om Volly och hur sidan
          fungerar.
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {item.question}
              </h2>
              <p className="mt-2 leading-7 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
