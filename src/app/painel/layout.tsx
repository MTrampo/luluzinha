import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { SubscriptionHydrator } from "@/components/subscription/hydrator"

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
      <aside>
        <AppSidebar />
      </aside>
      <SidebarInset>
        {children}
        <SubscriptionHydrator/>
      </SidebarInset>
    </SidebarProvider>
  )
}