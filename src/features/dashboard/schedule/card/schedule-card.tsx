"use client"

import Link from "next/link"
import { ScheduleDash } from "@/commons/models/schedule"
import { ScheduleStatusEnum } from "@/commons/enums/schedule"
import { StandardAvatar } from "@/components/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { FaClock } from "react-icons/fa6"
import { cn } from "@/commons/lib/tw-merge"
import { statusMap } from "@/components/maps/status-map"
import { AppointmentMenu } from "./appointment-menu"
import { getVisibleProcedures } from "@/commons/utils/schedule"

type ScheduleCardProps = {
  schedule: ScheduleDash;
}

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  const currentStatus = statusMap[schedule.status];
  const { visibleProcedures, remainingCount } = getVisibleProcedures(schedule.procedures, 3);

  return (
    <Card className={cn(
      "group relative flex flex-row items-stretch gap-0 p-0 overflow-hidden transition-all hover:shadow-md duration-300 border-purple-100/50 min-h-24 w-full bg-white rounded-md",
      "border-l-4",
      currentStatus.border
    )}>

      <Link
        href={`/painel/agenda/atendimento/${schedule.id}`}
        className="flex-1 flex flex-row items-stretch min-h-24"
      >
        {/* Coluna do Horário (Esquerda) */}
        <div className="flex flex-col items-center justify-center w-20 sm:w-24 lg:w-32 border-r border-dashed border-purple-100 shrink-0 bg-purple-50/5">
          <span className="text-sm sm:text-base lg:text-xl font-bold text-gray-600 leading-none">
            {schedule.startTimeFormatted}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs text-gray-400 font-medium tracking-tight">
            <FaClock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>{schedule.totalDurationFormatted}</span>
          </div>
        </div>

        {/* Bloco de Conteúdo (Direita) */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-0 sm:px-4 lg:px-6 gap-2 sm:gap-4">
          {/* Informações da Cliente e Procedimentos */}
          <div className="flex items-center gap-2 lg:gap-4 min-w-0">
            <StandardAvatar
              initials={schedule.customer.initials}
              className="h-8 w-8 lg:h-11 lg:w-11 shrink-0"
            />

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm lg:text-base text-gray-800 truncate max-w-35 sm:max-w-none">
                {schedule.customer.nameFormatted}
              </span>

              <div className="flex flex-wrap gap-1 mt-1">
                {visibleProcedures.map((proc) => (
                  <Badge
                    key={proc.id}
                    variant="secondary"
                    className="bg-purple-50 text-purple-600 text-[0.6rem] border-purple-100 px-1.5 lg:px-2.5 py-0.5 rounded-md leading-none"
                  >
                    {proc.name}
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <span className="text-[0.6rem] lg:text-xs text-purple-700 self-center font-semibold">
                    +{remainingCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Preço e Status */}
          <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 sm:gap-1 border-t border-purple-50/50 pt-2 sm:border-t-0 sm:pt-0 shrink-0 pr-8 sm:pr-10 lg:pr-12">
            <Badge
              variant="outline"
              className={cn(
                "text-[0.6rem] lg:text-[0.7rem] font-semibold border rounded-md px-1.5 py-0 uppercase tracking-wide",
                currentStatus.class
              )}
            >
              {currentStatus.label}
            </Badge>
            <span className="text-sm sm:text-base lg:text-xl font-bold text-gray-800">
              {schedule.totalPriceFormatted}
            </span>
          </div>
        </div>
      </Link>

      {schedule.status !== ScheduleStatusEnum.COMPLETED && (
        <div className="absolute right-2 sm:right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10">
          <AppointmentMenu schedule={schedule} />
        </div>
      )}
    </Card>
  )
}

