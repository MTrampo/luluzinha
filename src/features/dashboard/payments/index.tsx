"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header/dashboard"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { cancelSubscriptionAction } from "@/actions/subscription"
import { SubscriptionFormatted } from "@/commons/models/subscription"
import { InvoiceFormatted } from "@/commons/models/payment"
import {
  FaCrown,
  FaCalendarAlt,
  FaCheck,
  FaInfoCircle,
  FaReceipt,
  FaLock,
  FaFileInvoiceDollar
} from "react-icons/fa"
import { getSubscriptionStatus } from "@/components/maps/status-map"

type PaymentsDashboardProps = {
  subscription: SubscriptionFormatted | null
  invoices: InvoiceFormatted[]
  isOwner: boolean
}

export default function PaymentsDashboard({ subscription, invoices: initialInvoices, isOwner }: PaymentsDashboardProps) {
  const router = useRouter()
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  // 1. Caso de Usuário Convidado (não-proprietário)
  if (!isOwner) {
    return (
      <>
        <Header title="Minha Assinatura" />
        <div className="main-content flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full border border-purple-100 bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-sm text-center space-y-5">
            <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <FaLock size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-purple-950">Acesso Restrito</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Ops! Essa área é reservada para a dona do estabelecimento. Apenas a proprietária pode gerenciar a assinatura e visualizar o histórico de faturas.
              </p>
            </div>
            <Button
              onClick={() => router.push("/painel/bancada")}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-md w-full transition-colors"
            >
              Voltar para a Bancada
            </Button>
          </div>
        </div>
      </>
    )
  }

  // 2. Fluxo de Cancelamento
  const handleCancelSubscription = async () => {
    setIsPending(true)
    try {
      const response = await cancelSubscriptionAction()
      if (response.status === 200) {
        toast.success("Assinatura cancelada com sucesso na sua bancada.")
        setIsCancelOpen(false)
        router.refresh()
      } else {
        toast.error(response.message || "Erro ao cancelar assinatura.")
      }
    } catch (err) {
      toast.error("Ocorreu um erro inesperado ao processar o cancelamento.")
    } finally {
      setIsPending(false)
    }
  }

  const subStatus = getSubscriptionStatus(subscription?.mpStatus)

  return (
    <>
      <Header title="Minha Assinatura" />
      <div className="main-content">
        <div className="w-full space-y-6">

          {/* Card da Assinatura Atual */}
          <div className="border border-purple-100 hover:border-purple-200 shadow-sm bg-white/90 backdrop-blur-sm p-6 rounded-lg transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-purple-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-purple-950">Assinatura Luluzinha</h3>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${subStatus.className}`}>
                    {subscription?.mpStatusFormatted || "Sem Assinatura"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Gerencie sua conta e histórico de pagamentos da bancada
                </p>
              </div>
            </div>

            {subscription ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">

                {/* Detalhes do Plano */}
                <div className="space-y-4">
                  <div className="bg-purple-50/50 p-4 rounded-md space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">Plano Ativo</span>
                    <p className="text-base font-bold text-purple-900 flex items-center gap-1.5">
                      <FaCrown className="text-purple-600" size={14} />
                      {subscription.planName || "Luluzinha Parceira"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50/50 p-4 rounded-md space-y-1">
                      <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">Valor</span>
                      <p className="text-sm font-semibold text-gray-900">{subscription.baseValueFormatted}</p>
                    </div>

                    <div className="bg-purple-50/50 p-4 rounded-md space-y-1">
                      <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">
                        {subscription.mpStatus === "cancelled" ? "Acesso até" : "Renovação"}
                      </span>
                      <p className="text-sm font-semibold text-gray-900">
                        {subscription.currentPeriodEndFormatted || "N/A"}
                      </p>
                    </div>
                  </div>

                  {subscription.mpPayerEmail && (
                    <div className="bg-purple-50/50 p-4 rounded-md space-y-1">
                      <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">E-mail de Cobrança</span>
                      <p className="text-xs font-semibold text-gray-700 truncate">{subscription.mpPayerEmail}</p>
                    </div>
                  )}
                </div>

                {/* Vantagens */}
                <div className="border border-purple-50 p-4 rounded-md flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-purple-950">Vantagens da sua Bancada Digital:</p>
                    <ul className="text-xs text-gray-600 space-y-2">
                      <li className="flex items-center gap-2">
                        <FaCheck className="text-purple-600 shrink-0" size={10} />
                        <span><strong>Procedimentos:</strong> até 6 serviços ativos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FaCheck className="text-purple-600 shrink-0" size={10} />
                        <span><strong>Agenda de Atendimentos:</strong> completa e ilimitada</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FaCheck className="text-purple-600 shrink-0" size={10} />
                        <span><strong>Histórico de Recebíveis:</strong> últimos 30 dias de registros</span>
                      </li>
                    </ul>
                  </div>

                  {subscription.mpStatus === "cancelled" && (
                    <div className="flex items-start gap-2 bg-rose-50 p-3 rounded border border-rose-100 mt-4 text-[11px] text-rose-800">
                      <FaInfoCircle className="shrink-0 mt-0.5" />
                      <span>
                        Sua assinatura está cancelada, mas você pode usar todas as vantagens acima até {subscription.currentPeriodEndFormatted}.
                      </span>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-col justify-end space-y-4">
                  {subscription.mpStatus === "authorized" ? (
                    <>
                      <div className="bg-purple-50/30 border border-purple-50 p-4 rounded-md text-xs text-gray-500 leading-relaxed">
                        Deseja parar ou mudar sua assinatura? Você pode cancelar a qualquer momento sem custos adicionais. Seu acesso continuará ativo até o fim do período vigente.
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => setIsCancelOpen(true)}
                        className="w-full rounded-md font-semibold"
                      >
                        Cancelar Assinatura
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-amber-50 border border-amber-100 p-4 rounded-md text-xs text-amber-800 leading-relaxed">
                        Sua assinatura não está ativa no momento. Para reativar seu plano e liberar todas as vantagens para sua bancada digital, assine novamente.
                      </div>
                      <Button
                        onClick={() => window.location.href = "/assinatura"}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors"
                      >
                        Assinar Agora
                      </Button>
                    </>
                  )}
                </div>

              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-md border border-amber-100 max-w-xl mx-auto text-left">
                  <FaInfoCircle className="text-amber-600 mt-0.5 shrink-0" size={18} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-900">Bancada sem Assinatura Ativa</h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Preparamos cada detalhe com muito carinho para que seu dia a dia seja leve e profissional. Assine o plano para liberar todos os recursos da Luluzinha!
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.location.href = "/assinatura"}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-8 font-semibold transition-colors"
                >
                  Tornar-me uma Luluzinha
                </Button>
              </div>
            )}
          </div>

          {/* Histórico de Faturas */}
          <div className="border border-purple-100 hover:border-purple-200 shadow-sm bg-white/90 backdrop-blur-sm p-6 rounded-lg transition-all duration-300">
            <h3 className="text-lg font-bold text-purple-950 pb-3 border-b border-purple-50 flex items-center gap-2">
              <FaReceipt className="text-purple-600" size={16} />
              Histórico de Recebíveis (Cobranças)
            </h3>

            {initialInvoices.length > 0 ? (
              <div className="divide-y divide-purple-100/50 pt-2">
                {initialInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                        <FaFileInvoiceDollar size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          Fatura {invoice.mpInvoiceId ? `#${invoice.mpInvoiceId}` : 'Recorrente'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          Pago em: {invoice.paidAtFormatted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                      <span className="text-sm font-black text-purple-950 tabular-nums">
                        {invoice.amountFormatted}
                      </span>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${invoice.statusClassName}`}>
                        {invoice.statusFormatted}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-400">
                  <FaFileInvoiceDollar size={20} />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Ainda não temos registros de cobrança na sua bancada. Conforme suas mensalidades forem processadas, o histórico de faturas aparecerá aqui com todo o carinho!
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Confirmação de Cancelamento */}
      {subscription && (
        <ConfirmDialog
          open={isCancelOpen}
          onOpenChange={setIsCancelOpen}
          title="Ah, que pena que você quer nos deixar... 🥺"
          confirmText="Sim, quero cancelar"
          cancelText="Continuar brilhando na bancada"
          isPending={isPending}
          onConfirm={handleCancelSubscription}
          description={
            <div className="space-y-4 text-left text-gray-600 text-sm leading-relaxed mt-2">
              <p>
                Ao cancelar sua assinatura, você perderá acesso às vantagens exclusivas da <strong>Luluzinha Parceira</strong> ao fim do período atual, como:
              </p>
              <ul className="space-y-1.5 pl-2 border-l-2 border-purple-200 text-xs">
                <li>• Cadastro de mais de 6 procedimentos</li>
                <li>• Acesso ilimitado e completo à Agenda de Atendimentos</li>
                <li>• Histórico completo de faturamento de 30 dias</li>
              </ul>
              <p className="font-semibold text-purple-900 mt-2 bg-purple-50 p-2.5 rounded border border-purple-100 text-xs">
                Seu acesso continuará ativo normalmente até o dia <strong>{subscription.currentPeriodEndFormatted}</strong>.
              </p>
            </div>
          }
        />
      )}
    </>
  )
}
