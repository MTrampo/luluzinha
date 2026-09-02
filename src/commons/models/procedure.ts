import { Database } from "@/commons/types/database.types";
import { formatCaseName, formatCurrencyBRL, formatDate, formatDuration } from "../utils/format";
import { z } from "zod";
import { procedureFormSchema } from "@/commons/validations/procedure";

export type ProcedureSupabase = Database['public']['Tables']['procedures']['Row']
export type ProcedureInsertPayload = Database['public']['Tables']['procedures']['Insert']
export type ProcedureUpdatePayload = Database['public']['Tables']['procedures']['Update']
export type ProcedureFormInputs = z.infer<typeof procedureFormSchema>

export interface ProcedureFormatted {
  id: string;
  establishmentId: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  nameFormatted: string;
  priceFormatted: string;
  durationFormatted: string;
  createdAtFormatted: string;
}

export const procedureFormatter = (data: ProcedureSupabase): ProcedureFormatted => {
  return {
    id: data.id,
    establishmentId: data.establishment_id,
    name: data.name,
    description: data.description,
    duration: data.duration,
    price: data.price,
    isActive: data.is_active ?? false,
    createdAt: data.created_at ?? '',
    updatedAt: data.updated_at,
    nameFormatted: formatCaseName(data.name),
    priceFormatted: formatCurrencyBRL(data.price),
    durationFormatted: formatDuration(data.duration),
    createdAtFormatted: formatDate(data.created_at),
  };
};

export const proceduresFormatter = (data: ProcedureSupabase[] | null): ProcedureFormatted[] | null => {
  return data ? data.map(procedureFormatter) : null;
};
