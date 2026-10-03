import { APP_URL } from "@/commons/constants/env"
import { renderBaseEmailLayout } from "./base-layout"

export interface RenewalSuccessEmailData {
  recipientName?: string
  planName?: string
  amountFormatted?: string
  nextPaymentDate?: string
}

export function renderRenewalSuccessHtml(data: RenewalSuccessEmailData): { subject: string; html: string } {
  const subject = "✨ Tudo certo! Sua assinatura Luluzinha foi renovada com sucesso"

  const contentHtml = `
    <p style="margin: 0 0 14px 0;">
      Passando para avisar que a renovação da assinatura do seu espaço digital foi <strong>processada e confirmada com sucesso</strong>!
    </p>
    <p style="margin: 0;">
      Seu acesso a todas as ferramentas segue 100% ativo para você continuar focando no que faz de melhor: encantar suas <strong>Poderosas</strong> e fazer o seu trabalho brilhar cada vez mais.
    </p>
  `

  const highlightCardHtml = `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #4b5563;">
      <tr>
        <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Plano Ativo:</td>
        <td align="right" style="font-weight: 800; color: #581c87;">${data.planName || "Luluzinha Parceira"}</td>
      </tr>
      ${data.amountFormatted ? `
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Valor da Mensalidade:</td>
          <td align="right" style="font-weight: 800; color: #15803d; font-size: 14px;">${data.amountFormatted}</td>
        </tr>
      ` : ""}
      ${data.nextPaymentDate ? `
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Próxima Renovação:</td>
          <td align="right" style="font-weight: 700; color: #7e22ce;">${data.nextPaymentDate}</td>
        </tr>
      ` : ""}
      <tr>
        <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Status do Pagamento:</td>
        <td align="right" style="font-weight: 800; color: #16a34a;">Pago e Confirmado ✅</td>
      </tr>
    </table>
  `

  const html = renderBaseEmailLayout({
    title: "Assinatura Renovada com Sucesso!",
    previewText: "Seu pagamento foi confirmado com sucesso. Seu espaço continua ativo e pronto para seus atendimentos.",
    badgeText: "Renovação • Pagamento Confirmado",
    bannerSvgPath: "/email/printing-invoice.svg",
    bannerSvgAlt: "Fatura de pagamento confirmada",
    name: data.recipientName,
    contentHtml,
    highlightCardHtml,
    buttonText: "Ver Minhas Faturas no Painel",
    buttonUrl: `${APP_URL}/painel/pagamentos`,
    footerNote: "O comprovante detalhado e todo o histórico de recebíveis estão sempre disponíveis na aba de pagamentos do seu espaço.",
  })

  return { subject, html }
}
