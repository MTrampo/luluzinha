'use client'

import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { format, isBefore, isToday } from "date-fns"
import { generateServiceWeek } from "@/commons/utils/data"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/commons/lib/tw-merge"
import { ScheduleWeekDay } from "@/commons/models/schedule";
import { AppointmentSummaryCard } from "./appointment-summary-card";
import { AppointmentFeedbackEmpty } from "./feedback-empty";

const variants = cva(
  "w-16 h-20 p-2 flex flex-col items-center justify-center gap-1 rounded-lg transition cursor-pointer shrink-0",
  {
    variants: {
      state: {
        default: "bg-white text-muted-foreground hover:bg-primary/80 hover:text-primary-foreground",
        selected: "bg-primary text-primary-foreground border-primary",
        past: "bg-muted opacity-40 cursor-not-allowed",
      },
      bordered: {
        true: "border border-border",
        false: "",
      },
    },
    compoundVariants: [
      { state: "past", bordered: true, className: "border border-border" },
    ],
    defaultVariants: {
      state: "default",
      bordered: true,
    },
  }
)

export type DayCardProps = VariantProps<typeof variants> & { className?: string }

export function CardWeekDay({ initialSchedules }: { initialSchedules: ScheduleWeekDay[] }) {
  const today = new Date()
  const weekDays = generateServiceWeek()

  const [selectedDay, setSelectedDay] = useState<Date>(today)

  const appointments = initialSchedules.filter(s => {
    const sDate = new Date(s.startAtIso)
    return sDate.toDateString() === selectedDay.toDateString()
  })

  const availableWeekDays = weekDays
    .filter(day => !isBefore(day, today) || isToday(day))
    .map(day => {
      const formatted = format(day, "eee d", { locale: ptBR }).replace('.', '');
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    })
    .slice(0, 5)

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {weekDays.map((day) => {
          const isPast = isBefore(day, today) && !isToday(day)
          const isSelected = selectedDay.toDateString() === day.toDateString()
          const state = isPast ? "past" : isSelected ? "selected" : "default"

          const dayName = format(day, "eeeeee", { locale: ptBR })
          const dayNum = format(day, "d", { locale: ptBR })

          return (
            <div
              key={day.toDateString()}
              className={cn(variants({ state, bordered: true }))}
              onClick={() => !isPast && setSelectedDay(day)}
              role="button"
              aria-pressed={isSelected}
              tabIndex={isPast ? -1 : 0}
              aria-label={`${dayName} ${dayNum}`}
            >
              <span className="text-sm leading-none capitalize font-bold">{dayName}</span>
              <span className="font-black leading-none text-lg">{dayNum}</span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
        {appointments.length === 0 ? (
          <AppointmentFeedbackEmpty availableDays={availableWeekDays} />
        ) : (
          appointments.map((appointment) => (
            <AppointmentSummaryCard key={appointment.id} appointment={appointment} />
          ))
        )}
      </div>
    </>
  )
}