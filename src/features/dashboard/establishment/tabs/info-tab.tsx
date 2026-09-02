"use client"

import { useState, useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FaPaintbrush,
  FaArrowsRotate,
  FaCheck,
  FaPen,
  FaPhone,
  FaMapPin
} from "react-icons/fa6"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { toast } from "sonner"
import { updateEstablishmentAction } from "@/actions/establishment"
import {
  EstablishmentFormatted,
  EstablishmentInfoFormValues
} from "@/commons/models/establishment"
import { establishmentInfoFormSchema } from "@/commons/validations/establishment"
import { ESTABLISHMENT_AVAILABLE_ICONS } from "@/commons/constants/establishment"
import { EstablishmentIconMap } from "@/components/maps/status-map"
import { formatPhoneInput } from "@/commons/utils/format"
import { cn } from "@/commons/lib/tw-merge"

interface InfoTabProps {
  establishment: EstablishmentFormatted
}

export function InfoTab({ establishment }: InfoTabProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>(establishment.avatarUrl || "FaPaintbrush")
  const [isPending, startTransition] = useTransition()
  const [isEditingInfo, setIsEditingInfo] = useState(false)

  const { control, handleSubmit, reset } = useForm<EstablishmentInfoFormValues>({
    resolver: zodResolver(establishmentInfoFormSchema),
    defaultValues: {
      name: establishment.name || "",
      phone: establishment.phone ? formatPhoneInput(establishment.phone) : "",
      address: establishment.address || ""
    }
  })

  const handleCancelInfo = () => {
    reset({
      name: establishment.name || "",
      phone: establishment.phone ? formatPhoneInput(establishment.phone) : "",
      address: establishment.address || ""
    })
    setSelectedIcon(establishment.avatarUrl || "FaPaintbrush")
    setIsEditingInfo(false)
  }

  const onSubmitInfo = (values: EstablishmentInfoFormValues) => {
    startTransition(async () => {
      try {
        const response = await updateEstablishmentAction(establishment.id, {
          name: values.name,
          phone: values.phone.replace(/\D/g, ""),
          address: values.address || null,
          avatar_url: selectedIcon
        })

        if (response.status === 200) {
          toast.success("Dados do seu espaço atualizados com sucesso!")
          setIsEditingInfo(false)
        } else {
          toast.error(response.message || "Erro ao salvar as informações.")
        }
      } catch {
        toast.error("Ocorreu um erro inesperado. Tente novamente.")
      }
    })

  }

  const SelectedIconComponent = EstablishmentIconMap[selectedIcon] || FaPaintbrush

  if (!isEditingInfo) {
    return (
      <div className="border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 space-y-6">
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <h3 className="text-lg font-bold text-purple-900">Dados Gerais</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditingInfo(true)}
            className="border-purple-150 text-purple-700 hover:bg-purple-50/50 hover:text-purple-800 transition-all rounded-lg flex items-center gap-2"
          >
            <FaPen className="text-xs" />
            Editar Informações
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-purple-50">
            <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center border border-purple-100 shadow-sm shrink-0">
              <SelectedIconComponent className="text-3xl" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider block">
                Nome do Espaço
              </span>
              <h4 className="text-base font-bold text-purple-950">
                {establishment.name || "Sem nome cadastrado"}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 flex items-start gap-3">
              <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mt-0.5 shrink-0">
                <FaPhone className="text-xs" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider block">
                  Telefone Comercial
                </span>
                <p className="text-sm font-semibold text-purple-950">
                  {establishment.phone ? formatPhoneInput(establishment.phone) : "Não informado"}
                </p>
              </div>
            </div>

            <div className="space-y-1 flex items-start gap-3">
              <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mt-0.5 shrink-0">
                <FaMapPin className="text-xs" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider block">
                  Endereço de Atendimento
                </span>
                <p className="text-sm font-semibold text-purple-950">
                  {establishment.address || "Sem endereço cadastrado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmitInfo)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 space-y-6">
        <h3 className="text-lg font-bold text-purple-900 border-b border-purple-50 pb-2">
          Editar Informações
        </h3>

        <div className="space-y-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Nome do Espaço</FieldLabel>
                <Input
                  id="name"
                  placeholder="Ex: Espaço da Lulu"
                  className="bg-white border-purple-100 rounded-lg focus-visible:ring-purple-200"
                  {...field}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Telefone Comercial</FieldLabel>
                  <Input
                    id="phone"
                    placeholder="Ex: (11) 99999-9999"
                    className="bg-white border-purple-100 rounded-lg focus-visible:ring-purple-200"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            control={control}
            name="address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address">Endereço de Atendimento</FieldLabel>
                <Input
                  id="address"
                  placeholder="Ex: Rua das Rosas, 123 - Sala 2, São Paulo - SP"
                  className="bg-white border-purple-100 rounded-lg focus-visible:ring-purple-200"
                  {...field}
                  value={field.value || ""}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="pt-4 border-t border-purple-50 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancelInfo}
            className="px-5 rounded-lg font-semibold hover:bg-gray-100"
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="theme"
            className="px-6 py-5 rounded-lg font-bold flex items-center gap-2 shadow-sm"
            disabled={isPending}
          >
            {isPending ? <FaArrowsRotate className="h-4 w-4 animate-spin" /> : null}
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      <div className="border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center space-y-6">
        <div>
          <h3 className="text-lg font-bold text-purple-900">Escolha o Ícone</h3>
          <p className="text-xs text-gray-500 mt-1">
            Selecione um ícone para representar sua vitrine no seu espaço digital.
          </p>
        </div>

        <div className="h-24 w-24 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full flex items-center justify-center border-2 border-purple-200 shadow-inner transition-colors duration-300">
          <SelectedIconComponent className="text-4xl animate-wiggle" />
        </div>

        <div className="w-full">
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest text-left mb-3">
            Disponíveis:
          </p>
          <div className="grid grid-cols-5 gap-2">
            {ESTABLISHMENT_AVAILABLE_ICONS.map((ico) => {
              const IconItem = ico.component
              const isSelected = selectedIcon === ico.name

              return (
                <button
                  key={ico.name}
                  type="button"
                  onClick={() => setSelectedIcon(ico.name)}
                  className={cn(
                    "relative p-2.5 rounded-lg border flex items-center justify-center transition-all duration-200 hover:scale-105",
                    isSelected
                      ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100"
                      : "bg-white border-purple-50 text-purple-500 hover:bg-purple-50/50 hover:border-purple-200"
                  )}
                  title={ico.label}
                >
                  <IconItem className="text-base" />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-1 border border-white">
                      <FaCheck className="text-[6px]" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </form>
  )
}
