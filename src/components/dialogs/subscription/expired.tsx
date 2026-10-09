"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FaCrown, FaRightFromBracket, FaTriangleExclamation } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { signOutAction } from "@/actions/auth"
import { useTransition } from "react"

type ExpiredDialogProps = {
  name: string
  open: boolean
}

export function ExpiredDialog({ name, open }: ExpiredDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRenew = () => {
    router.push("/assinatura")
  }

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent className="bg-purple-50/95 border border-purple-200 text-purple-950 sm:max-w-md shadow-2xl backdrop-blur-md">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-purple-100 text-purple-700">
            <FaTriangleExclamation className="w-5 h-5" />
          </AlertDialogMedia>

          <AlertDialogTitle className="text-purple-950 text-xl font-bold">
            Seu Espaço precisa de uma assinatura ativa
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-sm mt-2 leading-relaxed">
            {name ? `${name}, o` : "O"} período da sua assinatura encerrou. Para continuar organizando sua Agenda de Atendimentos, cuidando das suas Poderosas e acompanhando Seu Caixa, renove seu plano e continue brilhando!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2 sm:gap-3">
          <AlertDialogCancel
            disabled={isPending}
            onClick={handleSignOut}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <FaRightFromBracket className="w-4 h-4 mr-1.5" />
            Sair da Conta
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleRenew}
            className="bg-purple-900 hover:bg-purple-950 text-white font-semibold transition-all shadow-md"
          >
            <FaCrown className="w-4 h-4 mr-1.5 text-amber-300" />
            Renovar Plano
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
