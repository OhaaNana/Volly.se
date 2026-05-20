import { useState, useMemo } from "react";
import StepRole from "./steps/StepRole";
import StepExpertise from "./steps/StepExpertise";
import StepHelpType from "./steps/StepHelpType";
import StepPreference from "./steps/StepPreference";
import StepToS from "./steps/StepToS";

export type OnboardingData = {
  role: string;
  expertise: string[];
  helpType: string;
  preference: string;
  tosAccepted: boolean;
};

interface OnboardingPageProps {
  userEmail: string;
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const ALL_STEPS = [
  { id: "role", component: StepRole },
  { id: "expertise", component: StepExpertise },
  { id: "helpType", component: StepHelpType },
  { id: "preference", component: StepPreference },
  { id: "tos", component: StepToS },
];

export default function OnboardingPage({
  userEmail,
  onComplete,
  onSkip,
}: OnboardingPageProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    role: "",
    expertise: [],
    helpType: "",
    preference: "",
    tosAccepted: false,
  });

  // If role is "hjälpsökande", only show step 1 (role) → step 5 (ToS)
  const steps = useMemo(() => {
    if (data.role === "hjälpsökande") {
      return ALL_STEPS.filter((s) => s.id === "role" || s.id === "tos");
    }
    return ALL_STEPS;
  }, [data.role]);

  const currentStep = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const CurrentStepComponent = currentStep.component;

  const nextStep = () => {
    if (isLast) {
      onComplete(data);
      return;
    }
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setStepIndex((s) => Math.max(s - 1, 0));
  };

  // When role changes to "hjälpsökande" and we're on step 1,
  // the steps array shrinks — clamp index if needed
  const safeStepIndex = Math.min(stepIndex, steps.length - 1);
  if (safeStepIndex !== stepIndex) {
    setStepIndex(safeStepIndex);
  }

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center px-4 py-10">
      {/* Welcome header */}
      <div className="w-full max-w-md mb-6 text-center">
        <h1 className="text-3xl font-bold">
          Hej, välkommen till <span className="italic">Volly</span> !
        </h1>
        <p className="text-gray-500 mt-2">
          Här kommer {steps.length} steg innan vi skickar dig vidare
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="w-full max-w-md">
        <CurrentStepComponent data={data} setData={setData} />
      </div>

      {/* Navigation */}
      <div className="w-full max-w-md mt-8 flex gap-3">
        {!isFirst && (
          <button
            onClick={prevStep}
            className="flex-1 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Föregående Steg
          </button>
        )}
        <button
          onClick={nextStep}
          disabled={isLast && !data.tosAccepted}
          className={`flex-1 py-3 bg-black text-white font-semibold rounded-xl transition-colors ${
            isLast && !data.tosAccepted
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-800"
          }`}
        >
          {isLast ? "Gå vidare" : "Nästa Steg"}
        </button>
      </div>
    </div>
  );
}
