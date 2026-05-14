import Header from "@/components/header/dashboard";
import { Transaction } from "@/features/dashboard/finance/history";
import { Overview } from "@/features/dashboard/finance/overview";

export default async function CashRegister() {
  return (
    <>
      <Header title="Seu Caixa" />
      <div className="main-content relative overflow-hidden">
        {/* Elemento de Design Premium (Fundo) */}
        <div className="absolute top-0 right-0 -u-z-10 w-1/2 h-1/2 bg-linear-to-br from-purple-100/40 to-transparent blur-3xl rounded-full" />

        <div className="flex flex-col gap-8">
          <Overview />

          <div className="flex flex-col gap-4">
            <h4 className="text-purple-900">Histórico da Bancada</h4>

            <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-md overflow-hidden shadow-sm">
              <Transaction
                customerName="Beatriz Morais"
                initials="BM"
                type="Atendimento: Pé e Mão"
                amount="R$ 75,00"
                date="Hoje, 14:00"
              />
              <Transaction
                customerName="Clara Silva"
                initials="CS"
                type="Atendimento: Alongamento em Gel"
                amount="R$ 120,00"
                date="Hoje, 11:30"
              />
              <Transaction
                customerName="Mariana Oliveira"
                initials="MO"
                type="Atendimento: Blindagem"
                amount="R$ 90,00"
                date="Ontem, 16:45"
              />
              <Transaction
                customerName="Adriana Costa"
                initials="AC"
                type="Atendimento: Esmaltação em Gel"
                amount="R$ 65,00"
                date="05 de Maio, 10:00"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}