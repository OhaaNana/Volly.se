import type { OnboardingData } from "../OnboardingPage";

interface StepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

export default function StepToS({ data, setData }: StepProps) {
  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-4">
        Sist men inte minst, här är våra användarvillkor.
      </h2>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed max-h-80 overflow-y-auto space-y-4">
        <div>
          <h3 className="font-bold text-gray-900 mb-1">
            Användarvillkor & GDPR-policy
          </h3>
          <p>
            Välkommen till vår plattform! Vi är glada att du är här. För att
            skapa en trygg och trivlig miljö för alla våra användare (både
            volontärer och hjälpsökande) har vi satt upp följande enkla men
            viktiga regler. Genom att använda vår tjänst godkänner du dessa
            villkor.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            1. Respekt och gott uppförande
          </h4>
          <p>
            Här på plattformen möts vi med respekt. Vi tolererar absolut inget
            näthat, kränkningar, hot, trakasserier eller diskriminering. Bryter
            man mot detta stängs kontot av omedelbart.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            2. Personuppgifter och GDPR (Din Integritet)
          </h4>
          <p>
            Vi värnar om din personliga integritet och följer
            dataskyddsförordningen (GDPR). Det innebär att:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              Syfte: Vi samlar bara in de uppgifter som behövs för att
              plattformen ska fungera.
            </li>
            <li>
              Synlighet: Löss, namn, e-post och de preferenser du väljer i din
              onboarding.
            </li>
            <li>
              Samtycke: Genom att skapa ett konto godkänner du att vi hanterar
              dina uppgifter för att kunna matcha dig med rätt person.
            </li>
            <li>
              Dina rättigheter: Du har alltid rätt att få ta del av vilken
              information vi har sparad om dig, och du kan när som helst begära
              att dina uppgifter och ditt konto raderas helt från vårt system.
            </li>
            <li>
              Tredjeparter: Vi säljer aldrig dina uppgifter vidare till andra
              företag.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            3. Falska profiler och missbruk
          </h4>
          <p>
            Det är inte tillåtet att skapa falska profiler eller utge sig för
            att vara någon annan. Plattformen är till för genuint stöd och
            volontärinsatser. Upptäcks missbruk eller misstänkt bedrägligt bruk
            kommer profilen att tas bort och vid behov polisanmälas.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            4. Kommunikation på plattformen
          </h4>
          <p>
            För din egen säkerhet rekommenderar vi att den första kontakten och
            kommunikationen sker via våra inbyggda verktyg (chatt och
            videosamtal) innan ni eventuellt bestämmer er för att träffas på
            annan ort.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            5. Kontakt och registerutdrag
          </h4>
          <p>
            Om du vill veta vilken data vi har sparad om dig, eller om du vill
            radera ditt konto, kontakta oss på info@volly.se.
          </p>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer mt-5">
        <input
          type="checkbox"
          checked={data.tosAccepted}
          onChange={(e) =>
            setData((prev) => ({ ...prev, tosAccepted: e.target.checked }))
          }
          className="w-5 h-5 rounded border-gray-300 accent-[#2D6A4F]"
        />
        <span className="text-sm text-gray-700">
          Jag har läst och godkänner villkoren
        </span>
      </label>
    </div>
  );
}
