import * as React from "react"
import { FaCalendar, FaCashRegister, FaHouse, FaPaintbrush } from "react-icons/fa6"
import { IoWomanSharp } from "react-icons/io5";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavTeamSwitcher } from "./nav-team-switcher"
import { NavUser } from "./nav-user";
import type { NavRoot } from "@/commons/types/sidebar";

const navigation: NavRoot = {
  groups: [
    {
      items: [
        {
          title: "Início",
          url: "/painel",
          icon: <FaHouse />,
        },
      ],
    },
    {
      label: "Fluxo",
      items: [
        {
          title: "Agenda",
          url: "/painel/agenda",
          icon: <FaCalendar />,
        },
        {
          title: "Poderosas",
          url: "/painel/poderosas",
          icon: <IoWomanSharp />,
          isActive: true,
        },
      ],
    },
    {
      label: "Meu Espaço",
      items: [
        {
          title: "Caixa",
          url: "/painel/caixa",
          icon: <FaCashRegister />,
        },
        {
          title: "Procedimentos",
          url: "/painel/procedimentos",
          icon: <FaPaintbrush />,
          isActive: true,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar aria-label="Navigation sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <NavTeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain nav={navigation} />
        {/*<NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
