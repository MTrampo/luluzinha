"use client"

import { useState } from "react";
import { PlanConfigFormatted } from "@/commons/models/plan";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { AlphaNoticeModal } from "@/components/modals/alpha-notice-modal";

interface LandingPricingCardProps {
  plan: PlanConfigFormatted;
  user?: unknown;
}

export function LandingPricingCard({ plan, user }: LandingPricingCardProps) {
  const [isAlphaModalOpen, setIsAlphaModalOpen] = useState(false);
  const isFeatured = plan.isFeatured;
  const priceString = plan.price.toFixed(2).replace(".", ",");
  const billingText = plan.billingPeriod === "yearly" ? "/ano" : "/mês";

  return (
    <>
      <div
        className={`relative w-full max-w-md mx-auto rounded-3xl p-8 sm:p-10 shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 animate-pricing-card opacity-0 flex flex-col justify-between ${
          isFeatured
            ? "bg-white border-2 border-purple-500 shadow-xl shadow-purple-500/10 ring-4 ring-purple-100/60"
            : "bg-white border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-200"
        }`}
      >
        {/* Selo de Destaque Superior */}
        {plan.badge && (
          <div className="absolute top-0 right-0">
            <span className="inline-flex items-center gap-1.5 bg-linear-to-r from-purple-700 to-purple-900 text-white text-xs font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider font-lexend shadow-xs">
              {plan.badge}
            </span>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-purple-950 font-lexend tracking-tight">
              {plan.name}
            </h3>
            {plan.description && (
              <p className="text-purple-900/70 text-sm leading-relaxed font-medium">
                {plan.description}
              </p>
            )}
          </div>

          <div className="flex items-baseline text-purple-950">
            <span className="text-2xl font-extrabold tracking-tight text-purple-950">R$</span>
            <span className="text-5xl font-black tracking-tight font-lexend text-purple-900">
              {priceString}
            </span>
            <span className="ml-1 text-xl font-semibold text-purple-900/60">
              {billingText}
            </span>
          </div>

          {/* Lista de Benefícios */}
          <div className="border-t border-purple-100/80 pt-6 space-y-3.5">
            {plan.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-purple-100 text-purple-700 mt-0.5 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-700" />
                </div>
                <span className="text-purple-950/80 text-sm font-medium leading-snug">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Botão de Ação */}
          <div className="pt-4">
            {user ? (
              <Button
                className="group w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full font-black py-6 text-base shadow-md shadow-purple-900/15 transition-all duration-200 active:scale-[0.99]"
                asChild
              >
                <Link
                  href="/painel"
                  className="inline-flex items-center justify-center"
                >
                  Ir para o meu espaço
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 delay-75 group-hover:translate-x-1.5" />
                </Link>
              </Button>
            ) : (
              <Button
                onClick={() => setIsAlphaModalOpen(true)}
                className="group w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full font-black py-6 text-base shadow-md shadow-purple-900/15 transition-all duration-200 active:scale-[0.99] cursor-pointer"
              >
                <span className="inline-flex items-center justify-center">
                  Entrar na Lista de Espera VIP
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 delay-75 group-hover:translate-x-1.5" />
                </span>
              </Button>
            )}
          </div>

          <div className="text-center pt-2 space-y-2">
            <p className="text-xs text-purple-900/60 font-medium">
              Fase Alpha Fechada • Em breve abertura do <strong className="text-purple-950 font-bold">Beta Público</strong>
            </p>
            <p className="text-[11px] text-purple-900/40 leading-normal">
              Acesso exclusivo no momento apenas para manicures convidadas.
            </p>
          </div>
        </div>
      </div>

      <AlphaNoticeModal
        isOpen={isAlphaModalOpen}
        onClose={() => setIsAlphaModalOpen(false)}
        origin="landing_pricing"
      />
    </>
  );
}
