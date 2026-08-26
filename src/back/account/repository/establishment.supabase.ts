import { authSupabase, serverSupabase } from "@/commons/lib/supabase/server";
import { EstablishmentUpdateInput, EstablishmentSupabase } from "@/commons/models/establishment";
import { PostgrestError } from "@supabase/supabase-js";

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

export const updateEstablishmentSupabase = async (
  establishmentId: string,
  data: EstablishmentUpdateInput
): Promise<{ data: EstablishmentSupabase | null; error: PostgrestError | null }> => {
  const supabase = await serverSupabase()

  const { data: updated, error } = await supabase
    .from('establishments')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', establishmentId)
    .select()
    .single()

  return { data: updated, error }
}

export const checkSlugAvailabilitySupabase = async (slug: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('establishments')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  return { exists: !!data, error }
}

export const insertEstablishmentSupabase = async (
  userId: string,
  establishmentData: {
    name: string
    slug: string
    avatar_url: string | null
    phone: string | null
    address: string | null
    opening_hours: any
  }
) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('establishments')
    .insert({
      owner_id: userId,
      ...establishmentData
    })
    .select()
    .single()

  return { data, error }
}