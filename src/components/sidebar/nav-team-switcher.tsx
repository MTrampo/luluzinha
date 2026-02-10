"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavTeamItem } from "@/commons/types/sidebar"
import { FaCirclePlus } from "react-icons/fa6"
import { IoFlowerSharp } from "react-icons/io5";
//import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation"

export type NavTeamSwitcherProps = {
  teams: NavTeamItem[];
}

export function NavTeamSwitcher() {
  //const { user, activeTeam, selectTeam } = useUser()
  
  const router = useRouter()
  const { isMobile } = useSidebar()

  const selectNewTeam = async (teamId: string) => {
    //await selectTeam(teamId)
    window.location.reload()
  }

  // if (!activeTeam) {
  //   return null
  // }

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
                <span>
                  <IoFlowerSharp />
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {/* <span className="truncate font-medium">{activeTeam.team.name}</span>
                <span className="truncate text-xs">{activeTeam.roleFormatted}</span> */}
                <span className="truncate font-medium">Vini</span>
                <span className="truncate text-xs">dono</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Frotas
            </DropdownMenuLabel>
            {/* {user?.teams && user.teams.map(team => (
              <DropdownMenuCheckboxItem
                key={team.id}
                className="gap-2 p-2"
                checked={team.team.id === activeTeam.team.id}
                onCheckedChange={() => selectNewTeam(team.team.id)}
              >
                <div className="flex p-1 items-center justify-center rounded-md border">
                  <span className="shrink-0">
                    <IoFlowerSharp />
                  </span>
                </div>
                {team.team.name}
              </DropdownMenuCheckboxItem>
            ))} */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <FaCirclePlus />
              Criar Frota
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}