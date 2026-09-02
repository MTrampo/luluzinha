import { internalSupabase } from "@/commons/lib/supabase/internal"
import { InvoiceInsertPayload } from "@/commons/models/payment"
import { SubscriptionInconsistencyPayload, SubscriptionUpdatePayload } from "@/commons/models/subscription"

export const webhookGetSubscriptionByIdSupabase = async (id: string) => {
  const supabase = internalSupabase()

  console.info(`🗄️ [WEBHOOK_REPO:getById] Buscando subscription por ID: ${id}`)
  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('id', id)
    .single()

  if (error) {
    console.warn(`⚠️ [WEBHOOK_REPO:getById] Erro/Nenhum resultado:`, { code: error.code, message: error.message })
  } else {
    console.info(`🗄️ [WEBHOOK_REPO:getById] Encontrado:`, { id: data?.id, mp_status: data?.mp_status })
  }

  return data
}

export const webhookGetSubscriptionByPayerEmailSupabase = async (payerEmail: string) => {
  const supabase = internalSupabase()

  console.info(`🗄️ [WEBHOOK_REPO:getByEmail] Buscando subscription por email: ${payerEmail}`)
  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('mp_payer_email', payerEmail)
    .single()

  if (error) {
    console.warn(`⚠️ [WEBHOOK_REPO:getByEmail] Erro/Nenhum resultado:`, { code: error.code, message: error.message })
  } else {
    console.info(`🗄️ [WEBHOOK_REPO:getByEmail] Encontrado:`, { id: data?.id, mp_status: data?.mp_status, mp_payer_email: data?.mp_payer_email })
  }

  return data
}

export const webhookGetSubscriptionByPayerIdSupabase = async (payerId: number) => {
  const supabase = internalSupabase()

  console.info(`🗄️ [WEBHOOK_REPO:getByPayerId] Buscando subscription por payer_id: ${payerId}`)
  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('mp_payer_id', payerId)
    .single()

  if (error) {
    console.warn(`⚠️ [WEBHOOK_REPO:getByPayerId] Erro/Nenhum resultado:`, { code: error.code, message: error.message })
  } else {
    console.info(`🗄️ [WEBHOOK_REPO:getByPayerId] Encontrado:`, { id: data?.id, mp_status: data?.mp_status })
  }

  return data
}

export const webhookSyncSubscriptionSupabase = async (payload: SubscriptionUpdatePayload, id: string) => {
  const supabase = internalSupabase()

  console.info(`🗄️ [WEBHOOK_REPO:syncSubscription] Executando UPDATE em subscriptions WHERE id = '${id}'`)
  console.info(`🗄️ [WEBHOOK_REPO:syncSubscription] Payload:`, payload)

  const { data, error } = await supabase
    .from('subscriptions')
    .update(payload)
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    console.error(`❌ [WEBHOOK_REPO:syncSubscription] Erro no Supabase:`, { code: error.code, message: error.message, details: error.details, hint: error.hint })
  } else {
    console.info(`🗄️ [WEBHOOK_REPO:syncSubscription] Sucesso | id retornado:`, data?.id ?? 'null')
  }

  return data
}

export const webhookAddInconsistencySupabase = async (payload: SubscriptionInconsistencyPayload) => {
  const supabase = internalSupabase()

  console.info(`🗄️ [WEBHOOK_REPO:addInconsistency] Registrando inconsistência:`, { mp_preapproval_id: payload.mp_preapproval_id, issue_reason: payload.issue_reason })
  const { data, error } = await supabase
    .from('subscription_inconsistencies')
    .insert(payload)
    .select('id')
    .single()

  if (error) {
    console.error(`❌ [WEBHOOK_REPO:addInconsistency] Erro ao inserir:`, { code: error.code, message: error.message })
  } else {
    console.info(`🗄️ [WEBHOOK_REPO:addInconsistency] Registrado com id:`, data?.id)
  }

  return data
}

export const webhookGetSubscriptionByMpSubscriptionIdSupabase = async (mpSubscriptionId: string) => {
  const supabase = internalSupabase()

  console.info(`🗄️ [WEBHOOK_REPO:getByMpSubscriptionId] Buscando por mp_subscription_id: ${mpSubscriptionId}`)
  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('mp_subscription_id', mpSubscriptionId)
    .single()

  if (error) {
    console.warn(`⚠️ [WEBHOOK_REPO:getByMpSubscriptionId] Erro/Nenhum resultado:`, { code: error.code, message: error.message })
  } else {
    console.info(`🗄️ [WEBHOOK_REPO:getByMpSubscriptionId] Encontrado:`, { id: data?.id, mp_payer_email: data?.mp_payer_email })
  }

  return data
}

export const webhookGetEstablishmentBySubscriptionIdSupabase = async (subscriptionId: string) => {
  const supabase = internalSupabase()

  const { data } = await supabase
    .from('establishments')
    .select('id')
    .eq('subscription_id', subscriptionId)
    .single()

  return data
}

export const webhookUpsertInvoiceSupabase = async (payload: InvoiceInsertPayload) => {
  const supabase = internalSupabase()

  const { data, error } = await supabase
    .from('invoices')
    .upsert(payload, { onConflict: 'mp_invoice_id' })
    .select('id')
    .single()

  return { data, error }
}
