import { cn } from "@/commons/lib/tw-merge"
import { cva } from "class-variance-authority"
import { ScheduleWeekDay } from "@/commons/models/schedule"
import { formatScheduleStatus } from "@/commons/enums/schedule"
import { statusMap } from "@/components/maps/status-map"
import Link from "next/link"

const appointmentCardVariants = cva(
  "p-3 rounded-lg border transition cursor-pointer shadow-sm hover:shadow-md duration-300 bg-white",
  {
    variants: {
      state: {
        active: "border-l-4 border-y-border border-r-border",
        past: "opacity-40 cursor-not-allowed border-border bg-muted/30 hover:shadow-sm border-l-4",
      },
    },
    defaultVariants: {
      state: "active",
    },
  }
)

interface AppointmentSummaryCardProps {
  appointment: ScheduleWeekDay
}

export function AppointmentSummaryCard({ appointment }: AppointmentSummaryCardProps) {
  const now = new Date()
  const scheduled = new Date(appointment.startAtIso)
  const isPast = scheduled < now
  const state = isPast ? "past" : "active"
  const currentStatus = statusMap[appointment.status]

  return (
    <Link
      href={`/painel/agenda/atendimento/${appointment.id}`}
      className={cn(
        appointmentCardVariants({ state }),
        !isPast && currentStatus?.border,
        "block"
      )}
      tabIndex={isPast ? -1 : 0}
      aria-label={`Agendamento de ${appointment.customerName} às ${appointment.startTime}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-600 border border-purple-100">
          {appointment.startTime}
        </span>
        <span className={cn(
          "text-[10px] uppercase font-black tracking-wider",
          isPast ? "text-muted-foreground/60" : currentStatus?.class.replace(/bg-\S+/, "").trim()
        )}>
          {formatScheduleStatus(appointment.status)}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="capitalize text-sm font-black text-purple-900 line-clamp-1">
          {appointment.customerName}
        </p>
        <p className="text-[11px] font-medium text-gray-500">
          {appointment.proceduresCount} {appointment.proceduresCount === 1 ? 'Procedimento' : 'Procedimentos'}
        </p>
      </div>
    </Link>
  )
}
