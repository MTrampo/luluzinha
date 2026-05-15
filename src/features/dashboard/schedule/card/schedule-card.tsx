"use client"

import Link from "next/link"
import { ScheduleDash } from "@/commons/models/schedule"
import { ScheduleStatusEnum } from "@/commons/enums/schedule"
import { StandardAvatar } from "@/components/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { FaClock } from "react-icons/fa6"
import { cn } from "@/commons/lib/tw-merge"
import { useIsMobile } from "@/hooks/use-mobile"
import { statusMap } from "@/commons/utils/status-map"
import { Menu } from "./menu"

type ScheduleCardProps = {
  schedule: ScheduleDash;
  isMobileServer?: boolean;
}

export function ScheduleCard({ schedule, isMobileServer }: ScheduleCardProps) {
  const isMobileClient = useIsMobile();
  const isMobile = isMobileClient ?? isMobileServer;

  const currentStatus = statusMap[schedule.status];
  const maxVisible = isMobile ? 1 : 3;
  const visibleProcedures = schedule.procedures.slice(0, maxVisible);
  const remainingCount = schedule.procedures.length - maxVisible;

  return (
    <Card className={cn(
      "group relative flex flex-row items-center gap-0 p-0 overflow-hidden transition-all hover:shadow-md duration-300 border-purple-100/50 min-h-24 w-full bg-white rounded-md",
      "border-l-4",
      currentStatus.border
    )}>
      
      <Link 
        href={`/painel/agenda/atendimento/${schedule.id}`}
        className="flex-1 flex flex-row items-center min-h-24"
      >
        <div className="flex flex-col items-center justify-center py-3 w-24 md:w-32 border-r border-dashed border-purple-100 shrink-0">
          <span className="text-base md:text-xl font-bold text-gray-600 leading-none">
            {schedule.startTimeFormatted}
          </span>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 font-medium tracking-tight">
            <FaClock className="w-2 h-2 md:w-3 md:h-3" />
            <span>{schedule.totalDurationFormatted}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-row items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-2 md:gap-4">
            <StandardAvatar
              initials={schedule.customer.initials}
              className="h-8 w-8 md:h-11 md:w-11"
            />

            <div className="flex flex-col">
              <span className="font-bold text-xs md:text-base text-gray-800 truncate">
                {schedule.customer.nameFormatted}
              </span>

              <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                {visibleProcedures.map((proc) => (
                  <Badge
                    key={proc.id}
                    variant="secondary"
                    className="bg-purple-50 text-purple-600 text-[0.6rem] border-purple-100 px-1.5 md:px-2.5 py-1 rounded-md"
                  >
                    {proc.name}
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <span className="text-[0.6rem] md:text-xs text-purple-700 self-center">
                    +{remainingCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5 shrink-0 pr-10 md:pr-12">
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="outline"
                className={cn(
                  "text-[0.6rem] md:text-[0.7rem] font-semibold border rounded-md px-1.5 py-0 uppercase tracking-wide",
                  currentStatus.class
                )}
              >
                {currentStatus.label}
              </Badge>
              <span className="text-sm md:text-xl font-bold text-gray-800">
                {schedule.totalPriceFormatted}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10">
        <Menu schedule={schedule} />
      </div>
    </Card>
  )
}

