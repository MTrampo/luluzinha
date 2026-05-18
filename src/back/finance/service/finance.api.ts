import { getSchedulesForFinanceSupabase } from "../repository/finance.supabase";
import { ApiResponse } from "@/commons/lib/http/responses";
import { ScheduleStatusEnum } from "@/commons/enums/schedule";
import { formatCurrencyBRL } from "@/commons/utils/format";
import { getInitials } from "@/commons/utils/helper";
import { parseISO, isSameDay } from "date-fns";

export type FinanceOverviewData = {
  projectedDay: string;
  completedDayCount: string;
  completedMonthCount: string;
  completedMonthValue: string;
}

export type FinanceHistoryItem = {
  id: string;
  customerName: string;
  customerInitials: string;
  startAt: string;
  totalPriceFormatted: string;
  totalDuration: number;
}

export type FinanceDashboardData = {
  overview: FinanceOverviewData;
  history: FinanceHistoryItem[];
}

export const getFinanceDashboardApi = async (
  establishmentId: string, 
  todayIsoString: string, 
  firstDayOfMonthIso: string, 
  lastDayOfMonthIso: string
) => {
  // Busca otimizada: Retorna apenas dados enxutos de agendamentos CONFIRMADOS ou COMPLETOS do mês
  const { data: schedules, error } = await getSchedulesForFinanceSupabase(
    establishmentId, 
    firstDayOfMonthIso, 
    lastDayOfMonthIso
  );

  if (error) {
    return ApiResponse.InternalError({ message: "Erro ao buscar dados do financeiro.", error: error.message });
  }

  // Parse da data de hoje para comparação local
  const today = parseISO(todayIsoString);

  let projectedDayValue = 0;
  let completedDayCount = 0;
  let completedMonthCount = 0;
  let completedMonthValue = 0;

  const history: FinanceHistoryItem[] = [];

  schedules?.forEach(schedule => {
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

      // Adiciona ao histórico do mês apenas os finalizados
      const customerData = schedule.customers as any;
      const customerName = customerData?.name;
      history.push({
        id: schedule.id,
        customerName: customerName || "Poderosa Desconhecida",
        customerInitials: getInitials(customerName || "P"),
        startAt: schedule.start_at,
        totalPriceFormatted: formatCurrencyBRL(schedule.total_price),
        totalDuration: schedule.total_duration
      });
    }
  });

  return ApiResponse.Ok<FinanceDashboardData>({
    message: "Dados do caixa obtidos com sucesso.",
    data: {
      overview: {
        projectedDay: formatCurrencyBRL(projectedDayValue),
        completedDayCount: completedDayCount.toString(),
        completedMonthCount: completedMonthCount.toString(),
        completedMonthValue: formatCurrencyBRL(completedMonthValue)
      },
      history
    }
  });
};
