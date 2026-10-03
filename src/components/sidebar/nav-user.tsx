'use client'

import { FaCircleUser, FaCreditCard, FaIdCard, FaPersonWalkingArrowRight, FaPaintbrush } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { AvatarMap } from "@/components/maps/avatar-map";
import { ChevronsUpDown, Smartphone, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { signOutAction } from "@/actions/auth";
import { useProfileStore } from "@/store/use-profile";
import { useEstablishmentStore } from "@/store/use-establishment";
import { usePwaInstall } from "@/commons/hooks/use-pwa-install";
import { IosGuideDialog } from "@/components/pwa";

export function NavUser() {
  const profile = useProfileStore((state) => state.profile)
  const luluzinha = useProfileStore((state) => state.luluzinha)
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { isStandalone, isIOS, isDesktop, installTitle, installApp } = usePwaInstall()
  const [showIosGuide, setShowIosGuide] = useState(false)

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(true)
    } else {
      await installApp()
    }
  }

  const handleSignOut = async () => {
    await signOutAction()

    useProfileStore.getState().clearStore()
    useEstablishmentStore.getState().clearStore()

    router.push('/')
  }

  const avatarKey = profile?.avatarUrl || "avatar-1";
  const avatarSrc = AvatarMap[avatarKey]?.src || "/logo.svg";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-9 bg-transparent shrink-0">
                <AvatarImage src={avatarSrc} alt={`Foto de perfil da ${luluzinha}`} className="object-contain" />
                <AvatarFallback className="bg-transparent text-purple-600">
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
                <Avatar className="size-9 bg-transparent shrink-0">
                  <AvatarImage src={avatarSrc} alt={`Foto de perfil da ${luluzinha}`} className="object-contain" />
                  <AvatarFallback className="bg-transparent text-purple-600">
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
            </DropdownMenuGroup> 
            <DropdownMenuSeparator />*/}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/painel/bancada">
                  <FaPaintbrush />
                  Meu Espaço
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/painel/conta">
                  <FaIdCard />
                  Minha Conta
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/painel/pagamentos">
                  <FaCreditCard />
                  Pagamento
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {!isStandalone && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleInstallClick}
                    className="cursor-pointer text-primary focus:text-primary font-medium focus:bg-purple-50"
                  >
                    {isDesktop ? (
                      <Laptop className="size-4 text-primary" />
                    ) : (
                      <Smartphone className="size-4 text-primary" />
                    )}
                    {installTitle}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" variant='destructive' onSelect={handleSignOut}>
              <FaPersonWalkingArrowRight />
              Encerrar Expediente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <IosGuideDialog open={showIosGuide} onOpenChange={setShowIosGuide} />
    </SidebarMenu>
  )
}