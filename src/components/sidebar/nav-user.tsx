'use client'

import { FaCirclePlus, FaCircleUser, FaCreditCard, FaIdCard, FaPersonWalkingArrowRight } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import { useProfileStore } from "@/store/use-profile";
import { useEstablishmentStore } from "@/store/use-establishment";

export function NavUser() {
  const profile = useProfileStore((state) => state.profile)
  const luluzinha = useProfileStore((state) => state.luluzinha)
  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOutAction()

    useProfileStore.getState().clearStore()
    useEstablishmentStore.getState().clearStore()

    router.push('/')
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
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src='/logo.svg' alt={`Foto de perfil da ${luluzinha}`} />
                <AvatarFallback className="rounded-lg">
                  <FaCircleUser />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{luluzinha}</span>
                <span className="truncate text-xs">{profile?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src='/logo.svg' alt={`Foto de perfil da ${luluzinha}`} />
                  <AvatarFallback className="rounded-lg">
                    <FaCircleUser />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{luluzinha}</span>
                  <span className="truncate text-xs">{profile?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <FaCirclePlus />
                Criar Frota
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <FaIdCard />
                Luluzinha
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FaCreditCard />
                Pagamento
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" variant='destructive' onSelect={handleSignOut}>
              <FaPersonWalkingArrowRight />
              Encerrar Expediente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}