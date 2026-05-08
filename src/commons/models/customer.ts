import { Database } from "@/commons/types/database.types";
import { formatCaseName, formatDate, formatPhone } from "../utils/format";
import { z } from "zod";
import { customerFormSchema } from "@/commons/validations/customer";
import { getInitials, checkIsBirthdayToday } from "../utils/helper";

export type CustomerSupabase = Database['public']['Tables']['customers']['Row']
export type CustomerInsertPayload = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdatePayload = Database['public']['Tables']['customers']['Update']
export type CustomerFormInputs = z.infer<typeof customerFormSchema>

export interface CustomerFormatted {
  id: string;
  establishmentId: string;
  name: string;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  initials: string;
  nameFormatted: string;
  phoneFormatted: string;
  birthdayFormatted: string;
  isBirthdayToday: boolean;
  hasNotes: boolean;
  waLink: string | null;
}

export const customerFormatter = (data: CustomerSupabase): CustomerFormatted => {
  return {
    id: data.id,
    establishmentId: data.establishment_id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    birthday: data.birthday,
    notes: data.notes,
    createdAt: data.created_at ?? '',
    updatedAt: data.updated_at,
    initials: getInitials(data.name),
    nameFormatted: formatCaseName(data.name),
    phoneFormatted: formatPhone(data.phone),
    birthdayFormatted: formatDate(data.birthday),
    isBirthdayToday: checkIsBirthdayToday(data.birthday),
    hasNotes: !!data.notes && data.notes.trim().length > 0,
    waLink: data.phone ? `https://wa.me/55${data.phone}` : null,
  };
};

export const customersFormatter = (data: CustomerSupabase[] | null): CustomerFormatted[] | null => {
  return data ? data.map(customerFormatter) : null;
};
