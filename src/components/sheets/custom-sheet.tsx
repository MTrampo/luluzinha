"use client"

import { ReactNode } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface CustomSheetProps {
  trigger?: ReactNode
  title: string
  description?: string
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CustomSheet({ trigger, title, description, children, open, onOpenChange }: CustomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
      )}
      <SheetContent side="right" className="p-0 w-full max-w-[100vw] sm:max-w-md sm:w-105 flex flex-col bg-white gap-0 border-l-purple-100">
        <SheetHeader className="p-5 sm:p-6 border-b border-purple-50 shrink-0 pr-12">
          <SheetTitle className="text-purple-900 font-bold text-lg">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-gray-500 text-xs mt-1 leading-normal">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
