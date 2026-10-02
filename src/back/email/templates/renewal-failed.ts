import { APP_URL } from "@/commons/constants/env"
import { renderBaseEmailLayout } from "./base-layout"

export interface RenewalFailedEmailData {
  recipientName?: string
  planName?: string
  amountFormatted?: string
  reason?: string
}

export function renderRenewalFailedHtml(data: RenewalFailedEmailData): { subject: string; html: string } {
  const subject = "⚠️ Tivemos um probleminha com a renovação do seu espaço (Vamos resolver juntinhas?)"

  const contentHtml = `
    <p style="margin: 0 0 14px 0;">
      Tentamos processar a renovação da sua assinatura <strong>Luluzinha</strong>, mas a operadora do seu cartão não autorizou a cobrança ${data.amountFormatted ? `no valor de <strong>${data.amountFormatted}</strong>` : ""}.
    </p>
    <p style="margin: 0 0 14px 0;">
      Fique tranquila: isso é super comum e costuma acontecer por motivos simples (como limite momentâneo, troca de cartão ou bloqueio preventivo de segurança do banco).
    </p>
    <p style="margin: 0;">
      Para que a sua rotina continue sem nenhuma pausa e você não perca o ritmo dos agendamentos das suas <strong>Poderosas</strong>, basta atualizar ou trocar o cartão cadastrado direto pelo seu painel.
    </p>
  `

  const highlightCardHtml = `
    <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 14px; margin-bottom: 4px;">
      <div style="color: #9f1239; font-weight: 800; font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
        <span>⚠️ Ação Recomendada:</span>
      </div>
      <div style="color: #be123c; font-size: 13px; line-height: 1.5;">
        Atualize os dados do seu cartão no painel para manter o acesso contínuo aos seus procedimentos cadastrados e à sua agenda.
      </div>
    </div>
  `

  const html = renderBaseEmailLayout({
    title: "Atenção: Renovação Pendente",
    previewText: "Tivemos um imprevisto para processar sua mensalidade. Atualize seu cartão para continuar atendendo!",
    badgeText: "Aviso de Cobrança • Ação Necessária",
    bannerSvgPath: "/email/empty-wallet.svg",
    bannerSvgAlt: "Carteira indicando pagamento pendente",
    name: data.recipientName,
    contentHtml,
    highlightCardHtml,
    buttonText: "Atualizar Meu Cartão no Painel",
    buttonUrl: `${APP_URL}/painel/pagamentos`,
    footerNote: "Se você já ajustou seu cartão ou acredita que foi um engano do banco, acesse a aba de pagamentos para sincronizar seu status.",
  })

  return { subject, html }
}
