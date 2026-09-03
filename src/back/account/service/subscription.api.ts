import { getUserLoggedApi } from "./auth.api"
import { getSubscriptionIdByUserIdSupabase, updateSubscriptionByIdSupabase, upsertSubscriptionSupabase } from "../repository/subscription.supabase"
import { ApiResponse } from "@/commons/lib/http/responses"
import { getEstablishmentsByOwnerIdApi } from "./establishment.api"
import { getPlanConfigBySlugApi } from "@/back/configuration/service/plan.api"
import { SubscriptionPayloadCookie, SubscriptionPreApprovalPayload, SubscriptionUpdatePayload, UpdateSubscription, subscriptionFormatter } from "@/commons/models/subscription"
import { createPreApprovalSubscriptionApi } from "@/back/payment/service/payment.api"
import { MercadoPagoStatusEnum } from "@/commons/enums/subscription"
import { clearCookieSubscription, getCookieSubscription, setCookieSubscription } from "@/commons/lib/auth/subscription"
import { nowBrazilIso } from "@/commons/utils/helper"
import { clientPreAproval } from "@/commons/lib/mercadopago/server"
import { getInvoicesByEstablishmentIdApi } from "@/back/payment/service/invoice.api"
import { invoiceFormatter } from "@/commons/models/payment"

export const createCheckoutSessionApi = async (mpPayerEmail: string, requestedPlanSlug: string) => {
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

  const establishmentResult = await getEstablishmentsByOwnerIdApi(userId)
  if (establishmentResult.error || !Array.isArray(establishmentResult.data) || establishmentResult.data.length === 0) {
    return ApiResponse.NotFound({
      message: "Nenhum estabelecimento associado."
    })
  }

  const establishment = establishmentResult.data[0]
  console.log("Estabelecimento encontrado:", establishment)

  const planConfigResult = await getPlanConfigBySlugApi(requestedPlanSlug)
  if (planConfigResult.error || !planConfigResult.data) {
    return ApiResponse.NotFound({
      message: `O plano '${requestedPlanSlug}' não foi localizado ou não está ativo no momento.`
    })
  }

  const planConfig = planConfigResult.data
  console.log("Configuração do plano encontrada:", planConfig)

  // Se o plano for gratuito (ex: Alpha R$ 0,00), ativa diretamente sem passar pelo Mercado Pago
  if (Number(planConfig.price) <= 0) {
    const freeActivation = await activateFreeSubscriptionApi(userId, requestedPlanSlug)
    if (freeActivation.error) {
      return ApiResponse.InternalError({
        message: freeActivation.message,
        error: freeActivation.error
      })
    }
    return ApiResponse.Ok<string>({
      message: "Plano gratuito ativado com sucesso!",
      data: "/painel"
    })
  }


  // Criar ou atualizar subscription
  const updatedSubscriptionResult = await upsertSubscriptionApi(
    {

      subscriptionId: establishment.subscription_id,
      planName: planConfig.name,
      planPrice: planConfig.price,
      mpPlanId: planConfig.mpPlanId,
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

  // Em ambiente de desenvolvimento Sandbox com vendedor de testes, usamos o e-mail do comprador de testes
  const targetPayerEmail = (process.env.ENVIRONMENT === "development" && process.env.MP_EMAIL_COMPRADOR_TEST)
    ? process.env.MP_EMAIL_COMPRADOR_TEST
    : mpPayerEmail

  // Criar assinatura individual pendente no Mercado Pago enviando o external_reference (subscriptionId)
  const initPoint = await createPreApprovalSubscriptionApi(
    targetPayerEmail,
    subscriptionId,
    planConfig.price,
    planConfig.name
  )

  if (initPoint.error || !initPoint.data) {
    return ApiResponse.InternalError({
      message: initPoint.message,
      error: initPoint.error || "Erro ao criar pré pagamento"
    })
  }

  // Persistir o ID da assinatura do Mercado Pago localmente para sincronizações ativas futuras
  if (initPoint.data.preapprovalId) {
    await updateSubscriptionByIdSupabase(subscriptionId, {
      mp_subscription_id: initPoint.data.preapprovalId,
      updated_at: nowBrazilIso()
    })
  }

  return ApiResponse.Ok({
    message: "Checkout session criada com sucesso",
    data: initPoint.data.initPoint
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

  let subscription = await getSubscriptionIdByUserIdSupabase(userId)
  if (!subscription) {
    return ApiResponse.NotFound({
      message: "Nenhuma assinatura encontrada para o usuário."
    })
  }

  // Sincronização ativa de contingência: se a assinatura local não estiver autorizada, mas tiver mp_subscription_id
  if (subscription.mp_status !== MercadoPagoStatusEnum.Authorized && subscription.mp_subscription_id) {
    try {
      console.info(`[SERVICE:refreshSubscription] Consultando status no MP para: ${subscription.mp_subscription_id}`)
      const mpData = await clientPreAproval.get({ id: subscription.mp_subscription_id })
      console.info(`[SERVICE:refreshSubscription] Status obtido no MP:`, { status: mpData?.status })

      if (mpData && mpData.status) {
        const { toIsoOrNull } = await import("@/commons/utils/helper")
        const updatePayload: SubscriptionUpdatePayload = {
          mp_status: mpData.status,
          current_period_start: toIsoOrNull(mpData.date_created),
          current_period_end: toIsoOrNull(mpData.next_payment_date),
          updated_at: nowBrazilIso()
        }
        await updateSubscriptionByIdSupabase(subscription.id, updatePayload)
        const updated = await getSubscriptionIdByUserIdSupabase(userId)
        if (updated) {
          subscription = updated
        }
      }
    } catch (err) {
      console.warn(`[SERVICE:refreshSubscription] Aviso na consulta direta ao MP:`, err)
    }
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

export const getUserSubscriptionDetailsApi = async () => {
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

  return ApiResponse.Ok({
    message: "Assinatura recuperada com sucesso.",
    data: subscriptionFormatter(subscription)
  })
}

export const cancelSubscriptionApi = async () => {
  const userResult = await getUserLoggedApi()
  const userId = userResult.data?.user?.id
  if (!userId) {
    return ApiResponse.Unauthorized({
      message: "Usuário não autenticado."
    })
  }

  // 1. Buscar a assinatura no banco de dados local
  const subscription = await getSubscriptionIdByUserIdSupabase(userId)
  if (!subscription) {
    return ApiResponse.NotFound({
      message: "Nenhuma assinatura ativa encontrada para este espaço."
    })
  }

  const mpSubscriptionId = subscription.mp_subscription_id
  if (!mpSubscriptionId) {
    return ApiResponse.BadRequest({
      message: "Assinatura não possui registro correspondente no Mercado Pago."
    })
  }

  // 2. Chamar o Mercado Pago para cancelar a assinatura
  try {
    console.info(`[SERVICE:cancelSubscription] Cancelando assinatura ${mpSubscriptionId} no Mercado Pago...`)
    const response = await clientPreAproval.update({
      id: mpSubscriptionId,
      body: {
        status: 'cancelled'
      }
    })
    console.info(`[SERVICE:cancelSubscription] Retorno Mercado Pago:`, response)
  } catch (error) {
    console.error(`[SERVICE:cancelSubscription] Erro ao cancelar no Mercado Pago:`, error)
    return ApiResponse.InternalError({
      message: "Falha ao solicitar o cancelamento junto ao Mercado Pago. Verifique sua conexão.",
      error: error instanceof Error ? error.message : String(error)
    })
  }

  // 3. Atualizar no Supabase local
  const payload: SubscriptionUpdatePayload = {
    mp_status: MercadoPagoStatusEnum.Cancelled,
    updated_at: nowBrazilIso(),
  }

  const { data, error } = await updateSubscriptionByIdSupabase(subscription.id, payload)
  if (error) {
    console.error(`[SERVICE:cancelSubscription] Erro ao atualizar no Supabase local:`, error)
    return ApiResponse.InternalError({
      message: "Assinatura cancelada no Mercado Pago, mas ocorreu uma falha ao atualizar o status local.",
      error: error.message
    })
  }

  // 4. Limpar/atualizar o cookie de assinatura local
  await clearCookieSubscription()
  const cookiePayload: SubscriptionPayloadCookie = {
    subscriptionId: subscription.id,
    status: MercadoPagoStatusEnum.Cancelled,
    currentPeriodEnd: subscription.current_period_end
  }
  await setCookieSubscription(JSON.stringify(cookiePayload))

  // Obter a assinatura atualizada do banco de dados
  const updatedSubscription = await getSubscriptionIdByUserIdSupabase(userId)

  return ApiResponse.Ok({
    message: "Assinatura cancelada com sucesso no seu espaço.",
    data: updatedSubscription ? subscriptionFormatter(updatedSubscription) : null
  })
}

export const syncSubscriptionStatusApi = async () => {
  const userResult = await getUserLoggedApi()
  const userId = userResult.data?.user?.id
  if (!userId) {
    return ApiResponse.Unauthorized({
      message: "Usuário não autenticado."
    })
  }

  // 1. Buscar a assinatura local
  const subscription = await getSubscriptionIdByUserIdSupabase(userId)
  if (!subscription) {
    return ApiResponse.NotFound({
      message: "Nenhuma assinatura ativa para sincronização."
    })
  }

  const mpSubscriptionId = subscription.mp_subscription_id
  if (!mpSubscriptionId) {
    return ApiResponse.BadRequest({
      message: "A assinatura local não está integrada ao Mercado Pago."
    })
  }

  // 2. Buscar status atualizado no Mercado Pago
  let mpStatus = subscription.mp_status
  let currentPeriodEnd = subscription.current_period_end

  try {
    console.info(`[SERVICE:syncSubscription] Buscando assinatura ${mpSubscriptionId} no Mercado Pago...`)
    const mpData = await clientPreAproval.get({ id: mpSubscriptionId })
    console.info(`[SERVICE:syncSubscription] Dados do Mercado Pago:`, { status: mpData.status, next_payment_date: mpData.next_payment_date })

    if (mpData.status) {
      mpStatus = mpData.status
    }
    const { toIsoOrNull } = require("@/commons/utils/helper")
    if (mpData.next_payment_date) {
      currentPeriodEnd = toIsoOrNull(mpData.next_payment_date)
    }
  } catch (error) {
    console.error(`[SERVICE:syncSubscription] Erro ao buscar dados do Mercado Pago:`, error)
    return ApiResponse.InternalError({
      message: "Falha ao obter status atualizado do Mercado Pago.",
      error: error instanceof Error ? error.message : String(error)
    })
  }

  // 3. Se houver divergências, atualizar banco e cookie
  if (mpStatus !== subscription.mp_status || currentPeriodEnd !== subscription.current_period_end) {
    const payload: SubscriptionUpdatePayload = {
      mp_status: mpStatus,
      current_period_end: currentPeriodEnd,
      updated_at: nowBrazilIso(),
    }

    const { data, error } = await updateSubscriptionByIdSupabase(subscription.id, payload)
    if (error) {
      console.error(`[SERVICE:syncSubscription] Falha ao atualizar banco de dados local:`, error)
    } else {
      console.info(`[SERVICE:syncSubscription] Banco de dados local sincronizado`)
    }
  }

  // Atualizar cookie
  await clearCookieSubscription()
  const cookiePayload: SubscriptionPayloadCookie = {
    subscriptionId: subscription.id,
    status: mpStatus,
    currentPeriodEnd: currentPeriodEnd
  }
  await setCookieSubscription(JSON.stringify(cookiePayload))

  // Obter a assinatura atualizada
  const updatedSubscription = await getSubscriptionIdByUserIdSupabase(userId)

  return ApiResponse.Ok({
    message: "Sua assinatura foi sincronizada com sucesso!",
    data: updatedSubscription ? subscriptionFormatter(updatedSubscription) : null
  })
}

export const getEstablishmentInvoicesApi = async () => {
  const userResult = await getUserLoggedApi()
  const userId = userResult.data?.user?.id
  if (!userId) {
    return ApiResponse.Unauthorized({
      message: "Usuário não autenticado."
    })
  }

  // 1. Buscar se o usuário possui algum estabelecimento como proprietário (owner)
  const establishmentResult = await getEstablishmentsByOwnerIdApi(userId)
  if (establishmentResult.error) {
    return ApiResponse.InternalError({
      message: establishmentResult.message,
      error: establishmentResult.error
    })
  }

  const establishments = establishmentResult.data
  if (!establishments || !Array.isArray(establishments) || establishments.length === 0) {
    // Não é proprietário de nenhum estabelecimento (pode ser convidado ou sem estabelecimento ainda)
    return ApiResponse.Ok({
      message: "Usuário não é proprietário de nenhum estabelecimento.",
      data: {
        isOwner: false,
        invoices: []
      }
    })
  }

  const establishment = establishments[0]

  // 2. Buscar faturas do estabelecimento
  const invoicesResult = await getInvoicesByEstablishmentIdApi(establishment.id)
  if (invoicesResult.error) {
    return ApiResponse.InternalError({
      message: invoicesResult.message,
      error: invoicesResult.error
    })
  }

  const invoices = invoicesResult.data || []
  const formattedInvoices = invoices.map(invoiceFormatter)

  return ApiResponse.Ok({
    message: "Faturas recuperadas com sucesso.",
    data: {
      isOwner: true,
      invoices: formattedInvoices
    }
  })
}

export const activateFreeSubscriptionApi = async (userId: string, requestedPlanSlug: string) => {
  const establishmentResult = await getEstablishmentsByOwnerIdApi(userId)
  if (establishmentResult.error || !Array.isArray(establishmentResult.data) || establishmentResult.data.length === 0) {
    return ApiResponse.NotFound({
      message: "Nenhum estabelecimento associado para ativar a assinatura."
    })
  }

  const establishment = establishmentResult.data[0]

  const planConfigResult = await getPlanConfigBySlugApi(requestedPlanSlug)
  if (planConfigResult.error || !planConfigResult.data) {
    return ApiResponse.NotFound({
      message: `O plano '${requestedPlanSlug}' não foi localizado ou não está ativo no momento.`
    })
  }

  const planConfig = planConfigResult.data

  const now = new Date()
  const currentPeriodStart = now.toISOString()
  // Validade de 30 dias para o plano Alpha
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const currentPeriodEnd = periodEnd.toISOString()

  const subscriptionData: SubscriptionPreApprovalPayload = {
    base_value: 0,
    plan_name: planConfig.name,
    mp_preapproval_plan_id: planConfig.mpPlanId,
    mp_status: MercadoPagoStatusEnum.Authorized,
    current_period_start: currentPeriodStart,
    current_period_end: currentPeriodEnd,
    updated_at: nowBrazilIso(),
  }

  const { data: updatedSub, error } = await upsertSubscriptionSupabase(
    subscriptionData,
    establishment.subscription_id,
    establishment.id
  )

  if (error || !updatedSub?.id) {
    return ApiResponse.InternalError({
      message: "Falha ao registrar assinatura gratuita.",
      error: error?.message
    })
  }

  const payload: SubscriptionPayloadCookie = {
    subscriptionId: updatedSub.id,
    status: MercadoPagoStatusEnum.Authorized,
    currentPeriodEnd: currentPeriodEnd
  }

  await setCookieSubscription(JSON.stringify(payload))

  return ApiResponse.Ok({
    message: "Assinatura gratuita ativada com sucesso!",
    data: payload
  })
}