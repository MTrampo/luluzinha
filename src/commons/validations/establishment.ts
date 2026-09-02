import { z } from "zod";

export const establishmentInfoFormSchema = z.object({
  name: z.string().min(3, "O nome do seu espaço precisa ter pelo menos 3 caracteres."),
  phone: z.string().min(10, "Informe um telefone válido com DDD.").max(15, "Informe um telefone válido."),
  address: z.string().min(5, "Informe o endereço do seu espaço.").nullable().or(z.literal(""))
})

export const onboardingEstablishmentFormSchema = z.object({
  name: z.string().trim().min(3, "O nome do seu espaço precisa ter pelo menos 3 caracteres."),
  slug: z.string().trim().min(3, "O link do seu espaço deve ter pelo menos 3 caracteres.")
    .regex(/^[a-z0-9-]+$/, "O link só pode conter letras minúsculas, números e traços."),
  avatarUrl: z.string().min(1, "Selecione um ícone para seu espaço."),
  phone: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal(""))
});