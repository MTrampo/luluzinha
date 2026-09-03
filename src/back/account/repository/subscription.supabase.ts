import { authSupabase, serverSupabase } from "@/commons/lib/supabase/server";
import { internalSupabase } from "@/commons/lib/supabase/internal";
import { SubscriptionPreApprovalPayload, SubscriptionUpdatePayload } from "@/commons/models/subscription";

async function getClient() {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return internalSupabase();
    }
  } catch {}
  return await serverSupabase();
}

export const getSubscriptionIdByUserIdSupabase = async (userId: string) => {
  const supabase = await serverSupabase()

  const { data } = await supabase
    .from('establishments')
    .select('subscriptions(*)')
    .eq('owner_id', userId)
    .single()

  return data?.subscriptions ?? null
}

export const getSubscriptionByMpSubscriptionIdSupabase = async (mpSubscriptionId: string) => {
  const supabase = await serverSupabase()

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('mp_preapproval_id', mpSubscriptionId)
    .single()

  return data ?? null
}

export const upsertSubscriptionSupabase = async (
  subscriptionData: SubscriptionPreApprovalPayload,
  subscriptionId: string | null,
  establishmentId: string
) => {
  const supabase = await getClient()


  // Se existe subscription_id, atualiza. Caso contrário, cria um novo registro
  if (subscriptionId) {
    console.log("Atualizando subscription com ID:", subscriptionId)
    const { data, error } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('id', subscriptionId)
      .select('id')
      .single()

    console.log("Resultado do upsertSubscriptionSupabase (update):", { data, error })

    return { data, error }
  } else {
    console.log("Criando nova subscription com dados:", subscriptionData)
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select('id')
      .single()

    console.log("Resultado do upsertSubscriptionSupabase:", { data, error })

    if (!error && data?.id) {
      // Atualiza o establishment com o novo subscription_id

      console.log("Atualizando establishment com novo subscription_id:", data.id)
      await supabase
        .from('establishments')
        .update({ subscription_id: data.id })
        .eq('id', establishmentId)
    }

    return { data, error }
  }
}

export const updateSubscriptionByIdSupabase = async (subscriptionId: string, payload: SubscriptionUpdatePayload) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('subscriptions')
    .update(payload)
    .eq('id', subscriptionId)
    .select('id')
    .single()

  return { data, error }
}

export const getSubscriptionIdByUserIdAuthSupabase = async (userId: string, token: string) => {
  const supabase = authSupabase(token)

  const { data } = await supabase
    .from('establishments')
    .select('subscriptions(*)')
    .eq('owner_id', userId)

  if (Array.isArray(data) && data.length > 0) {
    return data[0].subscriptions ?? null
  }

  return null
}