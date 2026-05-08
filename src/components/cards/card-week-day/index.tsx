'use client'

import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { format, isBefore, isToday } from "date-fns"
import { generateServiceWeek } from "@/commons/utils/data"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/commons/lib/tw-merge"

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

const detailVariants = cva(
  "p-3 rounded-lg border transition cursor-pointer shadow-sm hover:shadow-md",
  {
    variants: {
      state: {
        default: "border-border bg-card",
        active: "border-l-4 border-primary bg-card border-y-border border-r-border",
        past: "opacity-40 cursor-not-allowed border-border bg-muted/30 hover:shadow-sm",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export function CardWeekDay() {
  const today = new Date()
  const weekDays = generateServiceWeek()

  const [selectedDay, setSelectedDay] = useState<Date>(today)

  type Service = {
    id: number
    title: string
    count: number
    scheduledAt: string // ISO string placeholder
  }

  // Placeholder: build services for the selected day (replace with real data later)
  function getServicesForDay(day: Date): Service[] {
    const base = new Date(day)

    const svc1 = new Date(base)
    svc1.setHours(9, 30, 0, 0)

    const svc2 = new Date(base)
    svc2.setHours(10, 0, 0, 0)

    const svc3 = new Date(base)
    svc3.setHours(11, 30, 0, 0)

    const svc4 = new Date(base)
    svc4.setHours(13, 30, 0, 0)

    return [
      { id: 1, title: "Bibia", count: 2, scheduledAt: svc1.toISOString() },
      { id: 2, title: "Outro Cliente", count: 1, scheduledAt: svc2.toISOString() },
      { id: 3, title: "Outro Cliente 2", count: 2, scheduledAt: svc3.toISOString() },
      { id: 4, title: "Outro Cliente 3", count: 1, scheduledAt: svc4.toISOString() },
      { id: 5, title: "Outro Cliente 4", count: 3, scheduledAt: svc4.toISOString() },
      { id: 6, title: "Outro Cliente 5", count: 1, scheduledAt: svc4.toISOString() },
      { id: 7, title: "Outro Cliente 6", count: 2, scheduledAt: svc4.toISOString() },
      { id: 8, title: "Outro Cliente 7  ", count: 1, scheduledAt: svc4.toISOString() },
    ]
  }

  const services = getServicesForDay(selectedDay)

  function ServiceCard({ svc }: { svc: Service }) {
    const now = new Date()
    const scheduled = new Date(svc.scheduledAt)
    const serviceIsPast = scheduled < now
    const state = serviceIsPast ? "past" : "active"
    const timeLabel = format(scheduled, "HH:mm", { locale: ptBR })

    return (
      <div
        key={svc.id}
        className={cn(detailVariants({ state }))}
        onClick={() => !serviceIsPast && setSelectedDay(new Date(scheduled))}
        role="button"
        tabIndex={serviceIsPast ? -1 : 0}
        aria-pressed={!serviceIsPast}
        aria-label={`Serviço ${svc.title} às ${timeLabel}`}
      >
        <div className="mb-2">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {timeLabel}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="capitalize text-sm font-semibold text-foreground line-clamp-1">{svc.title}</p>
          <p className="text-xs text-muted-foreground">
            {svc.count} {svc.count === 1 ? 'serviço agendado' : 'serviços agendados'}
          </p>
        </div>
      </div>
    )
  }

  const dayIsPast = isBefore(selectedDay, today) && !isToday(selectedDay)

  return (
    <>
      <div className="flex gap-2">
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
              <span className="text-sm leading-none capitalize">{dayName}</span>
              <span className="font-medium leading-none">{dayNum}</span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {services.length === 0 ? (
          <div className={cn(detailVariants({ state: dayIsPast ? "past" : "default" }), "flex flex-col items-center justify-center text-center py-8")}>
            <p className="text-sm font-medium text-foreground">
              Nenhum serviço agendado
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(selectedDay, "d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        ) : (
          services.map((svc) => <ServiceCard key={svc.id} svc={svc} />)
        )}
      </div>
    </>
  )
}