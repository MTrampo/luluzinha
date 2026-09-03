'use client'

import * as React from "react"
import { IoCloseSharp, IoSparklesSharp } from "react-icons/io5"
import { FaWhatsapp } from "react-icons/fa6"
import { whatsappNumber } from "@/commons/constants/support"

export function AlphaBanner() {
  const [isDismissed, setIsDismissed] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const dismissed = localStorage.getItem("luluzinha_alpha_banner_dismissed")
    setIsDismissed(dismissed === "true")
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("luluzinha_alpha_banner_dismissed", "true")
    setIsDismissed(true)
  }

  if (isDismissed === null || isDismissed) {
    return null
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Olá! Estou usando a Luluzinha (Espaço Alpha) e encontrei um detalhe ou gostaria de dar uma sugestão..."
  )}`

  return (
    <div className="bg-linear-to-r from-purple-700 via-purple-600 to-indigo-600 border-b border-purple-500/30 px-3.5 py-2.5 sm:px-4 relative transition-all duration-300 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pr-8">
        <div className="flex items-start sm:items-center gap-2 text-left text-xs sm:text-sm text-white font-medium">
          <div className="bg-white/15 text-purple-100 p-1 rounded-full shrink-0 mt-0.5 sm:mt-0">
            <IoSparklesSharp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-200" />
          </div>
          <span>
            🌸 <strong className="font-lexend font-bold text-purple-100">Espaço Alpha:</strong> Estamos lapidando cada detalhe! Se tiver sugestões ou dúvidas, fale com a gente.
          </span>
        </div>
        <div className="shrink-0 pl-7 sm:pl-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-purple-700 hover:bg-purple-50 shadow-sm transition-all duration-200"
          >
            <FaWhatsapp className="h-3.5 w-3.5 text-green-500" />
            WhatsApp de Suporte
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
