import { useState, useMemo } from "react";
import StepRole from "./Steps/StepRole";
import StepExpertise from "./Steps/StepExpertise";
import StepHelpType from "./Steps/StepHelpType";
import StepPreference from "./Steps/StepPreference";
import StepToS from "./Steps/StepToS";
import Navbar from "../../Navbar";
import Footer from "../../components/footer";

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
  <div className="min-h-dvh w-full flex flex-col bg-[#F5F3EE] font-['DM_Sans']">
    {/* Navbar with padding so it doesn't touch edges */}
    <div className="w-full mx-auto px-0">
      <Navbar disableLinks />
    </div>

    {/* Main content centered with spacing */}
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      {/* Progress bar */}
      <div className="w-full max-w-xl mb-10">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 px-10 py-8">
        <CurrentStepComponent data={data} setData={setData} />

{/* Navigation */}
<div className="mt-8 flex gap-3">
  {!isFirst && (
    <button
      onClick={prevStep}
      className="flex-1 py-3 bg-gradient-to-b from-[#FC9B6F] to-[#E64343] text-[#321A16] font-bold rounded-full outline outline-1 outline-[#321A16] hover:opacity-90 transition-opacity"
    >
      Föregående Steg
    </button>
  )}
  <button
    onClick={isLast && !data.tosAccepted ? undefined : nextStep}
    className={`flex-1 py-3 bg-gradient-to-b from-[#FC9B6F] to-[#E64343] text-[#321A16] font-bold rounded-full outline outline-1 outline-[#321A16] transition-opacity ${
      isLast && !data.tosAccepted
        ? "opacity-40 cursor-not-allowed"
        : "hover:opacity-90"
    }`}
  >
    {isLast ? "Gå vidare" : "Nästa Steg"}
  </button>
</div>
      </div>
    </div>

    {/* Footer with padding to match navbar */}
    <div className="w-full mx-auto px-0">
      <Footer />
    </div>
  </div>
);
}