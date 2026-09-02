"use client"

import { useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, isBefore, startOfDay, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FaLock, FaClock, FaRepeat, FaArrowsRotate } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { createScheduleBlockAction } from "@/actions/schedule-blocks"
import { toast } from "sonner"
import { HttpStatusEnum } from "@/commons/enums/http"
import { BlockRecurringTypeEnum } from "@/commons/enums/schedule"
import { cn } from "@/commons/lib/tw-merge"
import { Switch } from "@/components/ui/switch"
import { BlockScheduleFormValues } from "@/commons/models/schedule"
import { blockScheduleSchema } from "@/commons/validations/schedule"

type BlockTimeFormProps = {
  selectedDate: Date
  onSuccess: () => void
}

const PREDEFINED_REASONS = [
  { value: "Almoço", label: "Almoço" },
  { value: "Médico", label: "Médico / Saúde" },
  { value: "Compromisso Particular", label: "Compromisso Particular" },
  { value: "Curso", label: "Curso / Treinamento" },
  { value: "other", label: "Outro motivo..." },
]

export function BlockTimeForm({ selectedDate, onSuccess }: BlockTimeFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<BlockScheduleFormValues>({
    resolver: zodResolver(blockScheduleSchema),
    defaultValues: {
      reasonSelect: "Almoço",
      reasonCustom: "",
      isAllDay: false,
      startTime: "12:00",
      endTime: "13:00",
      recurringType: BlockRecurringTypeEnum.NONE,
    },
  })

  const watchReason = form.watch("reasonSelect")
  const watchAllDay = form.watch("isAllDay")

  const onSubmit = (values: BlockScheduleFormValues) => {
    if (isBefore(startOfDay(selectedDate), startOfDay(new Date()))) {
      toast.error("Não é possível bloquear dias que já passaram.")
      return
    }

    if (!values.isAllDay && isToday(selectedDate)) {
      const [hours, minutes] = values.startTime.split(':');
      const selectedTimeDate = new Date();
      selectedTimeDate.setHours(Number(hours), Number(minutes), 0, 0);

      if (isBefore(selectedTimeDate, new Date())) {
        toast.error("Não é possível bloquear um horário que já passou.")
        return
      }
    }

    if (!values.isAllDay) {
      const [startH, startM] = values.startTime.split(':');
      const [endH, endM] = values.endTime.split(':');
      const startTotal = Number(startH) * 60 + Number(startM);
      const endTotal = Number(endH) * 60 + Number(endM);

      if (endTotal <= startTotal) {
        toast.error("O horário de término deve ser após o horário de início.")
        return
      }
    }

    startTransition(async () => {
      try {
        const response = await createScheduleBlockAction({
          ...values,
          date: format(selectedDate, 'yyyy-MM-dd')
        })

        if (response.status === HttpStatusEnum.Ok || response.status === HttpStatusEnum.Created) {
          toast.success("Horário bloqueado com sucesso!")
          onSuccess()
        } else {
          toast.error(response.message || "Erro ao bloquear horário.")
        }
      } catch (error) {
        toast.error("Ocorreu um erro inesperado. Tente novamente.")
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
      <div className="space-y-4">
        <Controller
          control={form.control}
          name="reasonSelect"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reasonSelect">Por que você vai bloquear?</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="reasonSelect" className="bg-purple-50/50 border-purple-100 w-full">
                  <SelectValue placeholder="Selecione um motivo" />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {watchReason === "other" && (
          <Controller
            control={form.control}
            name="reasonCustom"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  placeholder="Descreva o motivo..."
                  className="bg-white border-purple-100"
                  {...field}
                  value={field.value || ""}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}
      </div>

      {/* Período */}
      <div className="bg-purple-50/30 p-4 rounded-lg border border-purple-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaClock className="text-purple-400" />
            <span className="text-sm font-bold text-purple-900">Configuração do Tempo</span>
          </div>
          <Controller
            control={form.control}
            name="isAllDay"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Dia Todo</span>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </div>

        {!watchAllDay && (
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="startTime"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="startTime" className="text-[10px] uppercase font-black text-purple-400 tracking-wider">Início</FieldLabel>
                  <Input type="time" id="startTime" step="1" className="bg-white border-purple-100" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="endTime"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="endTime" className="text-[10px] uppercase font-black text-purple-400 tracking-wider">Término</FieldLabel>
                  <Input type="time" id="endTime" step="1" className="bg-white border-purple-100" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        )}

        <div className="text-[11px] text-gray-500 italic">
          Bloqueio para: {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
        </div>
      </div>

      {/* Recorrência */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest px-1">Recorrência</h4>
        <Controller
          control={form.control}
          name="recurringType"
          render={({ field }) => (
            <RadioGroup
              value={field.value.toString()}
              onValueChange={(val) => field.onChange(parseInt(val))}
              className="grid grid-cols-1 gap-2"
            >
              {/* Opção 0: Não se repete */}
              <div className={cn(
                "flex items-center gap-3 rounded-xl border p-3 transition-all cursor-pointer",
                field.value === BlockRecurringTypeEnum.NONE ? "border-purple-200 bg-purple-50/50" : "border-gray-100 bg-white"
              )}>
                <RadioGroupItem value={BlockRecurringTypeEnum.NONE.toString()} id="none" className="text-purple-600 border-purple-200" />
                <Label htmlFor="none" className="flex-1 cursor-pointer">
                  <span className="block text-sm font-bold text-gray-700">Não se repete</span>
                  <span className="block text-[10px] text-gray-400 uppercase font-medium">Apenas para {format(selectedDate, "dd/MM")}</span>
                </Label>
              </div>

              {/* Opção 1: Diária */}
              <div className={cn(
                "flex items-center gap-3 rounded-xl border p-3 transition-all cursor-pointer",
                field.value === BlockRecurringTypeEnum.DAILY ? "border-purple-600 bg-purple-50 shadow-sm" : "border-gray-100 bg-white"
              )}>
                <RadioGroupItem value={BlockRecurringTypeEnum.DAILY.toString()} id="daily" className="text-purple-600 border-purple-200" />
                <Label htmlFor="daily" className="flex-1 cursor-pointer">
                  <span className="block text-sm font-bold text-gray-700">Repetir Diariamente</span>
                  <span className="block text-[10px] text-gray-400 font-medium">Bloquear todos os dias neste horário</span>
                </Label>
              </div>

              {/* Opção 2: Semanal */}
              <div className={cn(
                "flex items-center gap-3 rounded-xl border p-3 transition-all cursor-pointer",
                field.value === BlockRecurringTypeEnum.WEEKLY ? "border-purple-600 bg-purple-50 shadow-sm" : "border-gray-100 bg-white"
              )}>
                <RadioGroupItem value={BlockRecurringTypeEnum.WEEKLY.toString()} id="weekly" className="text-purple-600 border-purple-200" />
                <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                  <span className="block text-sm font-bold text-gray-700">Repetir Semanalmente</span>
                  <span className="block text-[10px] text-gray-400 font-medium">Toda {format(selectedDate, "eeee", { locale: ptBR })}</span>
                </Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <Button
        type="submit"
        variant="theme"
        className="w-full font-bold py-6 rounded-xl shadow-md shadow-purple-100"
        disabled={isPending}
      >
        {isPending ? <FaArrowsRotate className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isPending ? "Bloqueando..." : "Confirmar Bloqueio"}
      </Button>
    </form>
  )
}
