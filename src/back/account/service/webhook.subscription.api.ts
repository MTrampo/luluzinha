import { ApiResponse } from "@/commons/lib/http/responses"
import { SubscriptionInconsistencyPayload, SubscriptionUpdatePayload } from "@/commons/models/subscription"
import { InvoiceInsertPayload } from "@/commons/models/payment"
import { getPreapprovalApi, getAuthorizedPaymentApi } from "@/back/payment/service/payment.api"
import { PreApprovalResponse } from "mercadopago/dist/clients/preApproval/commonTypes"
import { InvoiceResponse } from "mercadopago/dist/clients/invoice/commonTypes"
import { nowBrazilIso, toIsoOrNull } from "@/commons/utils/helper"
import {
  webhookGetSubscriptionByPayerEmailSupabase,
  webhookGetSubscriptionByPayerIdSupabase,
  webhookSyncSubscriptionSupabase,
  webhookAddInconsistencySupabase,
  webhookGetSubscriptionByMpSubscriptionIdSupabase,
  webhookGetEstablishmentBySubscriptionIdSupabase,
  webhookUpsertInvoiceSupabase,
} from "../repository/webhook.subscription.supabase"

const webhookAddInconsistencyApi = async (preapproval: PreApprovalResponse, reason: string) => {
  const payload: SubscriptionInconsistencyPayload = {
    mp_preapproval_id: preapproval.id!,
    issue_reason: reason,
    mp_payer_id: preapproval.payer_id,
    payer_email_received: preapproval.payer_email ?? null,
    payment: preapproval.status,
    preapproval_data: JSON.stringify(preapproval),
    created_at: nowBrazilIso(),
  }

  const result = await webhookAddInconsistencySupabase(payload)

  if (!result) {
    return ApiResponse.InternalError({
      message: `Erro ao tentar registrar inconsistência de e-mail para o e-mail: ${preapproval.payer_email}`
    })
  }

  return ApiResponse.Created({
    message: "Inconsistência de e-mail encontrada. Registro realizado com sucesso.",
  })
}

const webhookUpdateSubscriptionPreapprovalApi = async (preapproval: PreApprovalResponse) => {
  let subscription = null
  const syncEmail = "vinnicius4@hotmail.com"

  console.info(`🔄 [WEBHOOK_SERVICE:updatePreapproval] Buscando subscription por email: ${syncEmail}`)
  if (syncEmail) { //(preapproval.payer_email) {
    subscription = await webhookGetSubscriptionByPayerEmailSupabase(syncEmail) //(preapproval.payer_email)
    console.info(`🔄 [WEBHOOK_SERVICE:updatePreapproval] Resultado busca por email:`, subscription ? { id: subscription.id, mp_status: subscription.mp_status } : null)
  }

  if (!subscription && typeof preapproval.payer_id === "number") {
    console.info(`🔄 [WEBHOOK_SERVICE:updatePreapproval] Buscando subscription por payer_id: ${preapproval.payer_id}`)
    subscription = await webhookGetSubscriptionByPayerIdSupabase(preapproval.payer_id)
    console.info(`🔄 [WEBHOOK_SERVICE:updatePreapproval] Resultado busca por payer_id:`, subscription ? { id: subscription.id, mp_status: subscription.mp_status } : null)
  }

  if (!subscription) {
    const reason = `E-mail ${syncEmail} não vinculado a conta da manicure.`
    console.warn(`⚠️ [WEBHOOK_SERVICE:updatePreapproval] Subscription não encontrada. Registrando inconsistência: ${reason}`)
    await webhookAddInconsistencyApi(preapproval, reason)
    return null
  }

  const payload: SubscriptionUpdatePayload = {
    mp_status: preapproval.status,
    mp_payer_id: preapproval.payer_id,
    mp_payer_email: syncEmail,
    mp_subscription_id: preapproval.id,
    current_period_start: toIsoOrNull(preapproval.date_created),
    current_period_end: toIsoOrNull(preapproval.next_payment_date),
    updated_at: nowBrazilIso(),
  }

  console.info(`🔄 [WEBHOOK_SERVICE:updatePreapproval] Payload de atualização:`, payload)
  const updateResult = await webhookSyncSubscriptionSupabase(payload, syncEmail)
  console.info(`🔄 [WEBHOOK_SERVICE:updatePreapproval] Resultado syncSubscription:`, updateResult)
  return updateResult
}

const webhookSaveInvoiceFromAuthorizedPaymentApi = async (authorizedPayment: InvoiceResponse) => {
  try {
    const preapprovalId = authorizedPayment.preapproval_id
    console.info(`🧾 [WEBHOOK_INVOICE:save] Iniciando salvamento | preapproval_id: ${preapprovalId} | payment_id: ${authorizedPayment.id}`)
    if (!preapprovalId) {
      console.error(`❌ [WEBHOOK_INVOICE:save] preapproval_id ausente`)
      return ApiResponse.BadRequest({
        message: "preapproval_id ausente no authorized_payment",
      })
    }

    console.info(`🧾 [WEBHOOK_INVOICE:save] Buscando subscription por mp_subscription_id: ${preapprovalId}`)
    const subscription = await webhookGetSubscriptionByMpSubscriptionIdSupabase(preapprovalId)
    if (!subscription) {
      console.warn(`⚠️ [WEBHOOK_INVOICE:save] Subscription local não encontrada para preapproval_id: ${preapprovalId}`)
      return ApiResponse.NotFound({
        message: `Assinatura local não encontrada para preapproval_id: ${preapprovalId}`,
      })
    }
    console.info(`🧾 [WEBHOOK_INVOICE:save] Subscription encontrada:`, { id: subscription.id, mp_payer_email: subscription.mp_payer_email })

    const establishment = await webhookGetEstablishmentBySubscriptionIdSupabase(subscription.id)

    const payload: InvoiceInsertPayload = {
      mp_payment_id: authorizedPayment.id!,
      mp_subscription_id: authorizedPayment.preapproval_id,
      mp_preapproval_id: authorizedPayment.preapproval_id,
      mp_payer_id: authorizedPayment.payer_id?.toString() ?? null,
      mp_payer_email: subscription.mp_payer_email,
      amount: authorizedPayment.transaction_amount ?? 0,
      currency: authorizedPayment.currency_id ?? 'BRL',
      status: authorizedPayment.payment?.status ?? authorizedPayment.status ?? null,
      paid_at: toIsoOrNull(authorizedPayment.debit_date),
      establishment_id: establishment?.id ?? null,
      subscription_id: subscription.id,
      raw_payload: JSON.parse(JSON.stringify(authorizedPayment)),
    }

    const { data, error } = await webhookUpsertInvoiceSupabase(payload)

    if (error) {
      console.error(`❌ [WEBHOOK_INVOICE:save] Erro ao salvar:`, error)
      return ApiResponse.InternalError({
        message: "Falha ao salvar fatura no banco de dados",
        error: error.message,
      })
    }

    return ApiResponse.Ok({
      message: "Fatura registrada com sucesso",
      data,
    })
  } catch (error) {
    console.error(`❌ [WEBHOOK_INVOICE:save] Erro inesperado:`, error)
    return ApiResponse.InternalError({
      message: "Erro ao processar fatura",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const webhookSubscriptionPreapprovalApi = async (preapprovalId: string) => {
  try {
    console.info(`📋 [WEBHOOK_SERVICE:preapproval] Buscando preapproval no MP | id: ${preapprovalId}`)
    const preapprovalResult = await getPreapprovalApi(preapprovalId)
    if (preapprovalResult.error || !preapprovalResult.data) {
      console.error(`❌ [WEBHOOK_SERVICE:preapproval] Falha ao buscar preapproval no MP`, { error: preapprovalResult.error, message: preapprovalResult.message })
      return ApiResponse.InternalError({
        message: preapprovalResult.message,
        error: preapprovalResult.error
      })
    }

    console.info(`📋 [WEBHOOK_SERVICE:preapproval] Preapproval encontrado:`, {
      id: preapprovalResult.data.id,
      status: preapprovalResult.data.status,
      payer_email: preapprovalResult.data.payer_email,
      payer_id: preapprovalResult.data.payer_id,
      date_created: preapprovalResult.data.date_created,
      next_payment_date: preapprovalResult.data.next_payment_date,
    })

    if (!preapprovalResult.data.status) {
      console.error(`❌ [WEBHOOK_SERVICE:preapproval] Status ausente no preapproval`)
      return ApiResponse.InternalError({
        message: "Status do preapproval não encontrado."
      })
    }

    console.info(`📋 [WEBHOOK_SERVICE:preapproval] Atualizando subscription local...`)
    const updatedSubscriptionResult = await webhookUpdateSubscriptionPreapprovalApi(preapprovalResult.data)

    if (!updatedSubscriptionResult) {
      console.error(`❌ [WEBHOOK_SERVICE:preapproval] Subscription não encontrada para atualização`)
      return ApiResponse.NotFound({
        message: "Assinatura associada ao email do pagador não encontrada."
      })
    }

    console.info(`✅ [WEBHOOK_SERVICE:preapproval] Subscription atualizada:`, updatedSubscriptionResult)
    return ApiResponse.Ok({
      message: 'Preapproval processado com sucesso',
      data: updatedSubscriptionResult
    })
  } catch (error) {
    console.error('❌ [WEBHOOK_SERVICE:preapproval] Erro inesperado:', error)
    return ApiResponse.InternalError({
      message: 'Erro ao processar preapproval',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}

export const webhookSubscriptionAuthorizedPaymentApi = async (authorizedPaymentId: string) => {
  try {
    console.info(`💳 [WEBHOOK_SERVICE:authorized_payment] Buscando authorized_payment no MP | id: ${authorizedPaymentId}`)
    const authorizedPaymentResult = await getAuthorizedPaymentApi(authorizedPaymentId)
    if (authorizedPaymentResult.error || !authorizedPaymentResult.data) {
      console.error(`❌ [WEBHOOK_SERVICE:authorized_payment] Falha ao buscar no MP`, { error: authorizedPaymentResult.error, message: authorizedPaymentResult.message })
      return ApiResponse.InternalError({
        message: authorizedPaymentResult.message,
        error: authorizedPaymentResult.error,
      })
    }

    const authorizedPayment = authorizedPaymentResult.data
    console.info(`💳 [WEBHOOK_SERVICE:authorized_payment] Dados recebidos:`, {
      id: authorizedPayment.id,
      preapproval_id: authorizedPayment.preapproval_id,
      payer_id: authorizedPayment.payer_id,
      status: authorizedPayment.status,
      transaction_amount: authorizedPayment.transaction_amount,
      debit_date: authorizedPayment.debit_date,
    })

    console.info(`💳 [WEBHOOK_SERVICE:authorized_payment] Salvando invoice...`)
    const invoiceResult = await webhookSaveInvoiceFromAuthorizedPaymentApi(authorizedPayment)
    if (invoiceResult.error) {
      console.warn(`⚠️ [WEBHOOK_SERVICE:authorized_payment] Falha ao salvar fatura, continuando:`, invoiceResult.error)
    } else {
      console.info(`💳 [WEBHOOK_SERVICE:authorized_payment] Invoice salva com sucesso`)
    }

    const preapprovalId = authorizedPayment.preapproval_id!
    console.info(`💳 [WEBHOOK_SERVICE:authorized_payment] Encaminhando para webhookSubscriptionPreapprovalApi | preapprovalId: ${preapprovalId}`)
    return await webhookSubscriptionPreapprovalApi(preapprovalId)
  } catch (error) {
    console.error('❌ [WEBHOOK_SERVICE:authorized_payment] Erro inesperado:', error)
    return ApiResponse.InternalError({
      message: 'Erro ao processar authorized_payment',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
