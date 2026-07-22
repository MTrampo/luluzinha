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
import { AppointmentMenu } from "../appointment-menu"
import { getVisibleProcedures } from "@/commons/utils/schedule"

type ScheduleCardMobileProps = {
  schedule: ScheduleDash;
}

export function ScheduleCardMobile({ schedule }: ScheduleCardMobileProps) {
  const currentStatus = statusMap[schedule.status];
  const { visibleProcedures, remainingCount } = getVisibleProcedures(schedule.procedures, 2);

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all hover:shadow-md duration-300 border-purple-100/50 w-full bg-white rounded-md",
      "border-l-4",
      currentStatus.border
    )}>
      <Link
        href={`/painel/agenda/atendimento/${schedule.id}`}
        className="flex flex-col gap-2"
      >
        {/* Topo: Horário + Duração + Status */}
        <div className="flex items-center justify-between px-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-gray-700 leading-none tracking-tight">
              {schedule.startTimeFormatted}
            </span>
            <span className="text-gray-300">·</span>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
              <FaClock className="w-2.5 h-2.5" />
              <span>{schedule.totalDurationFormatted}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className={cn(
                "text-[0.6rem] font-semibold border rounded-md px-1.5 py-0 uppercase tracking-wide",
                currentStatus.class
              )}
            >
              {currentStatus.label}
            </Badge>
            {schedule.status !== ScheduleStatusEnum.COMPLETED && (
              <AppointmentMenu schedule={schedule} />
            )}
          </div>
        </div>

        {/* Meio: Avatar + Nome */}
        <div className="flex items-center gap-2.5 px-3 pb-2">
          <StandardAvatar
            initials={schedule.customer.initials}
            className="h-9 w-9 shrink-0"
          />
          <span className="font-bold text-sm text-gray-800 truncate">
            {schedule.customer.nameFormatted}
          </span>
        </div>

        {/* Rodapé: Procedimentos + Preço */}
        <div className="flex items-center justify-between px-3 pt-1.5 border-t border-purple-50/60">
          <div className="flex flex-wrap items-center gap-1 min-w-0 flex-1 pr-2">
            {visibleProcedures.map((proc) => (
              <Badge
                key={proc.id}
                variant="secondary"
                className="bg-purple-50 text-purple-600 text-[0.6rem] border-purple-100 px-1.5 py-0.5 rounded-md leading-none"
              >
                {proc.name}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <span className="text-[0.6rem] text-purple-700 font-semibold self-center">
                +{remainingCount}
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-gray-800 shrink-0">
            {schedule.totalPriceFormatted}
          </span>
        </div>
      </Link>
    </Card>
  )
}
