'use client'

import { useEstablishmentStore } from "@/store/use-establishment"
import { Onboarding } from "@/features/dashboard/onboarding"
import { Spinner } from "@/components/ui/spinner"
import { useEffect, useState } from "react"

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const activeEstablishment = useEstablishmentStore((state) => state.activeEstablishment)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner className="size-8 text-purple-900" />
      </div>
    )
  }

  // Se o estabelecimento ativo for temporário, força a exibição do onboarding
  const isTemporary = activeEstablishment?.slug?.startsWith("bancada-temp-") || activeEstablishment?.slug?.startsWith("espaco-temp-")

  if (isTemporary) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-purple-50/10 p-6 md:p-12">
        <Onboarding />
      </div>
    )
  }

  return <>{children}</>
}
