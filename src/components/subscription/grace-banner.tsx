'use client'

import * as React from "react"
import Link from "next/link"
import { IoCloseSharp } from "react-icons/io5"
import { FaArrowRight, FaCreditCard, FaTriangleExclamation } from "react-icons/fa6"
import { useSubscriptionStore } from "@/store/use-subscription"
import { isSubscriptionInGracePeriod, getGracePeriodDaysRemaining } from "@/commons/lib/http/security"

const STORAGE_KEY = "luluzinha_grace_period_banner_dismissed"

export function SubscriptionGraceBanner() {
  const subscription = useSubscriptionStore((state) => state.subscription)
  const [isDismissed, setIsDismissed] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    setIsDismissed(dismissed === "true")
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true")
    setIsDismissed(true)
  }

  if (isDismissed === null || isDismissed || !subscription) {
    return null
  }

  const inGrace = isSubscriptionInGracePeriod(subscription)
  if (!inGrace) {
    return null
  }

  const daysRemaining = getGracePeriodDaysRemaining(subscription)

  return (
    <aside
      aria-label="Aviso de renovação pendente"
      className="bg-linear-to-r from-amber-600 via-amber-500 to-orange-500 border-b border-amber-400/40 px-3.5 py-2.5 sm:px-4 relative transition-all duration-300 shadow-md text-white"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pr-8">
        <div className="flex items-start sm:items-center gap-2 text-left text-xs sm:text-sm font-medium">
          <div className="bg-white/20 text-white p-1 rounded-full shrink-0 mt-0.5 sm:mt-0">
            <FaTriangleExclamation className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-100" />
          </div>
          <span>
            <strong className="font-lexend font-bold text-amber-100">Atenção ao seu espaço:</strong>{" "}
            Houve uma pendência na renovação automática do seu plano. Você tem{" "}
            <strong className="underline decoration-amber-200 decoration-2 underline-offset-2">
              {daysRemaining} {daysRemaining === 1 ? "dia" : "dias"} de tolerância
            </strong>{" "}
            para regularizar a cobrança e continuar brilhando sem interrupções!
          </span>
        </div>

        <div className="shrink-0 pl-7 sm:pl-0">
          <Link
            href="/painel/pagamentos"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-amber-800 hover:bg-amber-50 shadow-sm transition-all duration-200"
          >
            <FaCreditCard className="h-3 w-3 text-amber-600" />
            Regularizar Pagamento
            <FaArrowRight className="h-2.5 w-2.5 ml-0.5" />
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
        aria-label="Fechar aviso de renovação pendente"
      >
        <IoCloseSharp className="h-4.5 w-4.5" />
      </button>
    </aside>
  )
}
