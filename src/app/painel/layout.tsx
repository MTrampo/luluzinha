import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { SubscriptionHydrator } from "@/components/subscription/hydrator"
import { EstablishmentHydrator } from "@/components/establishment/hydrator"
import { TooltipProvider } from "@/components/ui/tooltip"

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
          <AppSidebar />
          <SidebarInset>
            <EstablishmentHydrator />
            <SubscriptionHydrator />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}