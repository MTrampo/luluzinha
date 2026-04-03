'use client'

import { ReactNode, useState, useTransition } from "react";
import { Button, buttonVariants } from "../ui/button"
import type { VariantProps } from "class-variance-authority"
import { Spinner } from "../ui/spinner";
import { getSubscriptionEndpointAction } from "@/actions/subscription";
import { getUserLoggedAction } from "@/actions/auth";
import { toast } from "sonner";
import { ConfirmEmailDialog } from "../dialogs/subscription/confirm-email";

interface ButtonSubscriptionProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  children: ReactNode;
}

export const ButtonSubscription = ({ className, children, variant, size }: ButtonSubscriptionProps) => {
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const handleClick = () => {
    startTransition(async () => {
      const result = await getUserLoggedAction()
      if (!result.data?.user?.email) {
        globalThis.window.location.href = '/entrar'
        return
      }
      setUserEmail(result.data.user.email)
      setDialogOpen(true)
    })
  }

  const handleEmailConfirmed = (mpPayerEmail: string) => {
    startTransition(async () => {
      const url = await getSubscriptionEndpointAction(mpPayerEmail)
      if (!url || !url.data) {
        toast.error(url.message || "Erro ao criar sessão de checkout com Mercado Pago")
        return
      }
      globalThis.window.location.href = url.data
    })
  }

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={handleClick} disabled={isPending}>
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" />
            PROCESSANDO...
          </>
        ) : children}
      </Button>

      <ConfirmEmailDialog
        userEmail={userEmail}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirmed={handleEmailConfirmed}
      />
    </>
  )
}