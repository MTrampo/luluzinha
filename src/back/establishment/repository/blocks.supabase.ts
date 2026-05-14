import { serverSupabase } from "@/commons/lib/supabase/server";

export const listEstablishmentBlocksSupabase = async (establishmentId: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('establishment_blocks')
    .select('*')
    .eq('establishment_id', establishmentId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export const createEstablishmentBlockSupabase = async (block: any) => {
  const supabase = await serverSupabase()

  const { error } = await supabase
    .from('establishment_blocks')
    .insert(block)

  return { error }
}

export const deleteEstablishmentBlockSupabase = async (id: string) => {
  const supabase = await serverSupabase()

  const { error } = await supabase
    .from('establishment_blocks')
    .delete()
    .eq('id', id)

  return { error }
}

export const getBlocksByDateSupabase = async (establishmentId: string, date: string) => {
  const supabase = await serverSupabase()
  const dateObj = new Date(date + "T00:00:00")
  const dayOfWeek = dateObj.getDay()

  // Busca bloqueios que sejam exatamente nesta data OU 
  // que sejam recorrentes (date IS NULL) e caiam neste dia da semana
  const { data, error } = await supabase
    .from('establishment_blocks')
    .select('*')
    .eq('establishment_id', establishmentId)
    .or(`date.eq.${date},and(date.is.null,day_of_week.eq.${dayOfWeek})`)

  return { data, error }
}
