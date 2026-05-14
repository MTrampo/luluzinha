"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { NavSectionItem, NavSectionGroup, NavRoot } from "@/commons/types/sidebar";
import { FaChevronRight } from "react-icons/fa6";
import { usePathname } from "next/navigation";

export type NavMainProps = {
  nav?: NavRoot;
  items?: NavSectionItem[]; // backward compatible
  groups?: NavSectionGroup[]; // backward compatible
}

export function NavMain({ nav, items, groups }: NavMainProps) {
  const pathname = usePathname()
  const isActive = (url: string) => {
    if (url === '/painel') return pathname === url;
    return pathname === url || pathname.startsWith(`${url}/`);
  }

  const groupsToRender = groups ?? nav?.groups ?? (nav?.main ? [{ label: undefined, items: nav.main }] : (items ? [{ label: undefined, items }] : []))

  return (
    <>
      {groupsToRender.map((group, gi) => (
        <SidebarGroup key={group.label ?? gi}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarMenu>
            {group.items.map(item => 
              !item.subNavs ? (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={isActive(item.url)}>
                        {item.icon}
                        <span>{item.title}</span>
                        <FaChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subNavs?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
} 
