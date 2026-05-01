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

type ExpiredDialogProps = {
  name: string
  open: boolean
  onDismiss: () => void
}

export function ExpiredDialog({ name, open, onDismiss }: ExpiredDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(value) => { if (!value) onDismiss() }}>
      <AlertDialogContent className="bg-red-100">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-200">
            <FaTriangleExclamation className="text-red-700"/>
          </AlertDialogMedia>

          <AlertDialogTitle className="text-red-700">Assinatura Expirada</AlertDialogTitle>
          <AlertDialogDescription className="mt-0 text-red-500">
            {name}, sua assinatura expirou e algumas funcionalidades foram limitadas.
            Quer continuar usando o serviço completo? Renove sua assinatura.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-red-700 border-red-700 hover:text-red-800" onClick={onDismiss}>
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
