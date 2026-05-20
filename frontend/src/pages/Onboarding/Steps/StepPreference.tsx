import type { OnboardingData } from "../OnboardingPage";

interface StepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const PREFERENCE_OPTIONS = [
  { id: "teknisk", label: "Teknisk" },
  { id: "läxhjälp", label: "Läxhjälp" },
  { id: "översättning", label: "Översättning" },
  { id: "datorer", label: "Datorer" },
  { id: "sällskap", label: "Sällskap" },
  { id: "annat", label: "Annat" },
];

export default function StepPreference({ data, setData }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Steg 4 : Placeholder — uppdatera senare
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Du kan ändra på detta valet i Mina sidor
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
