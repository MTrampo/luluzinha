'use client'

import * as React from "react"
import { APP_VERSION, APP_STAGE } from "@/commons/constants/app"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { IoSparklesSharp } from "react-icons/io5"
import { VersionNewsDialog } from "@/components/dialogs/system/version-news-dialog"

const STORAGE_KEY = "luluzinha_last_seen_version"

export function NavVersion() {
  const [hasNewUpdate, setHasNewUpdate] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    const lastSeen = localStorage.getItem(STORAGE_KEY)
    if (lastSeen !== APP_VERSION) {
      setHasNewUpdate(true)
    }
  }, [])

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
    if (hasNewUpdate) {
      localStorage.setItem(STORAGE_KEY, APP_VERSION)
      setHasNewUpdate(false)
    }
  }

  return (
    <>
      <SidebarMenu className="mt-1">
        <SidebarMenuItem>
          <button
            type="button"
            onClick={handleOpenDialog}
            title="Ver novidades da versão"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100/60 hover:border-purple-200 text-xs text-purple-900/70 hover:text-purple-950 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-1.5 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="relative flex h-2 w-2 shrink-0">
                {hasNewUpdate && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    hasNewUpdate ? "bg-pink-500" : "bg-purple-600"
                  }`}
                ></span>
              </span>
              <span className="font-medium truncate group-data-[collapsible=icon]:hidden">
                v{APP_VERSION}
              </span>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full font-lexend group-data-[collapsible=icon]:hidden ${
                  hasNewUpdate
                    ? "bg-pink-100 text-pink-700 animate-pulse"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {hasNewUpdate ? "Novidades!" : APP_STAGE}
              </span>
            </div>
            <div className="text-[10px] text-purple-400 group-data-[collapsible=icon]:hidden">
              <IoSparklesSharp
                className={`h-3 w-3 ${hasNewUpdate ? "text-pink-500" : "text-purple-400"}`}
              />
            </div>
          </button>
        </SidebarMenuItem>
      </SidebarMenu>

      <VersionNewsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

