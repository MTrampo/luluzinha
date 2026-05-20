import { z } from "zod";

export const establishmentInfoFormSchema = z.object({
    name: z.string().min(3, "O nome da sua bancada precisa ter pelo menos 3 caracteres."),
    phone: z.string().min(10, "Informe um telefone válido com DDD.").max(15, "Informe um telefone válido."),
    address: z.string().min(5, "Informe o endereço da sua bancada.").nullable().or(z.literal(""))
})