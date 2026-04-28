import { ApiResponse } from "@/commons/lib/http/responses"
import { InvoiceInsertPayload } from "@/commons/models/payment"
import { getInvoicesByEstablishmentIdSupabase, upsertInvoiceSupabase } from "../repository/invoice.supabase"
import { getSubscriptionByMpSubscriptionIdSupabase } from "@/back/account/repository/subscription.supabase"
import { getEstablishmentBySubscriptionIdSupabase } from "@/back/account/repository/establishment.supabase"
import { InvoiceResponse } from "mercadopago/dist/clients/invoice/commonTypes"
import { toIsoOrNull } from "@/commons/utils/helper"

export const saveInvoiceFromAuthorizedPaymentApi = async (authorizedPayment: InvoiceResponse) => {
  try {
    const preapprovalId = authorizedPayment.preapproval_id
    console.info(`🧾 [INVOICE:save] Iniciando salvamento | preapproval_id: ${preapprovalId} | payment_id: ${authorizedPayment.id}`)
    if (!preapprovalId) {
      console.error(`❌ [INVOICE:save] preapproval_id ausente`)
      return ApiResponse.BadRequest({
        message: "preapproval_id ausente no authorized_payment",
      })
    }

    console.info(`🧾 [INVOICE:save] Buscando subscription por mp_subscription_id: ${preapprovalId}`)
    const subscription = await getSubscriptionByMpSubscriptionIdSupabase(preapprovalId)
    if (!subscription) {
      console.warn(`⚠️ [INVOICE:save] Subscription local não encontrada para preapproval_id: ${preapprovalId}`)
      return ApiResponse.NotFound({
        message: `Assinatura local não encontrada para preapproval_id: ${preapprovalId}`,
      })
    }
    console.info(`🧾 [INVOICE:save] Subscription encontrada:`, { id: subscription.id, mp_payer_email: subscription.mp_payer_email })

    const establishment = await getEstablishmentBySubscriptionIdSupabase(subscription.id)

    const payload: InvoiceInsertPayload = {
      mp_invoice_id: authorizedPayment.id!,
      mp_subscription_id: authorizedPayment.preapproval_id,
      mp_preapproval_id: authorizedPayment.preapproval_id,
      mp_payer_id: authorizedPayment.payer_id,
      mp_payer_email: subscription.mp_payer_email,
      amount: authorizedPayment.transaction_amount,
      currency: authorizedPayment.currency_id,
      status: authorizedPayment.payment?.status ?? authorizedPayment.status ?? null,
      paid_at: toIsoOrNull(authorizedPayment.debit_date),
      establishment_id: establishment?.id ?? null,
      subscription_id: subscription.id,
      raw_payload: JSON.parse(JSON.stringify(authorizedPayment)),
    }

    const { data, error } = await upsertInvoiceSupabase(payload)

    if (error) {
      console.error("Erro ao salvar invoice no Supabase:", error)
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
    console.error("Erro ao processar invoice:", error)
    return ApiResponse.InternalError({
      message: "Erro ao processar fatura",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const getInvoicesByEstablishmentIdApi = async (establishmentId: string) => {
  const { data, error } = await getInvoicesByEstablishmentIdSupabase(establishmentId)

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar faturas",
      error: error.message,
    })
  }

  return ApiResponse.Ok({
    message: "Faturas encontradas com sucesso",
    data: data ?? [],
  })
}
