import { APP_URL } from "@/commons/constants/env"
import { renderBaseEmailLayout } from "./base-layout"

export interface WelcomeEmailData {
  recipientName?: string
  planName?: string
  isTrial?: boolean
  trialDays?: number
  currentPeriodEnd?: string
}

export function renderWelcomeSubscriptionHtml(data: WelcomeEmailData): { subject: string; html: string } {
  const isTrial = data.isTrial ?? true
  const trialDays = data.trialDays ?? 7
  const subject = "🎉 Bem-vinda à Luluzinha! Seu espaço digital está pronto para brilhar"

  const contentHtml = `
    <p style="margin: 0 0 14px 0; font-size: 15px; color: #3b0764; font-weight: 600;">
      Estamos transbordando de alegria em ter você com a gente! 💖
    </p>
    <p style="margin: 0 0 14px 0;">
      Queremos te agradecer de todo o coração por nos escolher como o braço direito do seu negócio. Preparamos cada cantinho deste sistema com muito carinho e dedicação para que o seu dia a dia seja muito mais leve, organizado e profissional.
    </p>
    <p style="margin: 0;">
      Sua assinatura foi <strong>confirmada com sucesso</strong>! ${isTrial 
        ? `Você ganhou <strong>${trialDays} dias de degustação gratuita</strong> para explorar tudo sem nenhum compromisso.`
        : `Todos os recursos já estão 100% liberados para você dominar sua agenda e encantar suas clientes!`
      }
    </p>
  `

  const highlightCardHtml = `
    <div style="font-size: 13px; color: #581c87; font-weight: 800; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
      ✨ O que já está liberado no seu espaço:
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #4b5563; line-height: 1.6;">
      <tr>
        <td style="padding: 4px 0; vertical-align: top; width: 22px;">💅</td>
        <td style="padding: 4px 0;"><strong>Menu de Procedimentos:</strong> cadastre seus serviços com tempo e valores personalizados.</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; vertical-align: top; width: 22px;">📅</td>
        <td style="padding: 4px 0;"><strong>Agenda de Atendimentos:</strong> organize seus horários com praticidade e nunca mais tenha conflitos.</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; vertical-align: top; width: 22px;">💰</td>
        <td style="padding: 4px 0;"><strong>Seu Caixa:</strong> registre seus recebíveis e acompanhe seu faturamento direto na palma da mão.</td>
      </tr>
    </table>
    ${data.currentPeriodEnd ? `
      <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #e9d5ff; font-size: 12px; color: #6b7280;">
        ${isTrial ? "Primeira cobrança apenas no 8º dia:" : "Vigência do ciclo atual até:"} <strong style="color: #7e22ce;">${data.currentPeriodEnd}</strong>
      </div>
    ` : ""}
  `

  const html = renderBaseEmailLayout({
    title: "Bem-vinda ao Seu Espaço Digital!",
    previewText: "Sua assinatura foi confirmada com sucesso! Estamos muito felizes em poder contribuir com o seu dia a dia.",
    badgeText: "Boas-vindas • Assinatura Confirmada",
    bannerSvgPath: "/email/happy-luluzinha.svg",
    bannerSvgAlt: "Manicure Luluzinha comemorando",
    name: data.recipientName,
    contentHtml,
    highlightCardHtml,
    buttonText: "Acessar Meu Espaço Agora ✨",
    buttonUrl: `${APP_URL}/painel`,
    footerNote: "Você tem total liberdade: cancele ou gerencie seu plano a qualquer momento pelo painel, sem taxas escondidas ou multas.",
  })

  return { subject, html }
}
