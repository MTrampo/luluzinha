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
import { getEstablishmentLiveStatus } from "@/commons/utils/helper"
import { EstablishmentIconMap } from "@/components/maps/status-map"
import { useRouter } from "next/navigation";

export function NavTeamSwitcher() {
  const route = useRouter()
  const { establishments, activeEstablishment, setActiveEstablishment } = useEstablishmentStore()

  const selectNewEstablishment = async (establishmentId: string) => {
    const establishment = establishments.find(e => e.id === establishmentId)
    if (establishment) {
      setActiveEstablishment(establishment)
      await setEstablishmentCookie(establishmentId)
      window.location.reload()
    }
  }

  const liveStatus = activeEstablishment?.openingHours
    ? getEstablishmentLiveStatus(activeEstablishment.openingHours)
    : null

  const statusText = liveStatus ? `${liveStatus.isOpen ? "Aberto" : "Fechado"}` : ""

  const SelectedIconComponent = activeEstablishment?.avatarUrl
    ? (EstablishmentIconMap[activeEstablishment.avatarUrl] || IoFlowerSharp)
    : IoFlowerSharp

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* <DropdownMenu>
           <DropdownMenuTrigger asChild> */}
        <SidebarMenuButton
          size="lg"
          onClick={() => route.push('/painel/bancada')}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            {activeEstablishment ? (
              <SelectedIconComponent className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            {activeEstablishment ? (
              <>
                <span className="truncate font-medium flex items-center gap-1.5">
                  {activeEstablishment.nameFormatted}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 tracking-wider uppercase font-lexend">
                    Beta
                  </span>
                </span>
                <span className="truncate text-xs">{statusText}</span>
              </>
            ) : (
              <div className="space-y-1.5 py-0.5 animate-pulse">
                <div className="h-3 w-24 bg-sidebar-foreground/10 rounded" />
                <div className="h-2 w-12 bg-sidebar-foreground/10 rounded" />
              </div>
            )}
          </div>
        </SidebarMenuButton>
        {/* </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Meus Estabelecimentos
        </DropdownMenuLabel>
        {establishments.map((establishment) => {
          const EstIcon = establishment.avatarUrl
            ? (EstablishmentIconMap[establishment.avatarUrl] || IoFlowerSharp)
            : IoFlowerSharp
          return (
            <DropdownMenuCheckboxItem
              key={establishment.id}
              className="gap-2 p-2 cursor-pointer"
              checked={establishment.id === activeEstablishment?.id}
              onCheckedChange={() => selectNewEstablishment(establishment.id)}
            >
              <div className="flex p-1 items-center justify-center rounded-md border">
                <EstIcon />
              </div>
              {establishment.nameFormatted}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu> */}
      </SidebarMenuItem >
    </SidebarMenu >
  )
}