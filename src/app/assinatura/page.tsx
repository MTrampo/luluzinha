import Header from "@/components/header";
import { getActivePlansAction } from "@/actions/subscription";
import { PlanCard } from "@/features/subscription/plan-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FaCalendarDay, FaHandcuffs, FaHandshakeSimple, FaShieldHalved, FaWandMagicSparkles } from "react-icons/fa6";

export default async function SubscriptionPage() {
  const { data: allPlans } = await getActivePlansAction();
  // Planos públicos da vitrine (exclui convites Alpha privados com valor 0)
  const plans = allPlans.filter((p) => p.price > 0);


  return (
    <>
      <Header />
      <main className="mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-5xl md:max-w-7xl">
        {/* Cabeçalho da Página */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100/80 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3">
            <FaWandMagicSparkles className="w-3.5 h-3.5 text-purple-700" />
            Invista no seu Espaço
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-purple-950 tracking-tight leading-tight">
            Escolha o plano ideal para você brilhar
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-medium">
            Tudo o que você precisa para dominar sua agenda, encantar suas Poderosas e valorizar o seu trabalho.
          </p>
        </div>

        {/* Grade de Planos (Mobile First & 100% Responsiva) */}
        {plans.length === 0 ? (
          <div className="p-8 text-center bg-white border border-purple-100 rounded-3xl text-purple-950/70 text-sm max-w-lg mx-auto shadow-sm">
            Nenhum plano disponível para assinatura no momento. Entre em contato com o suporte!
          </div>
        ) : (
          <div
            className={`grid gap-6 sm:gap-8 mx-auto items-stretch ${
              plans.length === 1
                ? "max-w-md grid-cols-1"
                : plans.length === 2
                ? "max-w-4xl grid-cols-1 md:grid-cols-2"
                : "max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        {/* Seção de Segurança e Transparência no Pagamento */}
        <div className="mt-14 sm:mt-20 pt-10 border-t border-purple-100/80 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
              <FaShieldHalved className="w-3.5 h-3.5 text-emerald-600" />
              Pagamento 100% Seguro
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-purple-950">
              Gerenciado exclusivamente pelo Mercado Pago
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Total tranquilidade e controle para você focar no que faz de melhor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-purple-50 bg-white/70 shadow-2xs">
              <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-5">
                <div className="p-2 rounded-xl bg-purple-100/60 text-purple-900 shrink-0">
                  <FaHandshakeSimple className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm sm:text-base font-bold text-purple-950">
                  Transparência
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-5 pt-0">
                <CardDescription className="text-xs sm:text-sm text-gray-500 leading-normal">
                  Cobrança recorrente clara, sem taxas escondidas ou letras miúdas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-purple-50 bg-white/70 shadow-2xs">
              <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-5">
                <div className="p-2 rounded-xl bg-purple-100/60 text-purple-900 shrink-0">
                  <FaHandcuffs className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm sm:text-base font-bold text-purple-950">
                  Sem Fidelidade
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-5 pt-0">
                <CardDescription className="text-xs sm:text-sm text-gray-500 leading-normal">
                  Cancele quando quiser, direto pelo painel, sem multas ou burocracia.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-purple-50 bg-white/70 shadow-2xs">
              <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-5">
                <div className="p-2 rounded-xl bg-purple-100/60 text-purple-900 shrink-0">
                  <FaCalendarDay className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm sm:text-base font-bold text-purple-950">
                  Data Fixa
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-5 pt-0">
                <CardDescription className="text-xs sm:text-sm text-gray-500 leading-normal">
                  A cobrança é realizada sempre no mesmo dia do mês em que você assinou.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rodapé Legal */}
        <p className="text-muted-foreground text-xs leading-normal font-normal text-center mt-10">
          Ao assinar, você concorda com nossos{" "}
          <Link className="text-purple-950 font-semibold underline underline-offset-2" href="/documento/termo">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link className="text-purple-950 font-semibold underline underline-offset-2" href="/documento/politica">
            Política de Privacidade
          </Link>
          .
        </p>
      </main>
    </>
  );
}