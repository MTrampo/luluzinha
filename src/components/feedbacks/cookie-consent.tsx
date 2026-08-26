'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaCookieBite } from "react-icons/fa6"

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const consent = localStorage.getItem("luluzinha_cookie_consent")
    if (consent !== "true") {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("luluzinha_cookie_consent", "true")
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 dark:bg-purple-950/95 backdrop-blur-md border border-purple-100 dark:border-purple-900/50 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <div className="flex gap-3 items-start">
          <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-xl text-purple-600 dark:text-purple-300 shrink-0">
            <FaCookieBite className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 text-left">
            <h4 className="text-sm font-bold text-purple-950 dark:text-purple-100 font-lexend">
              Nossa bancada usa cookies! 🌸
            </h4>
            <p className="text-xs text-purple-900/70 dark:text-purple-300/80 leading-relaxed">
              Para garantir que sua experiência com a Luluzinha seja a mais leve, segura e personalizada possível, usamos cookies em nosso sistema. Ao continuar navegando, você concorda com o uso deles para deixar a sua rotina mais protegida.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/30 rounded-full font-bold text-xs px-4"
          >
            <Link href="/documento/politica#cookies">
              Saiba mais
            </Link>
          </Button>
          <Button 
            onClick={handleAccept} 
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full px-5 py-2 text-xs shadow-md shadow-purple-100 dark:shadow-none"
          >
            Eu aceito
          </Button>
        </div>
      </div>
    </div>
  )
}
