'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/errors/error-state'
import { FaRotateLeft, FaWhatsapp } from 'react-icons/fa6'
import { whatsappNumber } from '@/commons/constants/support'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Olá! Estou usando a Luluzinha (Espaço Alpha) e encontrei um erro na página. Você pode me ajudar?"
  )}`;

  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center p-4">
      <ErrorState
        type="error"
        title="Ops! O nosso sistema deu uma escorregada..."
        description="Como a Luluzinha ainda está na fase de testes fechados (Alpha), algumas ferramentas podem dar um pequeno susto de vez em quando. Já anotamos o que aconteceu para corrigir!"
        action={
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Button onClick={() => reset()} variant="default" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold px-5 py-2.5">
              <FaRotateLeft className="mr-2" />
              Tentar Novamente
            </Button>
            <Button asChild variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-full font-bold px-5 py-2.5">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                <FaWhatsapp className="mr-2 text-green-500 w-4 h-4" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        }
      />
    </div>
  )
}
