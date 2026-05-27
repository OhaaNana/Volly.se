import { useState, useMemo } from "react";
import StepRole from "./Steps/StepRole";
import StepExpertise from "./Steps/StepExpertise";
import StepHelpType from "./Steps/StepHelpType";
import StepPreference from "./Steps/StepPreference";
import StepToS from "./Steps/StepToS";

export type OnboardingData = {
  role: string;
  expertise: string[];
  helpType: string;
  preference: string[];
  tosAccepted: boolean;
};

interface OnboardingPageProps {
  onComplete: (data: OnboardingData) => void;
}

const ALL_STEPS = [
  { id: "role", component: StepRole },
  { id: "expertise", component: StepExpertise },
  { id: "helpType", component: StepHelpType },
  { id: "preference", component: StepPreference },
  { id: "tos", component: StepToS },
];

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    role: "",
    expertise: [],
    helpType: "",
    preference: [],
    tosAccepted: false,
  });

  const steps = useMemo(() => {
    if (data.role === "hjälpsökande") {
      return ALL_STEPS.filter((s) => s.id === "role" || s.id === "tos");
    }
    return ALL_STEPS;
  }, [data.role]);

  const safeStepIndex = Math.min(stepIndex, steps.length - 1);
  if (safeStepIndex !== stepIndex) {
    setStepIndex(safeStepIndex);
  }

  const currentStep = steps[safeStepIndex];
  const isFirst = safeStepIndex === 0;
  const isLast = safeStepIndex === steps.length - 1;
  const progress = ((safeStepIndex + 1) / steps.length) * 100;
  const CurrentStepComponent = currentStep.component;

  const nextStep = () => {
    if (isLast) {
      onComplete(data);
      return;
    }
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setStepIndex((s) => Math.max(s - 1, 0));

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-24 font-['DM_Sans']">
      <div className="w-full max-w-xl mb-16">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 px-10 py-8">
        <CurrentStepComponent data={data} setData={setData} />

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {!isFirst && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 bg-[#2D6A4F] text-white font-semibold rounded-full hover:bg-[#245a42] transition-colors"
            >
              Föregående Steg
            </button>
          )}
          <button
            onClick={isLast && !data.tosAccepted ? undefined : nextStep}
            className={`flex-1 py-3 bg-[#E74C3C] text-white font-semibold rounded-full transition-colors ${
              isLast && !data.tosAccepted
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#d44233]"
            }`}
          >
            {isLast ? "Gå vidare" : "Nästa Steg"}
          </button>
        </div>
      </div>
    </div>
  );
}
