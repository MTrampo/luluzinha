import { SCHEDULE_DAY_END_UTC, SCHEDULE_DAY_START_UTC } from "@/commons/constants/schedule";
import { serverSupabase } from "@/commons/lib/supabase/server";
import { ScheduleInsertPayload, ScheduleUpdatePayload, ScheduleProcedureInsertPayload, ScheduleDashSupabase, ScheduleSupabaseJoined } from "@/commons/models/schedule";

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
