"use client"

import { useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mpPayerEmailSchema } from "@/commons/validations/subscription"
import { FaArrowLeft, FaArrowLeftLong, FaCircleCheck, FaCircleXmark, FaEnvelope, FaEnvelopeCircleCheck } from "react-icons/fa6"
import { useProfileStore } from "@/store/use-profile"

type Step = "question" | "other-email"

interface ConfirmEmailDialogProps {
  userEmail: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmed: (email: string) => void
}

export function ConfirmEmailDialog({ userEmail, open, onOpenChange, onConfirmed }: ConfirmEmailDialogProps) {
  const luluzinha = useProfileStore((state) => state.luluzinha)
  const [step, setStep] = useState<Step>("question")
  const [otherEmail, setOtherEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const reset = () => {
    setStep("question")
    setOtherEmail("")
    setEmailError("")
  }

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
    if (!value) reset()
  }

  const handleConfirm = (email: string) => {
    const result = mpPayerEmailSchema.safeParse({ email })
    if (!result.success) {
      setEmailError(result.error.issues[0].message)
      return
    }

    setEmailError("")
    handleOpenChange(false)
    onConfirmed(email)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar E-mail de Pagamento</AlertDialogTitle>
          <AlertDialogDescription className="mt-0">
            {luluzinha},{' '}
            {step === "question"
              ? "para que possamos identificar seu pagamento, organizar suas informações e manter sua assinatura ativa, precisamos saber qual e-mail será utilizado no Mercado Pago."
              : "informe o e-mail que você usa ou pretende usar no Mercado Pago para que possamos vincular sua assinatura corretamente."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {step === "question" && (
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground mt-2">
              O e-mail abaixo é o mesmo da sua conta no Mercado Pago?
            </p>
            
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm text-muted-foreground center flex items-center gap-2">
                <FaEnvelope /> E-mail da conta:
              </span>
              <span className="text-sm font-medium break-all">{userEmail}</span>
            </div>

            <p className="text-xs text-muted-foreground mt-0">
              Sem essa confirmação, não será possível identificar seu pagamento e gerenciar sua assinatura, faturas e cobranças.
            </p>

            <AlertDialogFooter className="flex gap-2 sm:justify-end mt-3">
              <Button variant="outline" onClick={() => setStep("other-email")}>
                <FaCircleXmark /> NÃO, É OUTRO
              </Button>
              <Button variant="success" onClick={() => handleConfirm(userEmail)}>
                <FaCircleCheck /> SIM, É O MESMO
              </Button>
            </AlertDialogFooter>
          </div>
        )}

        {step === "other-email" && (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Input
                type="email"
                placeholder="luluzinha@exemplo.com"
                value={otherEmail}
                onChange={(e) => {
                  setOtherEmail(e.target.value)
                  if (emailError) setEmailError("")
                }}
                aria-invalid={!!emailError}
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>

            <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => { setStep("question"); setEmailError("") }}>
                <FaArrowLeft /> VOLTAR
              </Button>
              <Button variant="success" onClick={() => handleConfirm(otherEmail)} disabled={!otherEmail}>
                <FaEnvelopeCircleCheck /> CONFIRMAR
              </Button>
            </AlertDialogFooter>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
