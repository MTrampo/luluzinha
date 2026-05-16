import { SCHEDULE_DAY_END_UTC, SCHEDULE_DAY_START_UTC } from "@/commons/constants/schedule";
import { serverSupabase } from "@/commons/lib/supabase/server";
import { ScheduleInsertPayload, ScheduleUpdatePayload, ScheduleProcedureInsertPayload, ScheduleDashSupabase, ScheduleSupabaseJoined } from "@/commons/models/schedule";
import { ScheduleStatusEnum } from "@/commons/enums/schedule";

const SCHEDULE_DASH_SELECT = `
  id,
  start_at,
  end_at,
  status,
  total_price,
  total_duration,
  notes,
  customer:customers(
    id,
    name,
    phone,
    birthday,
    created_at
  ),
  schedule_procedures(
    price_at_time,
    duration_at_time,
    procedure:procedures(
      id,
      name
    )
  )
`;

export const addScheduleSupabase = async (schedule: ScheduleInsertPayload, procedures: ScheduleProcedureInsertPayload[]) => {
  const supabase = await serverSupabase();

  const { data: scheduleData, error: scheduleError } = await supabase
    .from('schedules')
    .insert(schedule)
    .select()
    .single();

  if (scheduleError || !scheduleData) {
    return { data: null, error: scheduleError };
  }

  const proceduresToInsert = procedures.map(p => ({
    ...p,
    schedule_id: scheduleData.id
  }));

  const { data: proceduresData, error: proceduresError } = await supabase
    .from('schedule_procedures')
    .insert(proceduresToInsert)
    .select();

  if (proceduresError) {
    return { data: null, error: proceduresError };
  }

  return { data: { schedule: scheduleData, procedures: proceduresData }, error: null };
}

export const getSchedulesByEstablishmentSupabase = async (establishmentId: string) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('schedules')
    .select(SCHEDULE_DASH_SELECT)
    .eq('establishment_id', establishmentId)
    .order('start_at', { ascending: true });

  return { data: data as ScheduleDashSupabase[] | null, error };
}

export const getSchedulesByDateSupabase = async (establishmentId: string, dateIsoString: string) => {
  const supabase = await serverSupabase();

  const startOfDay = `${dateIsoString}${SCHEDULE_DAY_START_UTC}`;
  const endOfDay = `${dateIsoString}${SCHEDULE_DAY_END_UTC}`;

  const { data, error } = await supabase
    .from('schedules')
    .select(SCHEDULE_DASH_SELECT)
    .eq('establishment_id', establishmentId)
    .gte('start_at', startOfDay)
    .lte('start_at', endOfDay)
    .order('start_at', { ascending: true });

  return { data: data as ScheduleDashSupabase[] | null, error };
}

export const getScheduleByIdSupabase = async (id: string) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      customer:customers(*),
      schedule_procedures(
        *,
        procedure:procedures(*)
      )
    `)
    .eq('id', id)
    .single();

  return { data: data as ScheduleSupabaseJoined | null, error };
}

export const updateScheduleSupabase = async (id: string, payload: ScheduleUpdatePayload) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('schedules')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export const deleteScheduleSupabase = async (id: string) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export const getSchedulesByRangeSupabase = async (establishmentId: string, startDateIso: string, endDateIso: string) => {
  const supabase = await serverSupabase();

  const { data, error } = await supabase
    .from('schedules')
    .select(SCHEDULE_DASH_SELECT)
    .eq('establishment_id', establishmentId)
    .gte('start_at', startDateIso)
    .lte('start_at', endDateIso)
    .order('start_at', { ascending: true });

  return { data: data as ScheduleDashSupabase[] | null, error };
}

export const checkScheduleConflictsSupabase = async (
  establishmentId: string,
  startAt: string,
  endAt: string,
  scheduleIdToIgnore?: string
) => {
  const supabase = await serverSupabase();

  // 1. Verificar conflitos com outros AGENDAMENTOS
  let query = supabase
    .from('schedules')
    .select('id')
    .eq('establishment_id', establishmentId)
    .neq('status', ScheduleStatusEnum.CANCELLED)
    .lt('start_at', endAt)
    .gt('end_at', startAt);

  if (scheduleIdToIgnore) {
    query = query.neq('id', scheduleIdToIgnore);
  }

  const { data: conflictingSchedules, error: scheduleError } = await query.limit(1);

  if (scheduleError) return { conflict: true, error: scheduleError };
  if (conflictingSchedules && conflictingSchedules.length > 0) return { conflict: true, type: 'schedule' };

  // 2. Verificar conflitos com BLOQUEIOS (Blocks)
  const targetDate = startAt.split('T')[0];
  const startTime = startAt.split('T')[1].substring(0, 5); // HH:mm
  const endTime = endAt.split('T')[1].substring(0, 5); // HH:mm
  const dayOfWeek = new Date(startAt).getDay();

  const { data: conflictingBlocks, error: blockError } = await supabase
    .from('schedule_blocks')
    .select('id')
    .eq('establishment_id', establishmentId)
    // Sobreposição de tempo
    .lt('start_time', endTime)
    .gt('end_time', startTime)
    // Filtro por data ou recorrência
    .or(`date.eq.${targetDate},recurring_type.eq.1,and(recurring_type.eq.2,day_of_week.eq.${dayOfWeek})`)
    .limit(1);

  if (blockError) return { conflict: true, error: blockError };
  if (conflictingBlocks && conflictingBlocks.length > 0) return { conflict: true, type: 'block' };

  return { conflict: false };
}

export const updateScheduleWithProceduresSupabase = async (
  scheduleId: string,
  schedule: ScheduleUpdatePayload,
  procedures: ScheduleProcedureInsertPayload[]
) => {
  const supabase = await serverSupabase();

  // Update schedule
  const { data: scheduleData, error: scheduleError } = await supabase
    .from('schedules')
    .update(schedule)
    .eq('id', scheduleId)
    .select()
    .single();

  if (scheduleError || !scheduleData) {
    return { data: null, error: scheduleError };
  }

  // Delete old procedures
  const { error: deleteProceduresError } = await supabase
    .from('schedule_procedures')
    .delete()
    .eq('schedule_id', scheduleId);

  if (deleteProceduresError) {
    return { data: null, error: deleteProceduresError };
  }

  // Insert new procedures
  const proceduresToInsert = procedures.map(p => ({
    ...p,
    schedule_id: scheduleData.id
  }));

  const { data: proceduresData, error: proceduresError } = await supabase
    .from('schedule_procedures')
    .insert(proceduresToInsert)
    .select();

  if (proceduresError) {
    return { data: null, error: proceduresError };
  }

  return { data: { schedule: scheduleData, procedures: proceduresData }, error: null };
}
