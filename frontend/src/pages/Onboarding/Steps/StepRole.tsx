import type { OnboardingData } from "../OnboardingPage";

interface StepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const ROLE_OPTIONS = [
  { id: "volontär", label: "Volontär" },
  { id: "hjälpsökande", label: "Hjälpsökande" },
  { id: "båda", label: "Båda" },
];

export default function StepRole({ data, setData }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Steg 1 : Vad vill du göra på plattformen?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Du kan alltid ändra detta val under Mina sidor
        </p>
      </div>

      <div className="flex gap-3">a
        {ROLE_OPTIONS.map((option) => {
          const isSelected = data.role === option.id;
          return (
            <button
              key={option.id}
              onClick={() =>
                setData((prev) => ({ ...prev, role: option.id }))
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
