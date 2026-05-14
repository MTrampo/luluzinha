import { z } from "zod";
import { customerFormatter, CustomerFormatted } from "./customer";
import { procedureFormatter, ProcedureSupabase } from "./procedure";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScheduleStatusEnum, formatScheduleStatus } from "@/commons/enums/schedule";
import { Database } from "@/commons/types/database.types";
import { blockScheduleSchema } from "../validations/schedule";
import { formatCurrencyBRL, formatDuration } from "../utils/format";

export interface ScheduleProcedureFormatted extends ProcedureSupabase {
  priceAtTime: number;
  priceAtTimeFormatted: string;
  durationAtTime: number;
  durationAtTimeFormatted: string;
}

export interface ScheduleFormatted {
  id: string;
  customer: CustomerFormatted;
  procedures: ScheduleProcedureFormatted[];
  startAt: string; // ISO string
  endAt: string; // ISO string
  dateFormatted: string;
  startTimeFormatted: string;
  endTimeFormatted: string;
  status: ScheduleStatusEnum;
  statusFormatted: string;
  notes?: string | null;
  totalPrice: number;
  totalPriceFormatted: string;
  totalDuration: number;
  totalDurationFormatted: string;
}

export interface ScheduleWeekDay {
  id: string;
  customerName: string;
  startTime: string;
  startAtIso: string;
  proceduresCount: number;
  status: ScheduleStatusEnum;
}

export type BlockScheduleFormValues = z.infer<typeof blockScheduleSchema>

export type ScheduleSupabase = Database['public']['Tables']['schedules']['Row'];
export type ScheduleInsertPayload = Database['public']['Tables']['schedules']['Insert'];
export type ScheduleUpdatePayload = Database['public']['Tables']['schedules']['Update'];

export type ScheduleProcedureSupabase = Database['public']['Tables']['schedule_procedures']['Row'];
export type ScheduleProcedureJoined = ScheduleProcedureSupabase & {
  procedure: ProcedureSupabase | null;
};
export type ScheduleProcedureInsertPayload = Database['public']['Tables']['schedule_procedures']['Insert'];

export type BlockScheduleInsertPayload = Database['public']['Tables']['establishment_blocks']['Insert'];

export type ScheduleSupabaseJoined = ScheduleSupabase & {
  customer: Database['public']['Tables']['customers']['Row'] | null;
  schedule_procedures: ScheduleProcedureJoined[];
};

export const proceduresJoinedFormatter = (data: ScheduleProcedureJoined[] | null): ScheduleProcedureFormatted[] => {
  return (data || [])
    .filter(sp => !!sp.procedure)
    .map((sp) => {
      const proc = sp.procedure!;
      return {
        ...proc,
        priceAtTime: sp.price_at_time,
        durationAtTime: sp.duration_at_time,
        priceAtTimeFormatted: formatCurrencyBRL(sp.price_at_time),
        durationAtTimeFormatted: formatDuration(sp.duration_at_time),
      };
    });
};

export function formatSchedule(
  schedule: ScheduleSupabaseJoined,
): ScheduleFormatted {
  const start = parseISO(schedule.start_at);
  const end = parseISO(schedule.end_at);

  const customer = schedule.customer ? customerFormatter(schedule.customer) : {} as CustomerFormatted;
  const procedures = proceduresJoinedFormatter(schedule.schedule_procedures);

  return {
    id: schedule.id,
    customer,
    procedures,
    startAt: schedule.start_at,
    endAt: schedule.end_at,
    status: schedule.status as ScheduleStatusEnum,
    notes: schedule.notes,
    totalPrice: schedule.total_price,
    totalDuration: schedule.total_duration,
    statusFormatted: formatScheduleStatus(schedule.status),
    endTimeFormatted: format(end, "HH:mm", { locale: ptBR }),
    startTimeFormatted: format(start, "HH:mm", { locale: ptBR }),
    dateFormatted: format(start, "dd 'de' MMMM", { locale: ptBR }),
    totalPriceFormatted: formatCurrencyBRL(schedule.total_price),
    totalDurationFormatted: formatDuration(schedule.total_duration),
  };
}

export function schedulesFormatter(data: ScheduleSupabaseJoined[] | null): ScheduleFormatted[] {
  return data ? data.map(formatSchedule) : [];
}

export function formatScheduleWeekDay(schedule: ScheduleSupabaseJoined): ScheduleWeekDay {
  const start = parseISO(schedule.start_at);

  return {
    id: schedule.id,
    customerName: schedule.customer?.name || "Poderosa",
    startTime: format(start, "HH:mm", { locale: ptBR }),
    startAtIso: schedule.start_at,
    proceduresCount: schedule.schedule_procedures?.length || 0,
    status: schedule.status as ScheduleStatusEnum,
  };
}

export function schedulesWeekDayFormatter(data: ScheduleSupabaseJoined[] | null): ScheduleWeekDay[] {
  return data ? data.map(formatScheduleWeekDay) : [];
}