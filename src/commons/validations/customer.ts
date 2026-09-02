import * as z from "zod";
import { isIsoDateString } from "../utils/format";

export const customerFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(255, "Nome muito longo"),
  phone: z.string().min(14, "WhatsApp é obrigatório"),
  email: z.string().email("Formato de email inválido").optional().nullable().or(z.literal('')),
  birthday: z.string().optional().nullable().refine((val) => {
    if (!val || val.trim().length === 0) return true;
    return isIsoDateString(val);
  }, { message: "Data inválida" }),
  notes: z.string().optional().nullable(),
});
