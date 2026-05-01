import { getUserLoggedApi } from "./auth.api"
import { getSubscriptionIdByUserIdSupabase, updateSubscriptionByIdSupabase, upsertSubscriptionSupabase } from "../repository/subscription.supabase"
import { ApiResponse } from "@/commons/lib/http/responses"
import { getEstablishmentsByOwnerIdApi } from "./establishment.api"
import { getPlanConfigBySlugApi } from "@/back/configuration/service/plan.api"
import { SubscriptionPayloadCookie, SubscriptionPreApprovalPayload, SubscriptionUpdatePayload, UpdateSubscription } from "@/commons/models/subscription"
import { getPreApprovalPlanPaymentApi } from "@/back/payment/service/payment.api"
import { MercadoPagoStatusEnum } from "@/commons/enums/subscription"
import { clearCookieSubscription, getCookieSubscription, setCookieSubscription } from "@/commons/lib/auth/subscription"
import { nowBrazilIso } from "@/commons/utils/helper"


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
  const establishmentResult = await getEstablishmentsByOwnerIdApi(userId)
  if (establishmentResult.error || !Array.isArray(establishmentResult.data) || establishmentResult.data.length === 0) {
    return ApiResponse.NotFound({
      message: "Nenhum estabelecimento associado."
    })
  }

  const establishment = establishmentResult.data[0]
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


export const manageUserSubscriptionApi = async () => {
  const subscriptionCookieData = await getCookieSubscription()
  if (subscriptionCookieData) {
    const subscriptionParsedData: SubscriptionPayloadCookie = JSON.parse(subscriptionCookieData)
    return ApiResponse.Ok({
      message: "Dados de assinatura encontrados no cookie.",
      data: subscriptionParsedData
    })
  }

  const userResult = await getUserLoggedApi()
  const userId = userResult.data?.user?.id
  if (!userId) {
    return ApiResponse.Unauthorized({
      message: "Usuário não autenticado."
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
  await setCookieSubscription(payloadString)

  return ApiResponse.Ok({
    message: "Dados de assinatura encontrados e armazenados no cookie.",
    data: payload
  })
}

export const refreshSubscriptionApi = async () => {
  await clearCookieSubscription()

  const userResult = await getUserLoggedApi()
  const userId = userResult.data?.user?.id
  if (!userId) {
    return ApiResponse.Unauthorized({
      message: "Usuário não autenticado."
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
  await setCookieSubscription(payloadString)

  return ApiResponse.Ok({
    message: "Dados de assinatura atualizados com sucesso.",
    data: payload
  })
}

export const associateSubscriptionPayerEmailApi = async (userId: string, mpPayerEmail: string) => {
  const establishmentResult = await getEstablishmentsByOwnerIdApi(userId)
  if (establishmentResult.error || !Array.isArray(establishmentResult.data) || establishmentResult.data.length === 0 || !establishmentResult.data[0].subscription_id) {
    return ApiResponse.NotFound({
      message: "Nenhuma assinatura vinculada ao usuário encontrada."
    })
  }

  const establishment = establishmentResult.data[0]

  const payload: SubscriptionUpdatePayload = {
    mp_payer_email: mpPayerEmail,
    updated_at: nowBrazilIso(),
  }

  const { data, error } = await updateSubscriptionByIdSupabase(
    establishment.subscription_id!,
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