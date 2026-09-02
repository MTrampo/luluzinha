import { PlanConfigFormatted } from "@/commons/models/plan";
import { ButtonSubscription } from "@/components/buttons/subscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCheck, FaCrown } from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";

interface PlanCardProps {
  plan: PlanConfigFormatted;
}

export function PlanCard({ plan }: PlanCardProps) {
  const isFeatured = plan.isFeatured;

  return (
    <Card
      className={`relative flex flex-col justify-between w-full transition-all duration-300 rounded-3xl overflow-hidden ${isFeatured
          ? "border-2 border-purple-500 shadow-xl shadow-purple-500/10 bg-white ring-4 ring-purple-100/50"
          : "border border-purple-100 shadow-sm hover:shadow-md bg-white/90"
        }`}
    >
      {/* Badge de Destaque Superior */}
      {plan.badge && (
        <div className="absolute top-0 right-0">
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-bl-2xl text-xs font-bold tracking-wide uppercase ${isFeatured
                ? "bg-linear-to-r from-purple-700 to-purple-900 text-white shadow-xs"
                : "bg-purple-100 text-purple-900"
              }`}
          >
            <LuSparkles className="w-3 h-3 text-amber-300" />
            {plan.badge}
          </span>
        </div>
      )}

      <div>
        <CardHeader className="pt-8 pb-4 px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-1">
            {isFeatured && <FaCrown className="w-5 h-5 text-purple-600 shrink-0" />}
            <CardTitle className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
              {plan.name}
            </CardTitle>
          </div>

          {plan.description && (
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
              {plan.description}
            </CardDescription>
          )}

          {/* Valor da Mensalidade */}
          <div className="pt-4 pb-2 flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-purple-900 tracking-tight">
              {plan.priceFormatted}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">
              / {plan.billingPeriod === "yearly" ? "ano" : "mês"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-6">
          <div className="border-t border-purple-100/60 pt-4 flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-950/60">
              O que está incluído:
            </span>

            <ul className="flex flex-col gap-2.5">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 font-medium">
                  <div className="p-1 rounded-full bg-purple-100/80 text-purple-700 mt-0.5 shrink-0">
                    <FaCheck className="w-2.5 h-2.5" />
                  </div>
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </div>

      <CardFooter className="px-6 sm:px-8 pb-8 pt-2">
        <ButtonSubscription
          planSlug={plan.slug}
          variant={isFeatured ? "theme" : "outline"}
          size="lg"
          className="w-full font-bold text-sm tracking-wide shadow-sm active:scale-[0.99] transition-transform"
        >
          ASSINAR {plan.name.toUpperCase()}
        </ButtonSubscription>
      </CardFooter>
    </Card>
  );
}
