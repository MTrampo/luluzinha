"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IoFlowerSharp } from "react-icons/io5";
import { useEstablishmentStore } from "@/store/use-establishment"
import { setEstablishmentCookie } from "@/commons/lib/auth/establishment"

export function NavTeamSwitcher() {
  const { establishments, activeEstablishment, setActiveEstablishment } = useEstablishmentStore()

  const selectNewEstablishment = async (establishmentId: string) => {
    const establishment = establishments.find(e => e.id === establishmentId)
    if (establishment) {
      setActiveEstablishment(establishment)
      await setEstablishmentCookie(establishmentId)
      window.location.reload()
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <IoFlowerSharp />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeEstablishment?.nameFormatted || 'Carregando...'}</span>
                <span className="truncate text-xs">Rainha</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Meus Estabelecimentos
            </DropdownMenuLabel>
            {establishments.map((establishment) => (
              <DropdownMenuCheckboxItem
                key={establishment.id}
                className="gap-2 p-2 cursor-pointer"
                checked={establishment.id === activeEstablishment?.id}
                onCheckedChange={() => selectNewEstablishment(establishment.id)}
              >
                <div className="flex p-1 items-center justify-center rounded-md border">
                  <IoFlowerSharp />
                </div>
                {establishment.nameFormatted}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}