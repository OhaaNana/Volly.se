import type { OnboardingData } from "../OnboardingPage";

interface StepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const HELP_TYPE_OPTIONS = [
  { id: "video", label: "Video" },
  { id: "chatt", label: "Chatt" },
  { id: "båda", label: "Båda (Video + Chatt)" },
];

export default function StepHelpType({ data, setData }: StepProps) {
  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-1">
        Steg 3 : Hur vill du hjälpa andra?
      </h2>
      <p className="text-xs text-gray-400 mb-6">
        Du kan alltid ändra valen i din profil
      </p>

      <div className="flex gap-3">
        {HELP_TYPE_OPTIONS.map((option) => {
          const isSelected = data.helpType === option.id;
          return (
            <button
              key={option.id}
              onClick={() =>
                setData((prev) => ({ ...prev, helpType: option.id }))
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
  );
}
