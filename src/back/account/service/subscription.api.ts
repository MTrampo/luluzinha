import { getUserLoggedApi } from "./auth.api"
import { upsertSubscriptionSupabase } from "../repository/subscription.supabase"
import { ApiResponse } from "@/commons/lib/http/responses"
import { selectIdAndSubscriptionIdEstablishmentByUserIdApi } from "./establishment.api"
import { getPlanConfigBySlugApi } from "@/back/configuration/service/plan.api"
import { UpdateSubscription } from "@/commons/models/subscription"
import { getPreApprovalPlanPaymentApi } from "@/back/payment/service/payment.api"
import { path } from "@/commons/utils/paths"

export const createCheckoutSessionApi = async () => {
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
      establishmentId: establishment.id
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

  const initPlan = await getPreApprovalPlanPaymentApi(planConfig.mp_plan_id)

  if (initPlan.error || !initPlan.data) {
    return ApiResponse.InternalError({
      message: initPlan.message,
      error: initPlan.error || "Erro ao criar pré pagamento"
    })
  }

  const initPlanUrl = `${initPlan.data}&external_reference=${subscriptionId}`
  
  return ApiResponse.Ok({
    message: "Checkout session criada com sucesso",
    data: initPlanUrl
  })
}

export const upsertSubscriptionApi = async (updateSubscription: UpdateSubscription) => {
  const { data, error } = await upsertSubscriptionSupabase(
    updateSubscription.subscriptionId,
    updateSubscription.planName,
    updateSubscription.planPrice,
    updateSubscription.mpPlanId,
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