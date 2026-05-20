import { z } from "zod";
import { Database, Tables } from "../types/database.types";
import { formatCaseName, formatDate, formatPhone } from "../utils/format";
import { establishmentInfoFormSchema } from "../validations/establishment";

export type EstablishmentSupabase = Tables<'establishments'>

export type EstablishmentUpdateInput = Partial<Omit<Database['public']['Tables']['establishments']['Update'], 'id' | 'owner_id' | 'subscription_id' | 'created_at' | 'updated_at'>>

export interface OpeningHour {
  open: string;
  close: string;
  closed: boolean;
}

export interface OpeningHours {
  mon: OpeningHour;
  tue: OpeningHour;
  wed: OpeningHour;
  thu: OpeningHour;
  fri: OpeningHour;
  sat: OpeningHour;
  sun: OpeningHour;
}

export type EstablishmentInfoFormValues = z.infer<typeof establishmentInfoFormSchema>

export interface EstablishmentFormatted {
  id: string;
  ownerId: string;
  subscriptionId: string | null;
  name: string;
  slug: string;
  avatarUrl: string | null;
  openingHours: OpeningHours | null;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  nameFormatted: string;
  phoneFormatted: string;
  createdAtFormatted: string;
  updatedAtFormatted: string;
}

export const establishmentFormatter = (data: EstablishmentSupabase): EstablishmentFormatted => {
  return {
    id: data.id,
    ownerId: data.owner_id,
    subscriptionId: data.subscription_id,
    name: data.name,
    slug: data.slug,
    avatarUrl: data.avatar_url,
    openingHours: data.opening_hours as OpeningHours | null,
    address: data.address,
    phone: data.phone,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
    nameFormatted: formatCaseName(data.name),
    phoneFormatted: formatPhone(data.phone),
    createdAtFormatted: formatDate(data.created_at),
    updatedAtFormatted: formatDate(data.updated_at),
  };
};

export const establishmentsFormatter = (data: EstablishmentSupabase[] | null): EstablishmentFormatted[] | null => {
  return data ? data.map(establishmentFormatter) : null;
};
