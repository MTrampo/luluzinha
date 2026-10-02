import { APP_URL } from "@/commons/constants/env"
import { renderBaseEmailLayout } from "./base-layout"

export interface CancellationEmailData {
  recipientName?: string
  planName?: string
  accessUntil?: string
}

export function renderCancellationHtml(data: CancellationEmailData): { subject: string; html: string } {
  const subject = "🌸 Confirmação de cancelamento da sua assinatura (As portas continuam abertas!)"

  const contentHtml = `
    <p style="margin: 0 0 14px 0;">
      Confirmamos o cancelamento da sua assinatura <strong>${data.planName || "Luluzinha Parceira"}</strong>, conforme solicitado.
    </p>
    <p style="margin: 0 0 14px 0;">
      Sentiremos muito a sua falta no dia a dia do nosso aplicativo! Agradecemos de coração por todo o tempo que compartilhamos juntinhas e por ter nos permitido fazer parte da sua trajetória profissional.
    </p>
    <p style="margin: 0;">
      Lembrando que não há nenhuma multa ou taxa de cancelamento.
    </p>
  `

  const highlightCardHtml = `
    <div style="font-size: 13px; color: #581c87; font-weight: 800; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
      📅 Informações sobre o seu espaço:
    </div>
    <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">
      ${data.accessUntil ? `
        Seu acesso completo às ferramentas continuará liberado até o dia <strong style="color: #7e22ce;">${data.accessUntil}</strong>.
      ` : "Nenhuma nova cobrança automática será realizada no seu cartão."}
      <br/><br/>
      Seus dados de clientes e procedimentos ficarão guardados com todo o carinho caso você queira retornar no futuro!
    </div>
  `

  const html = renderBaseEmailLayout({
    title: "Cancelamento Confirmado",
    previewText: "Sua assinatura foi cancelada. Sentiremos sua falta e as portas estarão sempre abertas para o seu retorno!",
    badgeText: "Cancelamento • Portas Abertas",
    bannerSvgPath: "/email/feeling-blue.svg",
    bannerSvgAlt: "Sentiremos sua falta - Luluzinha",
    name: data.recipientName,
    contentHtml,
    highlightCardHtml,
    buttonText: "Acessar Meu Espaço",
    buttonUrl: `${APP_URL}/painel`,
    footerNote: "Se você precisar de qualquer suporte ou quiser compartilhar sugestões para melhorarmos, estaremos sempre à disposição!",
  })

  return { subject, html }
}
