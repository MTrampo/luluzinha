"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { procedureFormSchema } from "@/commons/validations/procedure"
import { ProcedureFormInputs, ProcedureFormatted } from "@/commons/models/procedure"
import { addProcedureAction, updateProcedureAction } from "@/actions/procedure"
import { formatCurrencyBRL } from "@/commons/utils/format"
import { convertMinutesToTime } from "@/commons/utils/helper"
import { toast } from "sonner"
import { useTransition } from "react"
import { HttpStatusEnum } from "@/commons/enums/http"
import { FaArrowsRotate } from "react-icons/fa6";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

type ServiceFormProps = {
  procedure?: ProcedureFormatted;
  onSuccess?: () => void;
}

export function ServiceForm({ procedure, onSuccess }: ServiceFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ProcedureFormInputs>({
    resolver: zodResolver(procedureFormSchema),
    defaultValues: {
      name: procedure?.nameFormatted ?? '',
      price: procedure?.priceFormatted ?? 'R$ 0,00',
      duration: procedure ? convertMinutesToTime(procedure.duration) : '00:30',
      description: procedure?.description ?? '',
    }
  })

  const onSubmit = (data: ProcedureFormInputs) => {
    startTransition(async () => {
      try {
        let response;
        if (procedure?.id) {
          response = await updateProcedureAction(procedure.id, data)
        } else {
          response = await addProcedureAction(data)
        }

        if (response.status === HttpStatusEnum.Created || response.status === HttpStatusEnum.Ok) {
          toast.success(response.message)
          if (!procedure) form.reset()
          if (onSuccess) onSuccess()
        } else {
          toast.error(response.message)
        }
      } catch (error) {
        toast.error("Ocorreu um erro inesperado. Tente novamente.")
      }
    })
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Nome do Procedimento</FieldLabel>
            <Input
              id="name"
              placeholder="Ex: Corte de cabelo"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="price"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="price">Preço</FieldLabel>
            <Input
              id="price"
              type="text"
              placeholder="R$ 0,00"
              {...field}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                const numericValue = Number(value) / 100
                field.onChange(formatCurrencyBRL(numericValue))
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="duration"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="duration">Duração</FieldLabel>
            <Input
              id="duration"
              type="time"
              placeholder="00:30"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes do procedimento..."
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="pt-4 flex justify-end gap-2">
        <Button type="submit" className="w-full" variant="theme" disabled={isPending}>
          {isPending ? <FaArrowsRotate className="mr-2 h-4 w-4 animate-spin" /> : null}
          {procedure ? 'Salvar Alterações' : 'Salvar Procedimento'}
        </Button>
      </div>
    </form>
  )
}
