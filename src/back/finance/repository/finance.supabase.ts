import { serverSupabase } from "@/commons/lib/supabase/server";
import { ScheduleStatusEnum } from "@/commons/enums/schedule";

export const getSchedulesForFinanceSupabase = async (
  establishmentId: string,
  startDate: string, // ISO string do primeiro dia do mês (UTC ou local dependendo da regra, preferível UTC)
  endDate: string    // ISO string do último dia do mês
) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from("schedules")
    .select(`
      id,
      start_at,
      status,
      total_price,
      total_duration,
      customer_id,
      customers (
        id,
        name
      )
    `)
    .eq("establishment_id", establishmentId)
    .in("status", [ScheduleStatusEnum.CONFIRMED, ScheduleStatusEnum.COMPLETED])
    .gte("start_at", startDate)
    .lte("start_at", endDate)
    .order("start_at", { ascending: false });

  return { data, error };
};

export const getCompletedSchedulesPaginatedSupabase = async (
  establishmentId: string,
  startDate: string,
  endDate: string,
  params: { page: number; pageSize: number }
) => {
  const { page, pageSize } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await serverSupabase();
  const { data, count, error } = await supabase
    .from("schedules")
    .select(
      `
      id,
      start_at,
      status,
      total_price,
      total_duration,
      customer_id,
      customers (
        id,
        name
      )
    `,
      { count: "exact" }
    )
    .eq("establishment_id", establishmentId)
    .eq("status", ScheduleStatusEnum.COMPLETED)
    .gte("start_at", startDate)
    .lte("start_at", endDate)
    .order("start_at", { ascending: false })
    .range(from, to);

  return { data, count: count ?? 0, error };
};

