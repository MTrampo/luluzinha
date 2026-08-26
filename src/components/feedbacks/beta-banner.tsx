'use client'

import * as React from "react"
import { IoCloseSharp, IoSparklesSharp } from "react-icons/io5"
import { FaWhatsapp } from "react-icons/fa6"

export function BetaBanner() {
  const [isDismissed, setIsDismissed] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const dismissed = localStorage.getItem("luluzinha_beta_banner_dismissed")
    setIsDismissed(dismissed === "true")
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("luluzinha_beta_banner_dismissed", "true")
    setIsDismissed(true)
  }

  if (isDismissed === null || isDismissed) {
    return null
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "5511999999999"
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Olá! Estou usando a Luluzinha (Bancada Beta) e encontrei um detalhe ou gostaria de dar uma sugestão..."
  )}`

  return (
    <div className="bg-linear-to-r from-purple-700 via-purple-600 to-indigo-600 border-b border-purple-500/30 px-4 py-2.5 relative transition-all duration-300 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pr-8">
        <div className="flex items-center gap-2.5 text-left text-sm text-white font-medium">
          <div className="bg-white/15 text-purple-100 p-1.5 rounded-full shrink-0">
            <IoSparklesSharp className="h-3.5 w-3.5 text-purple-200" />
          </div>
          <span>
            🌸 <strong className="font-lexend font-bold text-purple-100">Bancada de Testes (Beta):</strong> Estamos lapidando cada cantinho do app com muito carinho! Se algo não funcionar ou se quiser nos dar uma dica, fale conosco.
          </span>
        </div>
        <div className="shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-white text-purple-700 hover:bg-purple-50 shadow-sm transition-all duration-200 transform hover:scale-[1.02]"
          >
            <FaWhatsapp className="h-3.5 w-3.5 text-green-500" />
            Chamar no WhatsApp
          </a>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors"
        aria-label="Fechar aviso"
      >
        <IoCloseSharp className="h-4.5 w-4.5" />
      </button>
    </div>
  )
}
