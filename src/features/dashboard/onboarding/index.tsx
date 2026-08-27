'use client'

import { Scoped, useStepper } from "./onboarding-steps";
import { ProfileStep } from "./steps/profile-step";
import { EstablishmentStep } from "./steps/establishment-step";
import { StepperHeader, StepItem } from "@/components/stepper";
import { useProfileStore } from "@/store/use-profile";
import { useEffect, useState } from "react";

export function Onboarding() {
  return (
    <Scoped>
      <OnboardingContent />
    </Scoped>
  );
}

function OnboardingContent() {
  const stepper = useStepper();
  const profile = useProfileStore((state) => state.profile);
  const [hasAutoNavigated, setHasAutoNavigated] = useState(false);

  // Se o perfil já estiver configurado (não é o nome padrão provisório),
  // inicia o fluxo direto no passo da bancada (segundo passo) para poupar cliques.
  useEffect(() => {
    if (hasAutoNavigated) return;
    
    if (profile?.name && profile.name !== "Manicure Luluzinha") {
      stepper.navigation.goTo("establishment");
      setHasAutoNavigated(true);
    }
  }, [profile?.name, hasAutoNavigated, stepper.navigation]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Indicador visual do Stepper */}
      <StepperHeader
        steps={stepper.state.all as unknown as StepItem[]}
        currentStepId={stepper.state.current.data.id}
        className="max-w-2xl mx-auto"
      />

      <div className="min-h-[400px]">
        {stepper.flow.switch({
          "profile": () => <ProfileStep />,
          "establishment": () => <EstablishmentStep />
        })}
      </div>
    </div>
  );
}
