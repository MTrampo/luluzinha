import { serverSupabase } from "@/commons/lib/supabase/server";

export const selectIdAndSubscriptionIdEstablishmentByUserIdSupabase = async (userId: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('establishments')
    .select('id, subscription_id')
    .eq('owner_id', userId)
    .single()

  return {  data, error }
}