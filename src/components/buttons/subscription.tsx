'use client'

import { ReactNode, useTransition } from "react";
import { Button, buttonVariants } from "../ui/button"
import type { VariantProps } from "class-variance-authority"
import { Spinner } from "../ui/spinner";
import { getSubscriptionEndpointAction } from "@/actions/subscription";
import { getUserLoggedAction } from "@/actions/auth";
import { toast } from "sonner";

interface ButtonSubscriptionProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  children: ReactNode;
  planSlug: string;
}

export const ButtonSubscription = ({ className, children, variant, size, planSlug }: ButtonSubscriptionProps) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await getUserLoggedAction()
        const userEmail = result.data?.user?.email

        if (!userEmail) {
          globalThis.window.location.href = '/entrar'
          return
        }

        const url = await getSubscriptionEndpointAction(userEmail, planSlug)
        if (!url || !url.data) {
          toast.error(url.message || "Erro ao criar sessão de checkout com Mercado Pago")
          return
        }

        // Redireciona diretamente para o checkout do Mercado Pago
        globalThis.window.location.href = url.data
      } catch (error) {
        console.error("Erro no clique de assinatura:", error)
        toast.error("Ocorreu um erro ao preparar o checkout. Tente novamente.")
      }
    })
  }


  return (
    <Button variant={variant} size={size} className={className} onClick={handleClick} disabled={isPending}>
      {isPending ? (
        <>
          <Spinner className="mr-2 h-4 w-4 text-purple-900" />
          PROCESSANDO...
        </>
      ) : children}
    </Button>
  )
}