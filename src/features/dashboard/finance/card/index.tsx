"use client"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode, useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { FaCircleQuestion } from "react-icons/fa6"
import { IconType } from "react-icons"

import { cn } from "@/commons/lib/tw-merge"

type CardFinanceProps = {
  title: string
  amount: string
  percentage?: ReactNode
  description: ReactNode
  last: string
  icon?: IconType
  helpText?: string
  className?: string
}

export function CardFinance({ title, amount, percentage, description, last, icon: Icon, helpText, className }: CardFinanceProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return (
    <Card className={cn("overflow-hidden border border-purple-100/80 bg-white shadow-xs rounded-xl sm:rounded-2xl flex flex-col justify-between gap-0", className)}>
      <CardHeader className="space-y-2 p-3.5 sm:p-4 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600 border border-purple-100/60 shadow-2xs">
              {Icon && <Icon className="w-3.5 h-3.5" />}
            </div>
            <CardDescription className="font-bold text-[11px] uppercase tracking-wider text-purple-900/80">
              {title}
            </CardDescription>
            {helpText && mounted && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-purple-300 hover:text-purple-600 transition-colors cursor-help">
                    <FaCircleQuestion className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-50 text-[10px] bg-purple-950 text-white border-none shadow-xl p-2.5 leading-relaxed rounded-lg">
                  {helpText}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {percentage && (
            <CardAction>
              {percentage}
            </CardAction>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-3.5 sm:px-4 py-1">
        <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-purple-950 tabular-nums">
          {amount}
        </CardTitle>
      </CardContent>
      <CardFooter className="flex-col items-start gap-0.5 p-2.5 px-3.5 sm:p-3 sm:px-4 bg-purple-50/25 border-t border-purple-100/40 mt-1">
        <div className="line-clamp-1 flex gap-1.5 text-[11px] font-medium text-gray-600">
          {description}
        </div>
        <div className="text-[9px] font-bold text-purple-600/70">
          {last}
        </div>
      </CardFooter>
    </Card>
  )
}