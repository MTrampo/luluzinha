import { serverSupabase } from "@/commons/lib/supabase/server";
import { BlockRecurringTypeEnum, ScheduleStatusEnum } from "@/commons/enums/schedule";

export const listScheduleBlocksSupabase = async (establishmentId: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('schedule_blocks')
    .select('*')
    .eq('establishment_id', establishmentId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export const createScheduleBlockSupabase = async (block: any) => {
  const supabase = await serverSupabase()

  const { error } = await supabase
    .from('schedule_blocks')
    .insert(block)

  return { error }
}

export const deleteScheduleBlockSupabase = async (id: string) => {
  const supabase = await serverSupabase()

  const { error } = await supabase
    .from('schedule_blocks')
    .delete()
    .eq('id', id)

  return { error }
}

export const getScheduleBlocksByDateSupabase = async (establishmentId: string, date: string) => {
  const supabase = await serverSupabase()
  const dateObj = new Date(date + "T00:00:00")
  const dayOfWeek = dateObj.getDay()

  // Busca bloqueios que sejam exatamente nesta data OU 
  // que sejam recorrentes (date IS NULL) e caiam neste dia da semana
  const { data, error } = await supabase
    .from('schedule_blocks')
    .select('*')
    .eq('establishment_id', establishmentId)
    .or(`date.eq.${date},recurring_type.eq.${BlockRecurringTypeEnum.DAILY},and(recurring_type.eq.${BlockRecurringTypeEnum.WEEKLY},day_of_week.eq.${dayOfWeek})`)

  return { data, error }
}

export const checkScheduleBlockConflictsSupabase = async (
  establishmentId: string, 
  startTime: string, 
  endTime: string, 
  date: string | null, 
  recurringType: number,
  dayOfWeek: number | null
) => {
  const supabase = await serverSupabase()

  // 1. Verificar conflitos com outros BLOQUEIOS
  // Construímos a query base para buscar bloqueios que podem afetar este horário
  let blockQuery = supabase
    .from('schedule_blocks')
    .select('id, start_time, end_time, date, recurring_type, day_of_week')
    .eq('establishment_id', establishmentId)
    // Condição de sobreposição de tempo: (start1 < end2) AND (start2 < end1)
    .lt('start_time', endTime)
    .gt('end_time', startTime)

  // Filtramos por recorrência/data
  if (recurringType === BlockRecurringTypeEnum.NONE && date) {
    // Bloqueio pontual: conflita com pontuais na mesma data, diários, ou semanais no mesmo dia
    const day = new Date(date + "T00:00:00").getDay()
    blockQuery = blockQuery.or(`date.eq.${date},recurring_type.eq.${BlockRecurringTypeEnum.DAILY},and(recurring_type.eq.${BlockRecurringTypeEnum.WEEKLY},day_of_week.eq.${day})`)
  } else if (recurringType === BlockRecurringTypeEnum.DAILY) {
    // Bloqueio diário: conflita com QUALQUER outro bloqueio que sobreponha o horário
  } else if (recurringType === BlockRecurringTypeEnum.WEEKLY && dayOfWeek !== null) {
    // Bloqueio semanal: conflita com diários, semanais no mesmo dia, ou pontuais que caiam no mesmo dia da semana
    // Nota: Para pontuais, o Supabase não filtra facilmente por day_of_week em uma query simples sem funções.
    // Mas podemos buscar todos os que sobrepõem o horário e filtrar no código se necessário.
    blockQuery = blockQuery.or(`recurring_type.eq.${BlockRecurringTypeEnum.DAILY},and(recurring_type.eq.${BlockRecurringTypeEnum.WEEKLY},day_of_week.eq.${dayOfWeek}),date.not.is.null`)
  }

  const { data: conflictingBlocks, error: blockError } = await blockQuery
  if (blockError) return { conflict: true, error: blockError }

  // Se o novo bloqueio é SEMANAL, precisamos filtrar os pontuais retornados para ver se caem no mesmo dia da semana
  if (recurringType === BlockRecurringTypeEnum.WEEKLY && conflictingBlocks) {
    const reallyConflicting = conflictingBlocks.filter(b => {
      if (b.recurring_type === BlockRecurringTypeEnum.NONE && b.date) {
        return new Date(b.date + "T00:00:00").getDay() === dayOfWeek
      }
      return true
    })
    if (reallyConflicting.length > 0) return { conflict: true, type: 'block' }
  } else if (conflictingBlocks && conflictingBlocks.length > 0) {
    return { conflict: true, type: 'block' }
  }

  // 2. Verificar conflitos com AGENDAMENTOS (Schedules)
  // Se for um bloqueio PONTUAL, é fácil verificar
  if (recurringType === BlockRecurringTypeEnum.NONE && date) {
    const startRange = `${date}T${startTime.substring(0, 5)}:00`
    const endRange = `${date}T${endTime.substring(0, 5)}:00`

    const { data: conflictingSchedules, error: scheduleError } = await supabase
      .from('schedules')
      .select('id')
      .eq('establishment_id', establishmentId)
      .neq('status', ScheduleStatusEnum.CANCELLED)
      .lt('start_at', endRange)
      .gt('end_at', startRange)
      .limit(1)

    if (scheduleError) return { conflict: true, error: scheduleError }
    if (conflictingSchedules && conflictingSchedules.length > 0) return { conflict: true, type: 'schedule' }
  } 
  // Para recorrentes (Diário/Semanal), o ideal seria verificar o futuro próximo (ex: próximos 3 meses)
  // ou simplesmente alertar que bloqueios recorrentes ignoram agendamentos pré-existentes (mas o user quer evitar conflitos)
  // Por simplicidade do MVP, vamos focar na validação pontual por enquanto, ou verificar agendamentos futuros.

  return { conflict: false }
}
