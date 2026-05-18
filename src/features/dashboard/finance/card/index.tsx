"use client"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode, useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { FaCircleQuestion } from "react-icons/fa6"
import { IconType } from "react-icons"

type CardFinanceProps = {
  title: string
  amount: string
  percentage: ReactNode
  description: ReactNode
  last: string
  icon?: IconType
  helpText?: string
}

export function CardFinance({ title, amount, percentage, description, last, icon: Icon, helpText }: CardFinanceProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-purple-100/50 bg-white/60 backdrop-blur-md shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              {Icon && <Icon className="w-4 h-4" />}
            </div>
            <CardDescription className="font-bold text-xs uppercase tracking-widest text-gray-400 group-hover:text-purple-600 transition-colors">
              {title}
            </CardDescription>
            {helpText && mounted && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-gray-300 hover:text-purple-500 transition-colors cursor-help">
                    <FaCircleQuestion className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-[10px] bg-gray-900 text-white border-none shadow-2xl p-3 leading-relaxed">
                  {helpText}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <CardAction>
            {percentage}
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl font-black tracking-tighter text-gray-900 tabular-nums">
          {amount}
        </CardTitle>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 p-4 bg-linear-to-b from-transparent to-purple-50/20 border-t border-purple-100/20">
        <div className="line-clamp-1 flex gap-2 text-xs font-bold text-gray-500">
          {description}
        </div>
        <div className="text-[10px] font-medium text-gray-400">
          {last}
        </div>
      </CardFooter>
    </Card>
  )
}