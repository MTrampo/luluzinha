'use client'

import { useTransition } from "react";
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner";
import { getSubscriptionEndpointAction } from "@/actions/subscription";
import { toast } from "sonner";

interface ButtonSubscriptionProps {
  className?: string;
  text: string;
}

export const ButtonSubscription = ({ className, text }: ButtonSubscriptionProps) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const url = await getSubscriptionEndpointAction()
      if (!url || !url.data) {
        toast.error(url.message || "Erro ao criar sessão de checkout com Mercado Pago")
        return
      }
      globalThis.window.open(url.data)
    })
  }

  return (
    <Button variant="theme" size="lg" className={className} onClick={handleClick}>
      {isPending ? (
        <>
          <Spinner data-icon="inline-start" />
          PROCESSANDO...
        </>
      ) : text}
    </Button>
  )
}