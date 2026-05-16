import { z } from "zod";
import { customerFormatter, CustomerFormatted } from "./customer";
import { procedureFormatter, ProcedureSupabase } from "./procedure";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScheduleStatusEnum, formatScheduleStatus, BlockRecurringTypeEnum } from "@/commons/enums/schedule";
import { Database } from "@/commons/types/database.types";
import { blockScheduleSchema } from "../validations/schedule";
import { formatCurrencyBRL, formatDuration, formatCaseName, formatTimeRangeToDuration } from "../utils/format";
import { getInitials, checkIsBirthdayToday, checkIsNewCustomer } from "../utils/helper";

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

export interface ScheduleFilters {
  statuses: number[];
  highlights: string[];
  showBlocks: boolean;
  search: string;
}

export interface CustomerDash {
  id: string;
  nameFormatted: string;
  initials: string;
  isNew: boolean;
  isBirthdayToday: boolean;
  waLink: string | null;
}

export interface ScheduleDash {
  id: string;
  customer: CustomerDash;
  procedures: { id: string; name: string }[];
  startAt: string;
  endAt: string;
  startTimeFormatted: string;
  endTimeFormatted: string;
  totalDurationFormatted: string;
  totalPriceFormatted: string;
  totalPrice: number;
  totalDuration: number;
  status: ScheduleStatusEnum;
  statusFormatted: string;
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

export type BlockScheduleSupabase = Database['public']['Tables']['schedule_blocks']['Row'];
export type BlockScheduleInsertPayload = Database['public']['Tables']['schedule_blocks']['Insert'];

export interface BlockFormatted {
  id: string;
  reason: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  durationFormatted: string;
  recurringType: number;
  recurringTypeFormatted?: string;
  dayOfWeek?: number | null;
  date?: string | null;
}

export type ScheduleSupabaseJoined = ScheduleSupabase & {
  customer: Database['public']['Tables']['customers']['Row'] | null;
  schedule_procedures: ScheduleProcedureJoined[];
};

export type ScheduleDashSupabase = {
  id: string;
  start_at: string;
  end_at: string;
  status: number;
  total_price: number;
  total_duration: number;
  notes: string | null;
  customer: {
    id: string;
    name: string;
    phone: string | null;
    birthday: string | null;
    created_at: string | null;
  } | null;
  schedule_procedures: {
    price_at_time: number;
    duration_at_time: number;
    procedure: {
      id: string;
      name: string;
    } | null;
  }[];
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

export function formatScheduleDash(
  schedule: ScheduleDashSupabase,
): ScheduleDash {
  const start = parseISO(schedule.start_at);
  const end = parseISO(schedule.end_at);
  const customer = schedule.customer;

  return {
    id: schedule.id,
    startAt: schedule.start_at,
    endAt: schedule.end_at,
    status: schedule.status as ScheduleStatusEnum,
    statusFormatted: formatScheduleStatus(schedule.status),
    startTimeFormatted: format(start, "HH:mm", { locale: ptBR }),
    endTimeFormatted: format(end, "HH:mm", { locale: ptBR }),
    totalPriceFormatted: formatCurrencyBRL(schedule.total_price),
    totalDurationFormatted: formatDuration(schedule.total_duration),
    totalPrice: schedule.total_price,
    totalDuration: schedule.total_duration,
    customer: {
      id: customer?.id || '',
      nameFormatted: customer ? formatCaseName(customer.name) : "Poderosa",
      initials: customer ? getInitials(customer.name) : "P",
      isNew: checkIsNewCustomer(customer?.created_at ?? null),
      isBirthdayToday: checkIsBirthdayToday(customer?.birthday ?? null),
      waLink: customer?.phone ? `https://wa.me/55${customer.phone}` : null,
    },
    procedures: (schedule.schedule_procedures || [])
      .filter(sp => !!sp.procedure)
      .map(sp => ({
        id: sp.procedure!.id,
        name: sp.procedure!.name
      }))
  };
}

export function schedulesDashFormatter(data: ScheduleDashSupabase[] | null): ScheduleDash[] {
  return data ? data.map(formatScheduleDash) : [];
}

export function formatScheduleWeekDay(schedule: ScheduleDashSupabase): ScheduleWeekDay {
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

export function schedulesWeekDayFormatter(data: ScheduleDashSupabase[] | null): ScheduleWeekDay[] {
  return data ? data.map(formatScheduleWeekDay) : [];
}

export function formatBlock(block: BlockScheduleSupabase): BlockFormatted {
  const isAllDay = block.start_time === "00:00" && block.end_time === "23:59";

  let recurringTypeFormatted = "";
  if (block.recurring_type === BlockRecurringTypeEnum.DAILY) recurringTypeFormatted = "Diário";
  else if (block.recurring_type === BlockRecurringTypeEnum.WEEKLY) recurringTypeFormatted = "Semanal";

  return {
    id: block.id,
    reason: block.reason || "Horário Bloqueado",
    startTime: block.start_time.substring(0, 5),
    endTime: block.end_time.substring(0, 5),
    isAllDay,
    durationFormatted: formatTimeRangeToDuration(block.start_time, block.end_time),
    recurringType: block.recurring_type || 0,
    recurringTypeFormatted,
    dayOfWeek: block.day_of_week,
    date: block.date,
  };
}

export function blocksFormatter(data: BlockScheduleSupabase[] | null): BlockFormatted[] {
  return data ? data.map(formatBlock) : [];
}