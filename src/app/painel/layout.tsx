import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { SubscriptionHydrator } from "@/components/subscription/hydrator"
import { EstablishmentHydrator } from "@/components/establishment/hydrator"

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <EstablishmentHydrator />
        <SubscriptionHydrator />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}