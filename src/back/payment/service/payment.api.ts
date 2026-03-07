import { ApiResponse } from "@/commons/lib/http/responses"
import { clientPreApprovalPlan } from "@/commons/lib/mercadopago/server"

export const getPreApprovalPlanPaymentApi = async (preApprovalPlanId: string) => {
  try {
    const preApproval = await clientPreApprovalPlan.get({
      preApprovalPlanId
    })

    if (!preApproval || !preApproval.init_point) {
      return ApiResponse.InternalError({
        message: "Resposta inválida do Mercado Pago"
      })
    }

    return ApiResponse.Ok({
      message: "Link de pagamento gerado com sucesso",
      data: preApproval.init_point
    })
  } catch (error) {
    console.error("Erro ao criar pré pagamento no Mercado Pago:",  error)
    return ApiResponse.InternalError({
      message: "Erro ao processar pré pagamento",
      error: error instanceof Error ? error.message : "Erro desconhecido ao tentar criar préaprovação no Mercado Pago",
    })
  }
}