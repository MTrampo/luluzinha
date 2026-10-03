"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header/dashboard"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cancelSubscriptionAction } from "@/actions/subscription"
import { SubscriptionFormatted } from "@/commons/models/subscription"
import { InvoiceFormatted } from "@/commons/models/payment"
import {
  FaCrown,
  FaClock,
  FaShieldHalved,
  FaHeart,
  FaWhatsapp,
  FaReceipt,
  FaCircleQuestion,
  FaCircleInfo,
  FaArrowsRotate,
  FaBan,
  FaLock,
  FaCalendarCheck,
} from "react-icons/fa6"
import { getSubscriptionStatus } from "@/components/maps/status-map"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { whatsappNumber } from "@/commons/constants/support"

type PaymentsDashboardProps = {
  subscription: SubscriptionFormatted | null
  invoices: InvoiceFormatted[]
  isOwner: boolean
}

const CANCELLATION_REASONS = [
  { value: "pouco_uso", label: "Não estou usando o sistema tanto quanto esperava" },
  { value: "preco", label: "Achei o valor mensal elevado para o meu momento" },
  { value: "recurso", label: "Senti falta de alguma funcionalidade no sistema" },
  { value: "pausa", label: "Vou dar uma pausa nos atendimentos do meu espaço" },
  { value: "outro", label: "Outro motivo (explique para podermos melhorar)" },
]

export default function PaymentsDashboard({ subscription, invoices: initialInvoices, isOwner }: PaymentsDashboardProps) {
  const router = useRouter()
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState<string>("")
  const [customReasonDetails, setCustomReasonDetails] = useState<string>("")
  const [isPending, setIsPending] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceFormatted | null>(null)

  // 1. Caso de Usuário Convidado (não-proprietário)
  if (!isOwner) {
    return (
      <>
        <Header title="Minha Assinatura" />
        <div className="main-content flex items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full border border-purple-100 bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-sm text-center space-y-5">
            <div className="mx-auto w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
              <FaLock size={26} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-purple-950 font-lexend">Acesso Restrito</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Essa área é reservada para a dona do estabelecimento. Apenas a proprietária pode gerenciar a assinatura e visualizar o histórico financeiro do espaço.
              </p>
            </div>
            <Button
              onClick={() => router.push("/painel/bancada")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl w-full transition-colors h-11"
            >
              Voltar para o Meu Espaço
            </Button>
          </div>
        </div>
      </>
    )
  }

  // 2. Cálculos do Ciclo Atual de Assinatura
  const cycleMetrics = useMemo(() => {
    if (!subscription?.currentPeriodEnd) return null

    const now = Date.now()
    const endDate = new Date(subscription.currentPeriodEnd).getTime()
    if (isNaN(endDate)) return null

    const startDate = subscription.currentPeriodStart 
      ? new Date(subscription.currentPeriodStart).getTime()
      : endDate - 30 * 24 * 60 * 60 * 1000

    const totalDuration = Math.max(endDate - startDate, 1)
    const elapsed = Math.max(0, now - startDate)
    const percentage = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)))
    const msRemaining = endDate - now
    const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)))
    const isWithinGraceOrFuture = endDate + 3 * 24 * 60 * 60 * 1000 > now

    return {
      percentage,
      daysRemaining,
      isWithinGraceOrFuture,
      isExpired: !isWithinGraceOrFuture
    }
  }, [subscription])

  // 3. Fluxo de Cancelamento com Pesquisa de Motivo
  const handleCancelSubscription = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!cancelReason) {
      toast.error("Por favor, escolha um motivo para o cancelamento.")
      return
    }

    if (cancelReason === "outro" && !customReasonDetails.trim()) {
      toast.error("Por favor, conte para nós o motivo do cancelamento para que possamos melhorar.")
      return
    }

    const selectedReasonObj = CANCELLATION_REASONS.find(r => r.value === cancelReason)
    const reasonLabel = selectedReasonObj?.label || cancelReason

    setIsPending(true)
    try {
      const response = await cancelSubscriptionAction(reasonLabel, customReasonDetails.trim())
      if (response.status === 200) {
        toast.success("Assinatura cancelada com sucesso no seu espaço.")
        setIsCancelOpen(false)
        setCancelReason("")
        setCustomReasonDetails("")
        router.refresh()
      } else {
        toast.error(response.message || "Erro ao cancelar assinatura.")
      }
    } catch {
      toast.error("Ocorreu um erro inesperado ao processar o cancelamento.")
    } finally {
      setIsPending(false)
    }
  }

  const subStatus = getSubscriptionStatus(subscription?.mpStatus)
  const isCancelledActive = subscription?.mpStatus === "cancelled" && cycleMetrics?.isWithinGraceOrFuture
  const isAuthorized = subscription?.mpStatus === "authorized"

  const supportWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Olá! Gostaria de tirar uma dúvida sobre a minha assinatura e pagamentos da Luluzinha..."
  )}`

  return (
    <>
      <Header title="Minha Assinatura" />

      <div className="main-content space-y-6">

        {/* 1. HERO CARD DA ASSINATURA */}
        <div className="bg-white border border-purple-100 hover:border-purple-200 shadow-sm rounded-2xl p-5 sm:p-7 transition-all duration-300">
          
          {/* Cabeçalho do Card Principal */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-purple-50">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <FaCrown className="w-3.5 h-3.5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend tracking-tight">
                  {subscription?.planName || "Luluzinha Parceira"}
                </h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                  isCancelledActive
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : subStatus.className
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isCancelledActive ? "bg-amber-500 animate-pulse" : isAuthorized ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                  {isCancelledActive ? "Cancelada (Acesso Ativo)" : subscription?.mpStatusFormatted || "Sem Assinatura"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Seu espaço digital completo para organizar sua agenda e valorizar seu trabalho
              </p>
            </div>

            {subscription && (
              <div className="text-left sm:text-right shrink-0 bg-purple-50/60 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-800 block">Valor do Plano</span>
                <div className="text-2xl sm:text-3xl font-bold text-purple-950 tabular-nums font-lexend">
                  {subscription.baseValueFormatted}
                  <span className="text-xs font-normal text-gray-500 font-sans ml-1">/mês</span>
                </div>
              </div>
            )}
          </div>

          {/* Conteúdo Dinâmico do Card */}
          {subscription ? (
            <div className="pt-6 space-y-6">

              {/* Linha de Ciclo & Progresso Visual */}
              {cycleMetrics && (
                <div className="bg-purple-50/40 border border-purple-100/70 rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-purple-950 font-semibold">
                      <FaClock className="text-purple-600 shrink-0 w-3.5 h-3.5" />
                      <span>
                        {isCancelledActive
                          ? `Acesso liberado até ${subscription.currentPeriodEndFormatted}`
                          : `Próxima renovação em ${subscription.currentPeriodEndFormatted}`}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-purple-800 bg-white px-2.5 py-1 rounded-full border border-purple-100 shadow-2xs">
                      {cycleMetrics.daysRemaining > 0 
                        ? `${cycleMetrics.daysRemaining} dias restantes no ciclo`
                        : "Último dia do ciclo"}
                    </span>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full bg-purple-200/50 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCancelledActive 
                          ? "bg-linear-to-r from-amber-400 to-amber-500" 
                          : "bg-linear-to-r from-purple-500 to-indigo-600"
                      }`}
                      style={{ width: `${cycleMetrics.percentage}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-gray-500">
                    {isCancelledActive
                      ? "Sua assinatura não será renovada automaticamente. Você pode reativar quando desejar para manter seu espaço sem interrupções."
                      : "Sua renovação ocorre de forma automática e segura mensalmente pelo Mercado Pago. Cancele quando quiser sem multas."}
                  </p>
                </div>
              )}

              {/* Grid de Benefícios e Detalhes da Cobrança */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-purple-100/70 bg-purple-50/20 p-4 sm:p-5 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                    Vantagens Desbloqueadas no seu Espaço
                  </h3>
                  <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                      <span><strong>Menu de Procedimentos:</strong> até 6 serviços ativos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                      <span><strong>Agenda de Atendimentos:</strong> completa e ilimitada</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                      <span><strong>Histórico de Recebíveis:</strong> últimos 30 dias de registros</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                      <span><strong>Divulgação em 1 Toque:</strong> artes para Stories & Status</span>
                    </li>
                  </ul>
                </div>

                {/* Informações da Cobrança & E-mail */}
                <div className="border border-purple-100/70 bg-purple-50/20 p-4 sm:p-5 rounded-xl flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">E-mail da Cobrança</span>
                    <p className="text-xs sm:text-sm font-semibold text-purple-950 truncate">
                      {subscription.mpPayerEmail || "E-mail da sua conta"}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Os recibos e comprovantes de pagamento são enviados pelo Mercado Pago para este endereço a cada ciclo.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-purple-100/50 text-[11px] text-purple-900/80 font-medium">
                    <FaShieldHalved className="text-purple-600 shrink-0 w-3.5 h-3.5" />
                    <span>Cobrança processada com segurança pelo Mercado Pago</span>
                  </div>
                </div>
              </div>

              {/* Bloco de Ações e Avisos de Cancelamento */}
              <div className="pt-2">
                {isAuthorized ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-purple-50/30 border border-purple-100/60">
                    <div className="text-xs text-gray-600 leading-relaxed">
                      Precisa pausar ou cancelar? Você tem total liberdade a qualquer momento. Seu acesso continuará liberado até o fim do ciclo vigente.
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsCancelOpen(true)}
                      className="w-full sm:w-auto text-xs font-bold text-rose-700 border-rose-200 hover:bg-rose-50 hover:text-rose-800 rounded-xl cursor-pointer shrink-0 h-10 px-5 gap-1.5"
                    >
                      <FaBan className="w-3.5 h-3.5" />
                      Cancelar Assinatura
                    </Button>
                  </div>
                ) : isCancelledActive ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <strong className="block text-sm font-bold text-amber-950 mb-0.5">Sua assinatura está cancelada, mas seu acesso total está garantido!</strong>
                      Aproveite todas as ferramentas até <strong>{subscription.currentPeriodEndFormatted}</strong>. Para continuar utilizando sem perder seus dados, reative quando desejar.
                    </div>
                    <Button
                      onClick={() => window.location.href = "/assinatura"}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs shrink-0 h-10 px-6 cursor-pointer gap-1.5"
                    >
                      <FaArrowsRotate className="w-3.5 h-3.5" />
                      Reativar Assinatura
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <strong className="block text-sm font-bold text-amber-950 mb-0.5">Ciclo encerrado</strong>
                      Seu período de assinatura terminou. Reative para liberar imediatamente todos os recursos do seu espaço digital.
                    </div>
                    <Button
                      onClick={() => window.location.href = "/assinatura"}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs shrink-0 h-10 px-6 cursor-pointer"
                    >
                      Assinar Agora
                    </Button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Estado Sem Assinatura */
            <div className="py-8 text-center space-y-4">
              <div className="bg-purple-50/70 p-5 rounded-xl border border-purple-100 max-w-xl mx-auto text-left space-y-1">
                <h4 className="text-sm font-bold text-purple-950 font-lexend flex items-center gap-2">
                  <FaCircleInfo className="text-purple-600 shrink-0" />
                  Seu Espaço Digital está Pronto para Você
                </h4>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  Preparamos cada detalhe com muito carinho para que seu dia a dia seja mais leve, organizado e profissional. Assine o plano para liberar todos os recursos da Luluzinha!
                </p>
              </div>
              <Button
                onClick={() => window.location.href = "/assinatura"}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl px-8 h-11 text-sm shadow-sm cursor-pointer"
              >
                Tornar-me uma Luluzinha
              </Button>
            </div>
          )}
        </div>

        {/* 2. PILARES DE CONFIANÇA & SUPORTE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-purple-100/80 rounded-xl p-4 sm:p-5 flex items-start gap-3 shadow-2xs">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0 mt-0.5">
              <FaShieldHalved className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-purple-950 font-lexend">Pagamento Seguro</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Processado com criptografia bancária pelo Mercado Pago.
              </p>
            </div>
          </div>

          <div className="bg-white border border-purple-100/80 rounded-xl p-4 sm:p-5 flex items-start gap-3 shadow-2xs">
            <div className="p-2 rounded-lg bg-pink-50 text-pink-600 shrink-0 mt-0.5">
              <FaHeart className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-purple-950 font-lexend">Sem Fidelidade</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cancele ou mude de plano a qualquer momento sem taxas.
              </p>
            </div>
          </div>

          <div className="bg-white border border-purple-100/80 rounded-xl p-4 sm:p-5 flex items-start gap-3 shadow-2xs">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
              <FaWhatsapp className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-purple-950 font-lexend">Suporte Dedicado</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Dúvidas sobre sua assinatura? Conte com a gente no WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* 3. HISTÓRICO DE FATURAS */}
        <div className="bg-white border border-purple-100 hover:border-purple-200 shadow-sm rounded-2xl p-5 sm:p-7 space-y-4 transition-all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-purple-50">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-bold text-purple-950 font-lexend flex items-center gap-2">
                <FaReceipt className="text-purple-600 w-4 h-4" />
                Histórico de Faturas
              </h3>
              <p className="text-xs text-gray-500">
                Acompanhe seus recibos e o status de cada cobrança processada
              </p>
            </div>
            <span className="text-xs font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              {initialInvoices.length} {initialInvoices.length === 1 ? "fatura" : "faturas"}
            </span>
          </div>

          {initialInvoices.length > 0 ? (
            <div className="divide-y divide-purple-50">
              {initialInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 gap-2 hover:bg-purple-50/40 px-3 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 transition-colors">
                      <FaReceipt className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-purple-950 truncate group-hover:text-purple-700 transition-colors">
                        Fatura {invoice.mpInvoiceId ? `#${invoice.mpInvoiceId}` : "Recorrente"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Processada em: {invoice.paidAtFormatted}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                    <span className="text-sm sm:text-base font-bold text-purple-950 tabular-nums">
                      {invoice.amountFormatted}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${invoice.statusClassName}`}>
                      {invoice.statusFormatted}
                    </span>
                    <span className="text-xs text-purple-600 font-semibold hidden sm:inline group-hover:translate-x-0.5 transition-transform">
                      Ver detalhes &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center max-w-md mx-auto space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto text-purple-400">
                <FaReceipt className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ainda não há faturas geradas no seu espaço. Conforme suas mensalidades forem processadas, seu histórico completo aparecerá aqui.
              </p>
            </div>
          )}
        </div>

        {/* 4. DÚVIDAS FREQUENTES */}
        <div className="bg-white border border-purple-100 hover:border-purple-200 shadow-sm rounded-2xl p-5 sm:p-7 space-y-4 transition-all">
          <div className="space-y-0.5 pb-3 border-b border-purple-50">
            <h3 className="text-base sm:text-lg font-bold text-purple-950 font-lexend flex items-center gap-2">
              <FaCircleQuestion className="text-purple-600 w-4 h-4" />
              Dúvidas Frequentes sobre Pagamentos
            </h3>
            <p className="text-xs text-gray-500">
              Tudo o que você precisa saber com máxima transparência
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="faq-1" className="border border-purple-100/70 bg-purple-50/20 rounded-xl px-4 py-1">
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-purple-950 hover:text-purple-700 hover:no-underline font-lexend text-left">
                Como funciona a cobrança da assinatura?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1 font-medium">
                A assinatura é mensal e renovada automaticamente no cartão de crédito cadastrado na data de vencimento do seu ciclo. Todas as transações são processadas com total segurança pelo Mercado Pago.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border border-purple-100/70 bg-purple-50/20 rounded-xl px-4 py-1">
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-purple-950 hover:text-purple-700 hover:no-underline font-lexend text-left">
                Se eu cancelar, perco o acesso ao meu espaço na hora?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1 font-medium">
                Não! Você tem direito a utilizar 100% dos recursos do seu espaço digital até o último dia do período que já foi pago. Nenhuma nova cobrança será realizada após o cancelamento.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border border-purple-100/70 bg-purple-50/20 rounded-xl px-4 py-1">
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-purple-950 hover:text-purple-700 hover:no-underline font-lexend text-left">
                Posso reativar minha assinatura após cancelar?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1 font-medium">
                Sim, com certeza! Se você mudar de ideia, basta clicar em &quot;Reativar Assinatura&quot; nesta mesma tela e todos os seus dados e agendamentos continuarão guardados com todo o carinho.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border border-purple-100/70 bg-purple-50/20 rounded-xl px-4 py-1">
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-purple-950 hover:text-purple-700 hover:no-underline font-lexend text-left">
                Onde recebo os comprovantes de pagamento?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1 font-medium">
                Assim que o pagamento é aprovado, um comprovante oficial é enviado automaticamente pelo Mercado Pago para o e-mail cadastrado na sua assinatura. Além disso, você pode consultar o histórico de faturas aqui no painel.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Chamada para Suporte via WhatsApp */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <div className="text-xs text-purple-900 font-medium text-center sm:text-left">
              Ainda tem alguma dúvida financeira ou precisa de ajuda com uma cobrança?
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto text-xs font-bold border-purple-200 text-purple-800 hover:bg-white rounded-xl shadow-2xs h-9 px-4 shrink-0"
            >
              <a href={supportWhatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <FaWhatsapp className="text-emerald-500 w-4 h-4" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>

      </div>

      {/* 5. MODAL DE DETALHES DA FATURA */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
          <DialogContent className="max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-xl">
            <DialogHeader className="text-left space-y-1">
              <DialogTitle className="text-lg font-bold text-purple-950 font-lexend flex items-center gap-2">
                <FaReceipt className="text-purple-600 w-4 h-4" />
                Detalhes da Fatura
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Informações da cobrança processada no Mercado Pago
              </DialogDescription>
            </DialogHeader>

            <div className="divide-y divide-purple-100/60 bg-purple-50/30 rounded-2xl border border-purple-100/70 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2.5">
                <span className="text-gray-500 font-medium">Status</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${selectedInvoice.statusClassName}`}>
                  {selectedInvoice.statusFormatted}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-gray-500 font-medium">Valor Total</span>
                <span className="font-black text-purple-950 text-sm">{selectedInvoice.amountFormatted}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-gray-500 font-medium">Data do Pagamento</span>
                <span className="font-bold text-gray-800">{selectedInvoice.paidAtFormatted}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-gray-500 font-medium">ID da Fatura MP</span>
                <span className="font-mono text-[11px] font-bold text-gray-700">{selectedInvoice.mpInvoiceId || "N/A"}</span>
              </div>
              {selectedInvoice.mpPayerEmail && (
                <div className="flex justify-between items-center pt-2.5">
                  <span className="text-gray-500 font-medium">E-mail do Pagador</span>
                  <span className="font-semibold text-gray-800 truncate max-w-45">{selectedInvoice.mpPayerEmail}</span>
                </div>
              )}
            </div>

            <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 text-[11px] text-gray-600 leading-relaxed flex items-start gap-2">
              <FaCircleInfo className="text-purple-600 shrink-0 mt-0.5" />
              <span>
                O recibo desta cobrança foi enviado para seu e-mail pelo Mercado Pago. Se precisar de uma segunda via ou esclarecimento, conte com o nosso suporte.
              </span>
            </div>

            <DialogFooter className="pt-2">
              <Button
                onClick={() => setSelectedInvoice(null)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl h-10 text-xs cursor-pointer"
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 6. MODAL DE CANCELAMENTO COM PESQUISA ACOLHEDORA */}
      {subscription && (
        <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <DialogContent className="sm:max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-lg font-black text-purple-950 font-lexend flex items-center gap-2">
                <span>Ah, que pena que você quer nos deixar... 🥺</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 leading-relaxed font-medium">
                Estamos constantemente trabalhando para melhorar a experiência do seu espaço. Você poderia nos contar o motivo do cancelamento? Seu feedback é fundamental para podermos evoluir!
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCancelSubscription} className="space-y-4 my-2">
              <Field>
                <FieldLabel htmlFor="cancel-reason" className="text-xs font-bold text-purple-950">
                  Motivo do Cancelamento
                </FieldLabel>
                <Select value={cancelReason} onValueChange={setCancelReason}>
                  <SelectTrigger id="cancel-reason" className="w-full text-xs font-medium border-purple-100 focus:border-purple-300 rounded-xl h-11">
                    <SelectValue placeholder="Selecione o motivo..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {CANCELLATION_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value} className="text-xs py-2">
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {cancelReason === "outro" && (
                <Field>
                  <FieldLabel htmlFor="custom-reason" className="text-xs font-bold text-purple-950">
                    Conte para nós o que podemos fazer para melhorar
                  </FieldLabel>
                  <Textarea
                    id="custom-reason"
                    placeholder="Escreva aqui sua sugestão ou motivo com carinho..."
                    value={customReasonDetails}
                    onChange={(e) => setCustomReasonDetails(e.target.value)}
                    className="text-xs border-purple-100 focus:border-purple-300 min-h-20 rounded-xl"
                  />
                </Field>
              )}

              <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 text-xs text-purple-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <FaCalendarCheck className="text-purple-600" />
                  Informações sobre o seu cancelamento:
                </p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Ao cancelar, seu acesso continuará ativo normalmente até <strong>{subscription.currentPeriodEndFormatted}</strong>. Nenhuma nova cobrança será realizada no seu cartão.
                </p>
              </div>

              <DialogFooter className="gap-2 sm:gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCancelOpen(false)}
                  disabled={isPending}
                  className="w-full sm:w-auto text-xs font-bold border-purple-200 text-purple-900 hover:bg-purple-50 rounded-xl h-10 cursor-pointer"
                >
                  Continuar no Meu Espaço
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isPending}
                  className="w-full sm:w-auto text-xs font-bold rounded-xl h-10 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Spinner className="mr-2 h-3.5 w-3.5" />
                      Cancelando...
                    </>
                  ) : (
                    "Confirmar Cancelamento"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
