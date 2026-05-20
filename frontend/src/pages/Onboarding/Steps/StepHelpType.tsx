import type { OnboardingData } from "../OnboardingPage";

interface StepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const PREFERENCE_OPTIONS = [
  { id: "vardagar", label: "Vardagar" },
  { id: "helger", label: "Helger" },
  { id: "dagtid", label: "Dagtid" },
  { id: "kvällstid", label: "Kvällstid" },
  { id: "flexibelt", label: "Flexibelt" },
];

export default function StepPreference({ data, setData }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Steg 4 : När passar det dig bäst?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Du kan ändra detta val sedan under Mina sidor
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {PREFERENCE_OPTIONS.map((option) => {
          const isSelected = data.preference === option.id;
          return (
            <button
              key={option.id}
              onClick={() =>
                setData((prev) => ({ ...prev, preference: option.id }))
              }
              className={`px-5 py-3 rounded-full border text-sm font-medium transition-all ${
                isSelected
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
