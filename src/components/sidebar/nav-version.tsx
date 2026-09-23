'use client'

import { APP_VERSION, APP_STAGE } from "@/commons/constants/app"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { IoSparklesSharp } from "react-icons/io5"

export function NavVersion() {
  return (
    <SidebarMenu className="mt-1">
      <SidebarMenuItem>
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-purple-50/50 border border-purple-100/60 text-xs text-purple-900/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-1.5 transition-all">
          <div className="flex items-center gap-1.5 truncate">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
            </span>
            <span className="font-medium truncate group-data-[collapsible=icon]:hidden">
              v{APP_VERSION}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-lexend group-data-[collapsible=icon]:hidden">
              {APP_STAGE}
            </span>
          </div>
          <div className="text-[10px] text-purple-400 group-data-[collapsible=icon]:hidden">
            <IoSparklesSharp className="h-3 w-3 text-purple-400" />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
