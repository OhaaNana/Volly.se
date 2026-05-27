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
  const togglePreference = (id: string) => {
    setData((prev) => ({
      ...prev,
      preference: prev.preference.includes(id)
        ? prev.preference.filter((p) => p !== id)
        : [...prev.preference, id],
    }));
  };

  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-1">
        Steg 4 : När passar det dig bäst?
      </h2>
      <p className="text-xs text-gray-400 mb-6">
        Du kan ändra detta val sedan under Mina sidor
      </p>

      <div className="flex flex-wrap gap-3">
        {PREFERENCE_OPTIONS.map((option) => {
          const isSelected = data.preference.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => togglePreference(option.id)}
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
  );
}
