import type { OnboardingData } from "../OnboardingPage";

interface StepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const ROLE_OPTIONS = [
  { id: "volontär", label: "Volontärer" },
  { id: "hjälpsökande", label: "Hjälpsökande" },
  { id: "båda", label: "Båda" },
];

export default function StepRole({ data, setData }: StepProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Hej...., välkommen till{" "}
        <span className="italic font-semibold">Volly</span> !
      </h1>
      <p className="text-sm text-gray-500 text-center italic leading-relaxed mb-6">
        "Vår tjänst är helt gratis att använda. Volly är byggt för att skapa ett
        tryggare, varmare och mer sammanhållet samhälle där vi hjälper
        varandra."
      </p>

      <div className="border-t border-gray-200 pt-6">
        <p className="text-xs text-gray-400 mb-3">
          Bara 5 snabba frågor kvar innan du är igång!
        </p>
        <h2 className="text-base font-bold text-gray-900 mb-1">
          Steg 1: Vad vill du göra på plattformen?
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          Du kan alltid ändra detta val under Mina sidor
        </p>

        <div className="flex gap-3">
          {ROLE_OPTIONS.map((option) => {
            const isSelected = data.role === option.id;
            return (
              <button
                key={option.id}
                onClick={() =>
                  setData((prev) => ({ ...prev, role: option.id }))
                }
                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#2D6A4F]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
