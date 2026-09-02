import Header from "@/components/header/dashboard";
import { FinanceHistoryList } from "@/features/dashboard/finance/history";
import { Overview } from "@/features/dashboard/finance/overview";
import { getFinanceDashboardAction } from "@/actions/finance";

export default async function CashRegister() {
  const { data, error } = await getFinanceDashboardAction();

  if (error || !data) {
    return (
      <>
        <Header title="Seu Caixa" />
        <div className="main-content p-6 flex items-center justify-center text-red-500">
          Erro ao carregar dados do financeiro.
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Seu Caixa" />
      <div className="main-content relative overflow-hidden">
        {/* Elemento de Design Premium (Fundo) */}
        <div className="pointer-events-none absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-linear-to-br from-purple-100/40 to-transparent blur-3xl rounded-full" />

        <div className="flex flex-col gap-8 w-full min-w-0">
          <Overview data={data.overview} />

          <div className="flex flex-col gap-4">
            <h2 className="text-purple-900 leading-tight tracking-tight text-lg sm:text-xl font-bold">
              Histórico de Recebíveis
            </h2>

            <FinanceHistoryList initialData={data.history} />
          </div>
        </div>
      </div>
    </>
  );
}