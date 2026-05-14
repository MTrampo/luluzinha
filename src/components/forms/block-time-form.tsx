"use client"

import { useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FaLock, FaClock, FaRepeat, FaArrowsRotate } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { createEstablishmentBlockAction } from "@/actions/establishment-blocks"
import { toast } from "sonner"
import { HttpStatusEnum } from "@/commons/enums/http"
import { cn } from "@/commons/lib/tw-merge"
import { Switch } from "@/components/ui/switch"
import { BlockScheduleFormValues } from "@/commons/models/schedule"
import { blockScheduleSchema } from "@/commons/validations/schedule"
import { useProfileStore } from "@/store/use-profile"

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
  const profile = useProfileStore((state) => state.profile)
  const [isPending, startTransition] = useTransition()

  const form = useForm<BlockScheduleFormValues>({
    resolver: zodResolver(blockScheduleSchema),
    defaultValues: {
      reasonSelect: "Almoço",
      reasonCustom: "",
      isAllDay: false,
      startTime: "12:00",
      endTime: "13:00",
      isRecurring: false,
    },
  })

  const watchReason = form.watch("reasonSelect")
  const watchAllDay = form.watch("isAllDay")

  const onSubmit = (values: BlockScheduleFormValues) => {
    startTransition(async () => {
      try {
        const response = await createEstablishmentBlockAction({
          ...values,
          date: format(selectedDate, 'yyyy-MM-dd')
        }, profile?.id!)

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
              <select
                id="reasonSelect"
                className={cn(
                  "border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  "bg-purple-50/50 border-purple-100 cursor-pointer"
                )}
                {...field}
              >
                {PREDEFINED_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
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
                  <Input type="time" id="startTime" className="bg-white border-purple-100" {...field} />
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
                  <Input type="time" id="endTime" className="bg-white border-purple-100" {...field} />
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
      <Controller
        control={form.control}
        name="isRecurring"
        render={({ field }) => (
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-purple-100 p-4 bg-white shadow-sm">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <div className="space-y-1 leading-none">
              <label className="text-sm font-bold text-purple-900 flex items-center gap-2 cursor-pointer">
                <FaRepeat className="text-purple-400 text-xs" />
                Repetir Semanalmente
              </label>
              <p className="text-xs text-gray-500">
                Bloquear todas as {format(selectedDate, "eeee", { locale: ptBR })}s neste horário.
              </p>
            </div>
          </div>
        )}
      />

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
