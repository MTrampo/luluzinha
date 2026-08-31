import Header from "@/components/header/dashboard";
import { Transaction } from "@/features/dashboard/finance/history";
import { Overview } from "@/features/dashboard/finance/overview";
import { getFinanceDashboardAction } from "@/actions/finance";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
        <div className="absolute top-0 right-0 -u-z-10 w-1/2 h-1/2 bg-linear-to-br from-purple-100/40 to-transparent blur-3xl rounded-full" />

        <div className="flex flex-col gap-8 w-full min-w-0">
          <Overview data={data.overview} />

          <div className="flex flex-col gap-4">
            <h2 className="text-purple-900 leading-tight tracking-tight text-lg sm:text-xl font-bold">
              Histórico de Recebíveis
            </h2>

            {data.history.length === 0 ? (
              <div className="p-8 text-center bg-white border border-purple-100/80 rounded-2xl text-purple-900/50 text-sm shadow-xs">
                Nenhum atendimento finalizado no mês atual. Finalize atendimentos para vê-los aqui!
              </div>
            ) : (
              <div className="bg-white border border-purple-100/80 rounded-2xl overflow-hidden shadow-xs divide-y divide-purple-100/40">
                {data.history.map((item) => (
                  <Transaction
                    key={item.id}
                    id={item.id}
                    customerName={item.customerName}
                    initials={item.customerInitials}
                    type="Atendimento Realizado"
                    amount={item.totalPriceFormatted}
                    date={format(parseISO(item.startAt), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}