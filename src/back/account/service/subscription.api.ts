import { getUserLoggedApi } from "./auth.api"
import { addInconsistencySupabase, getSubscriptionByIdSupabase, getSubscriptionByPayerEmailSupabase, getSubscriptionByPayerIdSupabase, getSubscriptionIdByUserIdSupabase, syncSubscriptionSupabase, updateSubscriptionByIdSupabase, upsertSubscriptionSupabase } from "../repository/subscription.supabase"
import { ApiResponse } from "@/commons/lib/http/responses"
import { selectIdAndSubscriptionIdEstablishmentByUserIdApi } from "./establishment.api"
import { getPlanConfigBySlugApi } from "@/back/configuration/service/plan.api"
import { SubscriptionInconsistencyPayload, SubscriptionPayloadCookie, SubscriptionPreApprovalPayload, SubscriptionUpdatePayload, UpdateSubscription } from "@/commons/models/subscription"
import { getPreApprovalPlanPaymentApi, getAuthorizedPaymentApi } from "@/back/payment/service/payment.api"
import { saveInvoiceFromAuthorizedPaymentApi } from "@/back/payment/service/invoice.api"
import { getPreapprovalApi } from "@/back/payment/service/payment.api"
import { MercadoPagoStatusEnum } from "@/commons/enums/subscription"
import { PreApprovalResponse } from "mercadopago/dist/clients/preApproval/commonTypes"
import { clearToken, getToken, setToken } from "@/commons/lib/auth/subscription"
import { nowBrazilIso, toIsoOrNull } from "@/commons/utils/helper"

export const getSubscriptionByIdApi = async (subscriptionId: string) => {
  const { data, error } = await getSubscriptionByIdSupabase(subscriptionId)
  if (error || !data) {
    return ApiResponse.NotFound({
      message: "Assinatura não encontrada.",
      error: error?.message || "Nenhuma assinatura encontrada com o ID fornecido."
    })
  }

  return ApiResponse.Ok({
    message: "Assinatura encontrada com sucesso.",
    data: data
  })
}

export const createCheckoutSessionApi = async (mpPayerEmail: string) => {
  const userResult = await getUserLoggedApi()
  if (!userResult.data) {
    return ApiResponse.Unauthorized({
      message: userResult.message,
      error: userResult.error || "Usuário não autenticado"
    })
  }

  const user = userResult.data.user
  const userId = user?.id
  const userEmail = user?.email

  if (!userId || !userEmail) {
    return ApiResponse.Unauthorized({
      message: "Usuário ou email não encontrados."
    })
  }

  console.log("Usuário autenticado:", { userId, userEmail })

  // Buscar establishment do usuário
  const establishmentResult = await selectIdAndSubscriptionIdEstablishmentByUserIdApi(userId)
  if (establishmentResult.error || !establishmentResult.data) {
    return ApiResponse.NotFound({
      message: "Nenhum estabelecimento associado."
    })
  }

  const establishment = establishmentResult.data
  console.log("Estabelecimento encontrado:", establishment)

  // Buscar configuração do plano 'starter'
  const planConfigResult = await getPlanConfigBySlugApi('financier-luluzinha')
  if (planConfigResult.error || !planConfigResult.data) {
    return ApiResponse.NotFound({
      message: "O plano 'Luluzinha' não foi localizado."
    })
  }

  const planConfig = planConfigResult.data
  console.log("Configuração do plano encontrada:", planConfig)

  // Criar ou atualizar subscription
  const updatedSubscriptionResult = await upsertSubscriptionApi(
    {
      subscriptionId: establishment.subscription_id,
      planName: planConfig.name,
      planPrice: planConfig.price,
      mpPlanId: planConfig.mp_plan_id,
      establishmentId: establishment.id,
      mpPayerEmail
    }
  )

  if (updatedSubscriptionResult.error || !updatedSubscriptionResult.data?.id) {
    return ApiResponse.InternalError({
      message: updatedSubscriptionResult.message,
      error: updatedSubscriptionResult.error || "Erro ao criar/atualizar subscription"
    })
  }

  const subscriptionId = updatedSubscriptionResult.data.id
  console.log("Subscription criada/atualizada com sucesso:", subscriptionId)

  const initPoint = await getPreApprovalPlanPaymentApi(planConfig.mp_plan_id)

  if (initPoint.error || !initPoint.data) {
    return ApiResponse.InternalError({
      message: initPoint.message,
      error: initPoint.error || "Erro ao criar pré pagamento"
    })
  }

  const initPointUrl = `${initPoint.data}&external_reference=${subscriptionId}&prefill_email=${encodeURIComponent(userEmail)}`
  
  return ApiResponse.Ok({
    message: "Checkout session criada com sucesso",
    data: initPointUrl
  })
}

export const upsertSubscriptionApi = async (updateSubscription: UpdateSubscription) => {
  const subscriptionData: SubscriptionPreApprovalPayload = {
    base_value: updateSubscription.planPrice,
    plan_name: updateSubscription.planName,
    mp_preapproval_plan_id: updateSubscription.mpPlanId,
    mp_payer_email: updateSubscription.mpPayerEmail,
    mp_status: MercadoPagoStatusEnum.Pending,
    updated_at: nowBrazilIso(),
  }

  const { data, error } = await upsertSubscriptionSupabase(
    subscriptionData,
    updateSubscription.subscriptionId,
    updateSubscription.establishmentId
  )

  if (error) {
    return ApiResponse.InternalError({
      message: "Falha ao atualizar subscription",
      error: error.message
    })
  }

  return ApiResponse.Ok({
    message: "Subscription atualizada com sucesso",
    data: data
  })
}

const addInconsistencyApi = async (preapproval: PreApprovalResponse, reason: string) => {
  const payload: SubscriptionInconsistencyPayload = {
    mp_preapproval_id: preapproval.id!,
    issue_reason: reason,
    mp_payer_id: preapproval.payer_id,
    payer_email_received: preapproval.payer_email ?? null,
    payment: preapproval.status,
    preapproval_data: JSON.stringify(preapproval),
    created_at: nowBrazilIso(),
  }

  const result = await addInconsistencySupabase(payload)

  if (!result) {
    return ApiResponse.InternalError({
      message: `Erro ao tentar registrar inconsistência de e-mail para o e-mail: ${preapproval.payer_email}`
    })
  }

  return ApiResponse.Created({
    message: "Inconsistência de e-mail encontrada. Registro realizado com sucesso.",
  })
}

const updateSubscriptionPreapprovalApi = async (preapproval: PreApprovalResponse) => {
  let subscription = null
  const syncEmail = "vinnicius4@hotmail.com"

  console.info(`🔄 [SERVICE:updatePreapproval] Buscando subscription por email: ${syncEmail}`)
  if (syncEmail) { //(preapproval.payer_email) {
    subscription = await getSubscriptionByPayerEmailSupabase(syncEmail) //(preapproval.payer_email)
    console.info(`🔄 [SERVICE:updatePreapproval] Resultado busca por email:`, subscription ? { id: subscription.id, mp_status: subscription.mp_status } : null)
  }

  if (!subscription && typeof preapproval.payer_id === "number") {
    console.info(`🔄 [SERVICE:updatePreapproval] Buscando subscription por payer_id: ${preapproval.payer_id}`)
    subscription = await getSubscriptionByPayerIdSupabase(preapproval.payer_id)
    console.info(`🔄 [SERVICE:updatePreapproval] Resultado busca por payer_id:`, subscription ? { id: subscription.id, mp_status: subscription.mp_status } : null)
  }

  if (!subscription) {
    const reason = `E-mail ${syncEmail} não vinculado a conta da manicure.`
    console.warn(`⚠️ [SERVICE:updatePreapproval] Subscription não encontrada. Registrando inconsistência: ${reason}`)
    await addInconsistencyApi(preapproval, reason)
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

  console.info(`🔄 [SERVICE:updatePreapproval] Payload de atualização:`, payload)
  const updateResult = await syncSubscriptionSupabase(payload, syncEmail)
  console.info(`🔄 [SERVICE:updatePreapproval] Resultado syncSubscription:`, updateResult)
  return updateResult
}

export const subscriptionPreapprovalApi = async (preapprovalId: string) => {
  try {
    console.info(`📋 [SERVICE:preapproval] Buscando preapproval no MP | id: ${preapprovalId}`)
    const preapprovalResult = await getPreapprovalApi(preapprovalId)
    if (preapprovalResult.error || !preapprovalResult.data) {
      console.error(`❌ [SERVICE:preapproval] Falha ao buscar preapproval no MP`, { error: preapprovalResult.error, message: preapprovalResult.message })
      return ApiResponse.InternalError({ 
        message: preapprovalResult.message, 
        error: preapprovalResult.error 
      })
    }

    console.info(`📋 [SERVICE:preapproval] Preapproval encontrado:`, {
      id: preapprovalResult.data.id,
      status: preapprovalResult.data.status,
      payer_email: preapprovalResult.data.payer_email,
      payer_id: preapprovalResult.data.payer_id,
      date_created: preapprovalResult.data.date_created,
      next_payment_date: preapprovalResult.data.next_payment_date,
    })

    if (!preapprovalResult.data.status) {
      console.error(`❌ [SERVICE:preapproval] Status ausente no preapproval`)
      return ApiResponse.InternalError({
        message: "Status do preapproval não encontrado."
      })
    }

    console.info(`📋 [SERVICE:preapproval] Atualizando subscription local...`)
    const updatedSubscriptionResult = await updateSubscriptionPreapprovalApi(preapprovalResult.data)

    if (!updatedSubscriptionResult) {
      console.error(`❌ [SERVICE:preapproval] Subscription não encontrada para atualização`)
      return ApiResponse.NotFound({
        message: "Assinatura associada ao email do pagador não encontrada."
      })
    }

    console.info(`✅ [SERVICE:preapproval] Subscription atualizada:`, updatedSubscriptionResult)
    return ApiResponse.Ok({
      message: 'Preapproval processado com sucesso',
      data: updatedSubscriptionResult
    })
  } catch (error) {
    console.error('❌ [SERVICE:preapproval] Erro inesperado:', error)
    return ApiResponse.InternalError({
      message: 'Erro ao processar preapproval',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}

export const subscriptionAuthorizedPaymentApi = async (authorizedPaymentId: string) => {
  try {
    console.info(`💳 [SERVICE:authorized_payment] Buscando authorized_payment no MP | id: ${authorizedPaymentId}`)
    const authorizedPaymentResult = await getAuthorizedPaymentApi(authorizedPaymentId)
    if (authorizedPaymentResult.error || !authorizedPaymentResult.data) {
      console.error(`❌ [SERVICE:authorized_payment] Falha ao buscar no MP`, { error: authorizedPaymentResult.error, message: authorizedPaymentResult.message })
      return ApiResponse.InternalError({
        message: authorizedPaymentResult.message,
        error: authorizedPaymentResult.error,
      })
    }

    const authorizedPayment = authorizedPaymentResult.data
    console.info(`💳 [SERVICE:authorized_payment] Dados recebidos:`, {
      id: authorizedPayment.id,
      preapproval_id: authorizedPayment.preapproval_id,
      payer_id: authorizedPayment.payer_id,
      status: authorizedPayment.status,
      transaction_amount: authorizedPayment.transaction_amount,
      debit_date: authorizedPayment.debit_date,
    })

    console.info(`💳 [SERVICE:authorized_payment] Salvando invoice...`)
    const invoiceResult = await saveInvoiceFromAuthorizedPaymentApi(authorizedPayment)
    if (invoiceResult.error) {
      console.warn(`⚠️ [SERVICE:authorized_payment] Falha ao salvar fatura, continuando:`, invoiceResult.error)
    } else {
      console.info(`💳 [SERVICE:authorized_payment] Invoice salva com sucesso`)
    }

    const preapprovalId = authorizedPayment.preapproval_id!
    console.info(`💳 [SERVICE:authorized_payment] Encaminhando para subscriptionPreapprovalApi | preapprovalId: ${preapprovalId}`)
    return await subscriptionPreapprovalApi(preapprovalId)
  } catch (error) {
    console.error('❌ [SERVICE:authorized_payment] Erro inesperado:', error)
    return ApiResponse.InternalError({
      message: 'Erro ao processar authorized_payment',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const manageUserSubscriptionApi = async (userId: string) => {
  const subscriptionCookieData = await getToken()
  if (subscriptionCookieData) {
    const subscriptionParsedData: SubscriptionPayloadCookie = JSON.parse(subscriptionCookieData)
    return ApiResponse.Ok({
      message: "Dados de assinatura encontrados no cookie.",
      data: subscriptionParsedData
    })
  }

  const subscription = await getSubscriptionIdByUserIdSupabase(userId)
  if (!subscription) {
    return ApiResponse.NotFound({
      message: "Nenhuma assinatura encontrada para o usuário."
    })
  }

  const payload: SubscriptionPayloadCookie = {
    subscriptionId: subscription.id,
    status: subscription.mp_status,
    currentPeriodEnd: subscription.current_period_end
  }

  const payloadString = JSON.stringify(payload)
  await setToken(payloadString)

  return ApiResponse.Ok({
    message: "Dados de assinatura encontrados e armazenados no cookie.",
    data: payload
  })
}

export const refreshSubscriptionApi = async (userId: string) => {
  await clearToken()

  const subscription = await getSubscriptionIdByUserIdSupabase(userId)
  if (!subscription) {
    return ApiResponse.NotFound({
      message: "Nenhuma assinatura encontrada para o usuário."
    })
  }

  const payload: SubscriptionPayloadCookie = {
    subscriptionId: subscription.id,
    status: subscription.mp_status,
    currentPeriodEnd: subscription.current_period_end
  }

  const payloadString = JSON.stringify(payload)
  await setToken(payloadString)

  return ApiResponse.Ok({
    message: "Dados de assinatura atualizados com sucesso.",
    data: payload
  })
}

export const associateSubscriptionPayerEmailApi = async (userId: string, mpPayerEmail: string) => {
  const establishmentResult = await selectIdAndSubscriptionIdEstablishmentByUserIdApi(userId)
  if (establishmentResult.error || !establishmentResult.data?.subscription_id) {
    return ApiResponse.NotFound({
      message: "Nenhuma assinatura vinculada ao usuário encontrada."
    })
  }

  const payload: SubscriptionUpdatePayload = {
    mp_payer_email: mpPayerEmail,
    updated_at: nowBrazilIso(),
  }

  const { data, error } = await updateSubscriptionByIdSupabase(
    establishmentResult.data.subscription_id,
    payload
  )

  if (error) {
    return ApiResponse.InternalError({
      message: "Falha ao associar e-mail à assinatura",
      error: error.message
    })
  }

  return ApiResponse.Ok({
    message: "E-mail associado à assinatura com sucesso",
    data: data
  })
}