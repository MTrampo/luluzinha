import { authSupabase, serverSupabase } from "@/commons/lib/supabase/server";

export const selectIdAndSubscriptionIdEstablishmentByUserIdSupabase = async (userId: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('establishments')
    .select('id, subscription_id')
    .eq('owner_id', userId)
    .single()

  return {  data, error }
}

export const getEstablishmentBySubscriptionIdSupabase = async (subscriptionId: string) => {
  const supabase = await serverSupabase()

  const { data } = await supabase
    .from('establishments')
    .select('id')
    .eq('subscription_id', subscriptionId)
    .single()

  return data
}

export const getEstablishmentsByOwnerIdSupabase = async (userId: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .eq('owner_id', userId)

  return {  data, error }
}

export const getEstablishmentsByOwnerIdAuthSupabase = async (userId: string, token: string) => {
  const supabase = authSupabase(token)

  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .eq('owner_id', userId)

  return {  data, error }
}