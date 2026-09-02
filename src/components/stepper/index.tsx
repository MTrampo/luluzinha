import { cn } from "@/commons/lib/tw-merge";
import * as React from "react"

export interface StepItem {
  id: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepperHeaderProps {
  steps: StepItem[];
  currentStepId: string;
  className?: string;
}

export function StepperHeader({ steps, currentStepId, className }: StepperHeaderProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStepId);
  const currentStep = steps[currentIndex];

  if (!currentStep) return null;

  return (
    <div className={cn("flex flex-col gap-6 w-full group", className)}>
      {/* 1. Header (Icone + Textos do passo atual) */}
      <div className="flex items-center gap-5">
        {currentStep.icon && (
          <div className="relative">
            {/* Glow effect for active step */}
            <div className="absolute inset-0 bg-purple-400 rounded-full blur-md opacity-20 animate-pulse" />

            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-purple-700 text-white shadow-xl shadow-purple-100 border border-purple-400/20 text-xl">
              {currentStep.icon}
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <p className="text-[0.6rem] font-black text-purple-400 uppercase tracking-[0.25em] mb-0.5">Passo {currentIndex + 1} de {steps.length}</p>
          <h3 className="font-black text-purple-900 text-xl tracking-tight leading-tight">{currentStep.title}</h3>
          {currentStep.description && (
            <p className="text-sm font-medium text-gray-500/80 mt-0.5">{currentStep.description}</p>
          )}
        </div>
      </div>

      {/* 2. Barras de Progresso (Lines) - Refinadas com gradientes e animações bidirecionais */}
      <div className="flex gap-2.5 w-full">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div
              key={step.id}
              className="h-2 flex-1 relative rounded-full bg-purple-200 overflow-hidden shadow-inner"
            >
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-in-out rounded-full",
                  isActive ? "bg-linear-to-r from-purple-500 to-purple-700 w-full animate-pulse" :
                    isCompleted ? "bg-purple-900 w-full" :
                      "w-0"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
