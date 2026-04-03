import { serverSupabase } from "@/commons/lib/supabase/server";
import { SubscriptionInconsistencyPayload, SubscriptionPreApprovalPayload, SubscriptionUpdatePayload } from "@/commons/models/subscription";


export const getSubscriptionByIdSupabase = async (subscriptionId: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('id', subscriptionId)
    .single()

  return { data, error }
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


export const getSubscriptionByPayerIdSupabase = async (payerId: number) => {
  const supabase = await serverSupabase()

  console.info(`🗄️ [REPO:getByPayerId] Buscando subscription por payer_id: ${payerId}`)
  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('mp_payer_id', payerId)
    .single()

  if (error) {
    console.warn(`⚠️ [REPO:getByPayerId] Erro/Nenhum resultado:`, { code: error.code, message: error.message })
  } else {
    console.info(`🗄️ [REPO:getByPayerId] Encontrado:`, { id: data?.id, mp_status: data?.mp_status })
  }

  return data
}

export const getSubscriptionByPayerEmailSupabase = async (payerEmail: string) => {
  const supabase = await serverSupabase()

  console.info(`🗄️ [REPO:getByEmail] Buscando subscription por email: ${payerEmail}`)
  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('mp_payer_email', payerEmail)
    .single()

  if (error) {
    console.warn(`⚠️ [REPO:getByEmail] Erro/Nenhum resultado:`, { code: error.code, message: error.message })
  } else {
    console.info(`🗄️ [REPO:getByEmail] Encontrado:`, { id: data?.id, mp_status: data?.mp_status, mp_payer_email: data?.mp_payer_email })
  }

  return data
}

export const upsertSubscriptionSupabase = async (
  subscriptionData: SubscriptionPreApprovalPayload,
  subscriptionId: string | null,
  establishmentId: string
) => {
  const supabase = await serverSupabase()

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

export const syncSubscriptionSupabase = async (payload: SubscriptionUpdatePayload, email: string) => {
  const supabase = await serverSupabase()

  console.info(`🗄️ [REPO:syncSubscription] Executando UPDATE em subscriptions WHERE mp_payer_email = '${email}'`)
  console.info(`🗄️ [REPO:syncSubscription] Payload:`, payload)

  const { data, error } = await supabase
    .from('subscriptions')
    .update(payload)
    .eq('mp_payer_email', email)
    .select('id')
    .single()

  if (error) {
    console.error(`❌ [REPO:syncSubscription] Erro no Supabase:`, { code: error.code, message: error.message, details: error.details, hint: error.hint })
  } else {
    console.info(`🗄️ [REPO:syncSubscription] Sucesso | id retornado:`, data?.id ?? 'null')
  }

  return data
}

export const addInconsistencySupabase = async (payload: SubscriptionInconsistencyPayload) => {
  const supabase = await serverSupabase()

  console.info(`🗄️ [REPO:addInconsistency] Registrando inconsistência:`, { mp_preapproval_id: payload.mp_preapproval_id, issue_reason: payload.issue_reason })
  const { data, error } = await supabase
    .from('subscription_inconsistencies')
    .insert(payload)
    .select('id')
    .single()

  if (error) {
    console.error(`❌ [REPO:addInconsistency] Erro ao inserir:`, { code: error.code, message: error.message })
  } else {
    console.info(`🗄️ [REPO:addInconsistency] Registrado com id:`, data?.id)
  }

  return data
}

export const getSubscriptionByMpSubscriptionIdSupabase = async (mpSubscriptionId: string) => {
  const supabase = await serverSupabase()

  const { data } = await supabase
    .from('subscriptions')
    .select()
    .eq('mp_subscription_id', mpSubscriptionId)
    .single()

  return data
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

// export const findEstablishmentOwnerBySubscriptionId = async (subscriptionId: string) => {
//   const supabase = await serverSupabase()
//   return await supabase
//     .from('establishments')
//     .select('owner_id')
//     .eq('subscription_id', subscriptionId)
//     .single()
// }

// export const touchProfileUpdatedAt = async (ownerId: string) => {
//   const supabase = await serverSupabase()
//   return await supabase
//     .from('profiles')
//     .update({ updated_at: new Date().toISOString() })
//     .eq('id', ownerId)
// }