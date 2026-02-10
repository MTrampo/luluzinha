'use client'

import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { format, isBefore, isToday } from "date-fns"
import { generateServiceWeek } from "@/commons/utils/data"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/commons/lib/tw-merge"

const variants = cva(
  "p-5 flex flex-col items-center justify-center gap-0.5 rounded-lg transition cursor-pointer",
  {
    variants: {
      state: {
        default: "bg-gray-200 text-gray-600 hover:bg-violet-400 hover:text-white",
        selected: "bg-violet-600 text-white border-violet-800",
        past: "bg-gray-200 opacity-40 cursor-not-allowed",
      },
      bordered: {
        true: "border border-gray-300",
        false: "",
      },
    },
    compoundVariants: [
      { state: "past", bordered: true, className: "border border-gray-300" },
    ],
    defaultVariants: {
      state: "default",
      bordered: true,
    },
  }
)

export type DayCardProps = VariantProps<typeof variants> & { className?: string }

const detailVariants = cva(
  "p-3 rounded-e border transition cursor-pointer",
  {
    variants: {
      state: {
        default: "border border-gray-300",
        active: "border-l-8 border-violet-500 bg-violet-50",
        past: "opacity-40 cursor-not-allowed border border-gray-300",
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
        <p className="text-xs text-gray-500">{timeLabel}</p>
        <div className="my-2">
          <p className="capitalize font-bold text-gray-600">{svc.title}</p>
          <p className="text-gray-500">{svc.count} serviços agendados</p>
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
          <div className={cn(detailVariants({ state: dayIsPast ? "past" : "default" }))}>
            <p className="text-xs text-gray-500">{format(selectedDay, "d MMM yyyy", { locale: ptBR })}</p>
            <div className="my-2">
              <h3 className="capitalize text-gray-600">Nenhum serviço</h3>
            </div>
          </div>
        ) : (
          services.map((svc) => <ServiceCard key={svc.id} svc={svc} />)
        )}
      </div>
    </>
  )
}