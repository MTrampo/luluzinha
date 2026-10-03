import { APP_URL } from "@/commons/constants/env"

export interface BaseEmailLayoutOptions {
  title: string
  previewText: string
  badgeText?: string
  bannerSvgPath?: string
  bannerSvgAlt?: string
  name?: string
  contentHtml: string
  highlightCardHtml?: string
  buttonText?: string
  buttonUrl?: string
  footerNote?: string
}

export function renderBaseEmailLayout(options: BaseEmailLayoutOptions): string {
  const {
    title,
    previewText,
    badgeText = "💅 Luluzinha • Seu Espaço Digital",
    bannerSvgPath,
    bannerSvgAlt = "Ilustração Luluzinha",
    name = "Poderosa",
    contentHtml,
    highlightCardHtml,
    buttonText,
    buttonUrl = `${APP_URL}/painel`,
    footerNote,
  } = options

  const fullBannerUrl = bannerSvgPath
    ? bannerSvgPath.startsWith("http")
      ? bannerSvgPath
      : `${APP_URL}${bannerSvgPath.startsWith("/") ? "" : "/"}${bannerSvgPath}`
    : null

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #fcfaff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    a:hover { opacity: 0.92; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fcfaff; color: #3b0764;">
  <!-- Preview Text Oculto -->
  <div style="display: none; font-size: 1px; color: #fcfaff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${previewText}
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fcfaff; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Container Principal do Email -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #f3e8ff; box-shadow: 0 10px 25px -5px rgba(88, 28, 135, 0.05), 0 8px 10px -6px rgba(88, 28, 135, 0.03);">
          
          <!-- Sessão 1: Banner / Ilustração com Fundo Branco 100% Full-Width -->
          ${fullBannerUrl ? `
            <tr>
              <td align="center" style="background-color: #ffffff; padding: 32px 24px 16px 24px; border-bottom: 1px solid #faf5ff;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="background-color: #ffffff;">
                      <img 
                        src="${fullBannerUrl}" 
                        alt="${bannerSvgAlt}" 
                        width="100%" 
                        style="display: block; width: 100%; max-width: 320px; height: auto; max-height: 200px; object-fit: contain; margin: 0 auto;" 
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          ` : ""}

          <!-- Sessão 2: Header com Gradiente e Identidade Luluzinha -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #7e22ce 0%, #581c87 100%); padding: 24px 28px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background-color: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25); color: #fdf4ff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
                      ${badgeText}
                    </span>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; line-height: 1.25;">
                      ${title}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sessão 3: Corpo Principal do Texto -->
          <tr>
            <td style="padding: 32px 30px 24px 30px; background-color: #ffffff;">
              <h2 style="margin: 0 0 16px 0; color: #3b0764; font-size: 18px; font-weight: 800; line-height: 1.3;">
                Olá, ${name}! 💕
              </h2>

              <div style="color: #4b5563; font-size: 14px; line-height: 1.65; margin-bottom: 24px;">
                ${contentHtml}
              </div>

              <!-- Card de Destaque / Resumo -->
              ${highlightCardHtml ? `
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf5ff; border: 1px solid #f3e8ff; border-radius: 16px; margin-bottom: 26px; padding: 18px;">
                  <tr>
                    <td>
                      ${highlightCardHtml}
                    </td>
                  </tr>
                </table>
              ` : ""}

              <!-- Botão Principal de Ação (CTA) -->
              ${buttonText ? `
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 16px 0;">
                  <tr>
                    <td align="center">
                      <a href="${buttonUrl}" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 15px 32px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(126, 34, 206, 0.35); text-align: center; letter-spacing: 0.2px;">
                        ${buttonText}
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ""}

              ${footerNote ? `
                <p style="margin: 20px 0 0 0; font-size: 12px; color: #6b7280; line-height: 1.5; text-align: center;">
                  ${footerNote}
                </p>
              ` : ""}
            </td>
          </tr>

          <!-- Sessão 4: Rodapé Oficial Luluzinha -->
          <tr>
            <td style="background-color: #faf5ff; border-top: 1px solid #f3e8ff; padding: 24px 28px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #7e22ce; font-weight: 800;">
                Luluzinha • O braço direito do seu espaço de manicure ✨
              </p>
              <p style="margin: 6px 0 0 0; font-size: 11px; color: #9ca3af; line-height: 1.5;">
                Feito com muito carinho para valorizar o seu trabalho todos os dias.<br/>
                Dúvidas ou suporte? Conte com a gente no painel ou via WhatsApp.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
