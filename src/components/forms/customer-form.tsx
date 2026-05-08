"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { toast } from "sonner"
import { useTransition } from "react"
import { customerFormSchema } from "@/commons/validations/customer"
import { CustomerFormInputs, CustomerFormatted } from "@/commons/models/customer"
import { addCustomerAction, updateCustomerAction } from "@/actions/customer"
import { DatePickerField } from "@/components/inputs/date-picker-field"

interface CustomerFormProps {
  customer?: CustomerFormatted;
  onSuccess?: () => void;
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<CustomerFormInputs>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer?.name || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
      birthday: customer?.birthday || "",
      notes: customer?.notes || "",
    },
  })

  const onSubmit = (data: CustomerFormInputs) => {
    startTransition(async () => {
      try {
        const response = customer 
          ? await updateCustomerAction(customer.id, data)
          : await addCustomerAction(data);

        if (response.status === 200 || response.status === 201) {
          toast.success(response.message);
          form.reset();
          onSuccess?.();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Ocorreu um erro ao salvar os dados da Poderosa.");
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 gap-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Nome da Poderosa*</FieldLabel>
              <Input
                id="name"
                placeholder="Ex: Luh Santos"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">WhatsApp*</FieldLabel>
                <Input
                  id="phone"
                  type="text"
                  placeholder="(00) 00000-0000"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "");
                    if (val.length > 11) val = val.slice(0, 11);
                    
                    let formatted = val;
                    if (val.length > 0) {
                      formatted = "(" + val.slice(0, 2);
                      if (val.length > 2) {
                        formatted += ") " + val.slice(2, 7);
                        if (val.length > 7) {
                          formatted += "-" + val.slice(7);
                        }
                      }
                    }
                    field.onChange(formatted);
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="birthday"
            render={({ field, fieldState }) => (
              <DatePickerField
                field={field}
                fieldState={fieldState}
                label="Aniversário"
                id="birthday"
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="cliente@email.com"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="notes"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="notes">Anotações Importantes</FieldLabel>
              <Textarea
                id="notes"
                placeholder="Alergias, preferências, observações..."
                className="min-h-24"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 rounded-xl"
          disabled={isPending}
        >
          {customer ? "Salvar Alterações" : "Cadastrar Poderosa"}
        </Button>
      </div>
    </form>
  )
}
