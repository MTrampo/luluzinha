import { z } from "zod";

export const blockScheduleSchema = z.object({
  reasonSelect: z.string().min(1, "Selecione um motivo"),
  reasonCustom: z.string().optional(),
  isAllDay: z.boolean(),
  startTime: z.string().min(1, "Início obrigatório"),
  endTime: z.string().min(1, "Fim obrigatório"),
  isRecurring: z.boolean(),
  date: z.string().optional(),
})