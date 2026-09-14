import {
  getSchedulesForFinanceSupabase,
  getCompletedSchedulesPaginatedSupabase,
} from "../repository/finance.supabase";
import { getPlanConfigByEstablishmentIdSupabase } from "@/back/account/repository/subscription.supabase";
import { ApiResponse } from "@/commons/lib/http/responses";
import { ScheduleStatusEnum } from "@/commons/enums/schedule";
import { formatCurrencyBRL, formatTransactionDate } from "@/commons/utils/format";
import { getInitials } from "@/commons/utils/helper";
import { parseISO, isSameDay, subDays, startOfDay } from "date-fns";
import { PaginatedResponse, PaginationParams } from "@/commons/models/pagination";

export type FinanceOverviewData = {
  projectedDay: string;
  completedDayCount: string;
  completedMonthCount: string;
  completedMonthValue: string;
};

export type FinanceHistoryItem = {
  id: string;
  customerName: string;
  customerInitials: string;
  startAt: string;
  dateFormatted: string;
  totalPriceFormatted: string;
  totalDuration: number;
};

export type FinanceDashboardData = {
  overview: FinanceOverviewData;
  history: PaginatedResponse<FinanceHistoryItem>;
};

type ScheduleCustomerRelation =
  | {
      id: string;
      name: string;
    }
  | {
      id: string;
      name: string;
    }[]
  | null;

const extractCustomerName = (customers: ScheduleCustomerRelation): string => {
  if (!customers) return "Poderosa";
  if (Array.isArray(customers)) {
    return customers[0]?.name || "Poderosa";
  }
  return customers.name || "Poderosa";
};

const formatScheduleToHistoryItem = (schedule: {
  id: string;
  start_at: string;
  total_price: number;
  total_duration: number;
  customers: ScheduleCustomerRelation;
}): FinanceHistoryItem => {
  const customerName = extractCustomerName(schedule.customers);
  return {
    id: schedule.id,
    customerName,
    customerInitials: getInitials(customerName),
    startAt: schedule.start_at,
    dateFormatted: formatTransactionDate(schedule.start_at),
    totalPriceFormatted: formatCurrencyBRL(schedule.total_price),
    totalDuration: schedule.total_duration,
  };
};

export const getFinanceDashboardApi = async (
  establishmentId: string,
  todayIsoString: string,
  firstDayOfMonthIso: string,
  lastDayOfMonthIso: string,
  pagination: PaginationParams = { page: 1, pageSize: 10 }
) => {
  // 1. Limite de retenção do plano
  const { data: planLimits } = await getPlanConfigByEstablishmentIdSupabase(establishmentId);
  const minRetentionDate = subDays(startOfDay(new Date()), planLimits.historyRetentionDays);
  const firstDayDate = parseISO(firstDayOfMonthIso);
  const lastDayDate = parseISO(lastDayOfMonthIso);

  if (lastDayDate < minRetentionDate) {
    return ApiResponse.Ok<FinanceDashboardData>({
      message: `Os dados solicitados ultrapassam o limite de retenção de ${planLimits.historyRetentionDays} dias do seu plano.`,
      data: {
        overview: {
          projectedDay: formatCurrencyBRL(0),
          completedDayCount: "0",
          completedMonthCount: "0",
          completedMonthValue: formatCurrencyBRL(0),
        },
        history: {
          items: [],
          totalCount: 0,
          page: 1,
          pageSize: pagination.pageSize || 10,
          hasMore: false,
        },
      },
    });
  }

  const effectiveStartDate = (firstDayDate < minRetentionDate ? minRetentionDate : firstDayDate).toISOString();

  // 2. Busca do período respeitando a retenção
  const { data: schedules, error: schedulesError } = await getSchedulesForFinanceSupabase(
    establishmentId,
    effectiveStartDate,
    lastDayOfMonthIso
  );

  if (schedulesError) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar dados do financeiro.",
      error: schedulesError.message,
    });
  }

  // Parse da data de hoje para comparação local
  const today = parseISO(todayIsoString);

  let projectedDayValue = 0;
  let completedDayCount = 0;
  let completedMonthCount = 0;
  let completedMonthValue = 0;

  schedules?.forEach((schedule) => {
    const scheduleDate = parseISO(schedule.start_at);
    const isToday = isSameDay(scheduleDate, today);
    const isCompleted = schedule.status === ScheduleStatusEnum.COMPLETED;
    const isConfirmed = schedule.status === ScheduleStatusEnum.CONFIRMED;

    if (isToday) {
      if (isCompleted || isConfirmed) {
        projectedDayValue += schedule.total_price;
      }
      if (isCompleted) {
        completedDayCount += 1;
      }
    }

    if (isCompleted) {
      completedMonthCount += 1;
      completedMonthValue += schedule.total_price;
    }
  });

  // 2. Busca paginada do histórico de finalizados
  const page = Math.max(1, pagination.page || 1);
  const pageSize = Math.min(50, Math.max(1, pagination.pageSize || 10));

  const { data: paginatedData, count, error: historyError } =
    await getCompletedSchedulesPaginatedSupabase(
      establishmentId,
      firstDayOfMonthIso,
      lastDayOfMonthIso,
      { page, pageSize }
    );

  if (historyError) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar histórico de transações.",
      error: historyError.message,
    });
  }

  const historyItems = (paginatedData || []).map((item) =>
    formatScheduleToHistoryItem({
      id: item.id,
      start_at: item.start_at,
      total_price: item.total_price,
      total_duration: item.total_duration,
      customers: item.customers as ScheduleCustomerRelation,
    })
  );

  const currentOffset = (page - 1) * pageSize;
  const hasMore = currentOffset + historyItems.length < count;

  return ApiResponse.Ok<FinanceDashboardData>({
    message: "Dados do caixa obtidos com sucesso.",
    data: {
      overview: {
        projectedDay: formatCurrencyBRL(projectedDayValue),
        completedDayCount: completedDayCount.toString(),
        completedMonthCount: completedMonthCount.toString(),
        completedMonthValue: formatCurrencyBRL(completedMonthValue),
      },
      history: {
        items: historyItems,
        totalCount: count,
        page,
        pageSize,
        hasMore,
      },
    },
  });
};

export const getFinanceTransactionsPaginatedApi = async (
  establishmentId: string,
  firstDayOfMonthIso: string,
  lastDayOfMonthIso: string,
  params: PaginationParams
) => {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize || 10));

  // 1. Limite de retenção do plano
  const { data: planLimits } = await getPlanConfigByEstablishmentIdSupabase(establishmentId);
  const minRetentionDate = subDays(startOfDay(new Date()), planLimits.historyRetentionDays);
  const firstDayDate = parseISO(firstDayOfMonthIso);
  const lastDayDate = parseISO(lastDayOfMonthIso);

  if (lastDayDate < minRetentionDate) {
    return ApiResponse.Ok({
      message: "Transações fora da janela de retenção do plano.",
      data: {
        items: [],
        totalCount: 0,
        page,
        pageSize,
        hasMore: false,
      },
    });
  }

  const effectiveStartDate = (firstDayDate < minRetentionDate ? minRetentionDate : firstDayDate).toISOString();

  const { data, count, error } = await getCompletedSchedulesPaginatedSupabase(
    establishmentId,
    effectiveStartDate,
    lastDayOfMonthIso,
    { page, pageSize }
  );

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar mais transações.",
      error: error.message,
    });
  }

  const items = (data || []).map((item) =>
    formatScheduleToHistoryItem({
      id: item.id,
      start_at: item.start_at,
      total_price: item.total_price,
      total_duration: item.total_duration,
      customers: item.customers as ScheduleCustomerRelation,
    })
  );

  const currentOffset = (page - 1) * pageSize;
  const hasMore = currentOffset + items.length < count;

  const result: PaginatedResponse<FinanceHistoryItem> = {
    items,
    totalCount: count,
    page,
    pageSize,
    hasMore,
  };

  return ApiResponse.Ok({
    message: "Transações obtidas com sucesso.",
    data: result,
  });
};

