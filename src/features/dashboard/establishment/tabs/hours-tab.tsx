"use client"

import { useState, useTransition } from "react"
import { FaArrowsRotate, FaPen } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updateEstablishmentAction } from "@/actions/establishment"
import { OpeningHours, OpeningHour } from "@/commons/models/establishment"
import {
  ESTABLISHMENT_DAY_LABELS,
  ESTABLISHMENT_WEEKDAY_ORDER
} from "@/commons/constants/establishment"
import { cn } from "@/commons/lib/tw-merge"
import { Json } from "@/commons/types/database.types"

interface HoursTabProps {
  establishmentId: string
  hours: OpeningHours
  setHours: React.Dispatch<React.SetStateAction<OpeningHours>>
}

export function HoursTab({ establishmentId, hours, setHours }: HoursTabProps) {
  const [isHoursPending, startHoursTransition] = useTransition()
  const [isEditingHours, setIsEditingHours] = useState(false)
  const [hoursBackup, setHoursBackup] = useState<OpeningHours | null>(null)

  const handleStartEditing = () => {
    setHoursBackup(hours)
    setIsEditingHours(true)
  }

  const handleCancel = () => {
    if (hoursBackup) {
      setHours(hoursBackup)
    }
    setIsEditingHours(false)
  }

  const validateHours = (): boolean => {
    for (const dayKey of ESTABLISHMENT_WEEKDAY_ORDER) {
      const dayConfig = hours[dayKey]
      if (dayConfig && !dayConfig.closed) {
        const [openH, openM] = dayConfig.open.split(":").map(Number)
        const [closeH, closeM] = dayConfig.close.split(":").map(Number)

        const openVal = openH * 60 + openM
        const closeVal = closeH * 60 + closeM

        if (closeVal <= openVal) {
          toast.error(
            `O horário de término da ${ESTABLISHMENT_DAY_LABELS[dayKey]} precisa ser após o horário de início.`
          )
          return false
        }
      }
    }
    return true
  }

  const onSubmitHours = () => {
    if (!validateHours()) return

    startHoursTransition(async () => {
      try {
        const response = await updateEstablishmentAction(establishmentId, {
          opening_hours: hours as unknown as Json
        })

        if (response.status === 200) {
          toast.success("Horários de funcionamento atualizados com sucesso!")
          setIsEditingHours(false)
        } else {
          toast.error(response.message || "Erro ao salvar os horários.")
        }
      } catch {
        toast.error("Ocorreu um erro inesperado. Tente novamente.")
      }
    })

  }

  return (
    <div className="border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-purple-50 pb-3 gap-2">
        <div>
          <h3 className="text-lg font-bold text-purple-900">Horários do Espaço</h3>
          <p className="text-xs text-gray-500 mt-1">
            Dias e horários em que sua agenda de atendimentos está aberta para marcações.
          </p>
        </div>

        {!isEditingHours ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleStartEditing}
            className="border-purple-150 text-purple-700 hover:bg-purple-50/50 hover:text-purple-800 transition-all rounded-lg flex items-center gap-2"
          >
            <FaPen className="text-xs" />
            Editar Horários
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="px-4 rounded-lg font-semibold hover:bg-gray-100"
              disabled={isHoursPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="theme"
              onClick={onSubmitHours}
              className="px-5 rounded-lg font-bold flex items-center gap-2 shadow-sm"
              disabled={isHoursPending}
            >
              {isHoursPending ? <FaArrowsRotate className="h-4 w-4 animate-spin" /> : null}
              {isHoursPending ? "Salvando..." : "Salvar Horários"}
            </Button>
          </div>
        )}
      </div>

      <div className="divide-y divide-purple-50">
        {ESTABLISHMENT_WEEKDAY_ORDER.map((dayKey) => {
          const dayConfig: OpeningHour = hours[dayKey] || { open: "08:00", close: "18:00", closed: false }

          const handleToggle = (checked: boolean) => {
            if (!isEditingHours) return
            setHours((prev) => ({
              ...prev,
              [dayKey]: {
                ...prev[dayKey],
                closed: !checked
              }
            }))
          }

          const handleTimeChange = (type: "open" | "close", value: string) => {
            if (!isEditingHours) return
            setHours((prev) => ({
              ...prev,
              [dayKey]: {
                ...prev[dayKey],
                [type]: value
              }
            }))
          }

          return (
            <div
              key={dayKey}
              className={cn(
                "py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors",
                dayConfig.closed ? "bg-gray-50/30 opacity-70" : "bg-transparent"
              )}
            >
              <div className="flex items-center justify-between md:justify-start gap-4 md:w-1/3">
                <div className="w-28 font-bold text-sm text-purple-900">
                  {ESTABLISHMENT_DAY_LABELS[dayKey]}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!dayConfig.closed}
                    onCheckedChange={handleToggle}
                    disabled={!isEditingHours}
                    className="data-[state=checked]:bg-purple-600 disabled:opacity-80"
                  />
                  <span className="text-xs text-gray-500 font-semibold w-14">
                    {!dayConfig.closed ? "Aberto" : "Fechado"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full md:w-2/3 md:justify-end">
                {isEditingHours ? (
                  !dayConfig.closed ? (
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full">
                      <div className="flex items-center gap-1 sm:gap-1.5 flex-1 sm:flex-initial">
                        <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">Início</span>
                        <Input
                          type="time"
                          value={dayConfig.open}
                          onChange={(e) => handleTimeChange("open", e.target.value)}
                          className="bg-white border-purple-100 rounded-lg w-full sm:w-28 h-9 text-xs focus-visible:ring-purple-200"
                        />
                      </div>
                      <span className="text-gray-300 shrink-0">—</span>
                      <div className="flex items-center gap-1 sm:gap-1.5 flex-1 sm:flex-initial">
                        <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">Término</span>
                        <Input
                          type="time"
                          value={dayConfig.close}
                          onChange={(e) => handleTimeChange("close", e.target.value)}
                          className="bg-white border-purple-100 rounded-lg w-full sm:w-28 h-9 text-xs focus-visible:ring-purple-200"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic font-medium py-2">
                      Descanso da Luluzinha
                    </span>
                  )
                ) : (
                  !dayConfig.closed ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50/50 text-purple-700 border border-purple-100/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                      Das {dayConfig.open} às {dayConfig.close}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-400 border border-gray-100">
                      Fechado para descanso
                    </span>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
