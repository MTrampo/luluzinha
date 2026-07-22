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
      <SheetContent side="right" className="p-0 w-[320px] sm:w-100 flex flex-col bg-white gap-0">
        <SheetHeader>
          <SheetTitle className="text-purple-900 font-bold text-lg">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-gray-500 text-xs mt-1 leading-normal">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="p-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
