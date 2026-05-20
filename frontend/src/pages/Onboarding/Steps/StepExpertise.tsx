import type { OnboardingData } from "../OnboardingPage";

interface StepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const CATEGORY_OPTIONS = [
  { id: "hälsa", label: "Hälsa", emoji: "🌿" },
  { id: "teknik", label: "Teknik", emoji: "💻" },
  { id: "vardag", label: "Vardag", emoji: "🤝" },
  { id: "studier", label: "Studier", emoji: "📚" },
  { id: "språk", label: "Språk", emoji: "🗣️" },
  { id: "karriär", label: "Karriär", emoji: "💼" },
];

export default function StepExpertise({ data, setData }: StepProps) {
  const toggleExpertise = (id: string) => {
    setData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(id)
        ? prev.expertise.filter((e) => e !== id)
        : [...prev.expertise, id],
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Steg 2 : Välj dina kategoriområden
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Du kan alltid ändra detta val under Mina sidor
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {CATEGORY_OPTIONS.map((option) => {
          const isSelected = data.expertise.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleExpertise(option.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                isSelected
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
