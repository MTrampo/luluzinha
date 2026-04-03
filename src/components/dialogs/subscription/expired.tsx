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
import { FaTriangleExclamation, FaUserCheck, FaUserLock } from "react-icons/fa6"
import { useProfileStore } from "@/store/use-profile"
import { useSubscriptionStore } from "@/store/use-subscription"

export function ExpiredDialog() {
  const luluzinha = useProfileStore((state) => state.luluzinha)
  const subscription = useSubscriptionStore((state) => state.subscription)
  const isExpired = useSubscriptionStore((state) => state.isExpired)
  const dismissed = useSubscriptionStore((state) => state.dismissed)
  const dismiss = useSubscriptionStore((state) => state.dismiss)

  const open = !!subscription && isExpired() && !dismissed

  if (!open) return null

  return (
    <AlertDialog open={open} onOpenChange={(value) => { if (!value) dismiss() }}>
      <AlertDialogContent className="bg-red-100">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-200">
            <FaTriangleExclamation className="text-red-700"/>
          </AlertDialogMedia>

          <AlertDialogTitle className="text-red-700">Assinatura Expirada</AlertDialogTitle>
          <AlertDialogDescription className="mt-0 text-red-500">
            {luluzinha}, sua assinatura expirou e algumas funcionalidades foram limitadas.
            Quer continuar usando o serviço completo? Renove sua assinatura.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-red-700 border-red-700 hover:text-red-800" onClick={dismiss}>
            <FaUserLock/> MANTER
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => {}}>
            <FaUserCheck/> RENOVAR
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
