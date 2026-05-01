import { z } from "zod";
import { parseCurrencyBRLToNumber } from "../utils/helper";


export const procedureFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  price: z.string().refine((val) => parseCurrencyBRLToNumber(val) >= 1, "O preço deve ser maior ou igual a R$ 1,00"),
  duration: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido (HH:mm)")
    .refine((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return (hours * 60 + minutes) >= 30;
    }, "A duração mínima é de 30 minutos"),
  description: z.string().optional(),
});
