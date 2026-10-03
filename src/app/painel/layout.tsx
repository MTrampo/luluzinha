import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { SubscriptionHydrator } from "@/components/subscription/hydrator"
import { EstablishmentHydrator } from "@/components/establishment/hydrator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BetaBanner } from "@/components/feedbacks/beta-banner"
import { OnboardingGuard } from "@/components/establishment/onboarding-guard"
import { HotkeysProvider } from "@/components/system/hotkeys-provider"

import type { Metadata } from "next"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    template: "%s | Luluzinha",
    default: "Meu Espaço | Luluzinha",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="theme-luluzinha min-h-screen flex flex-col bg-background text-foreground">
      <TooltipProvider delayDuration={0}>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <EstablishmentHydrator />
          <SubscriptionHydrator />
          <HotkeysProvider />
          <OnboardingGuard>
            <AppSidebar />
            <SidebarInset>
              <BetaBanner />
              {children}
            </SidebarInset>
          </OnboardingGuard>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}