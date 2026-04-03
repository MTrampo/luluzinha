import { ApiResponse } from "@/commons/lib/http/responses"
import { clientPreApprovalPlan, clientPreAproval, clientInvoice } from "@/commons/lib/mercadopago/server"

export const getPreApprovalPlanPaymentApi = async (preApprovalPlanId: string) => {
  try {
    const preApprovalPlan = await clientPreApprovalPlan.get({
      preApprovalPlanId
    })

    if (!preApprovalPlan || !preApprovalPlan.init_point) {
      return ApiResponse.InternalError({
        message: "Resposta inválida do Mercado Pago"
      })
    }

    return ApiResponse.Ok({
      message: "Link de pagamento gerado com sucesso",
      data: preApprovalPlan.init_point
    })
  } catch (error) {
    console.error("Erro ao criar pré pagamento no Mercado Pago:",  error)
    return ApiResponse.InternalError({
      message: "Erro ao processar pré pagamento",
      error: error instanceof Error ? error.message : "Erro desconhecido ao tentar criar préaprovação no Mercado Pago",
    })
  }
}

export const getPreapprovalApi = async (id: string) => {
  try {
    console.info(`🌐 [PAYMENT:getPreapproval] Consultando MP preapproval | id: ${id}`)
    const preapproval = await clientPreAproval.get({ id })

    if (!preapproval) {
      console.error(`❌ [PAYMENT:getPreapproval] Resposta nula do MP`)
      return ApiResponse.InternalError({ 
        message: "Resposta inválida do Mercado Pago ao consultar preapproval" 
      })
    }

    console.info(`🌐 [PAYMENT:getPreapproval] Resposta do MP:`, {
      id: preapproval.id,
      status: preapproval.status,
      payer_email: preapproval.payer_email,
      payer_id: preapproval.payer_id,
    })

    return ApiResponse.Ok({
      message: "Preapproval consultado com sucesso",
      data: preapproval
    })
  } catch (error) {
    console.error('❌ [PAYMENT:getPreapproval] Erro ao buscar no MP:', error)
    return ApiResponse.InternalError({ 
      message: 'Erro ao buscar preapproval', 
      error: error instanceof Error ? error.message : String(error) 
    })
  }
}

export const getAuthorizedPaymentApi = async (authorizedPaymentId: string) => {
  try {
    console.info(`🌐 [PAYMENT:getAuthorizedPayment] Consultando MP | id: ${authorizedPaymentId}`)
    const authorizedPayment = await clientInvoice.get({ id: authorizedPaymentId })

    if (!authorizedPayment?.preapproval_id) {
      console.error(`❌ [PAYMENT:getAuthorizedPayment] preapproval_id ausente na resposta`, authorizedPayment)
      return ApiResponse.InternalError({
        message: 'preapproval_id não encontrado na resposta de authorized_payment',
      })
    }

    console.info(`🌐 [PAYMENT:getAuthorizedPayment] Resposta do MP:`, {
      id: authorizedPayment.id,
      preapproval_id: authorizedPayment.preapproval_id,
      payer_id: authorizedPayment.payer_id,
      status: authorizedPayment.status,
      transaction_amount: authorizedPayment.transaction_amount,
    })

    return ApiResponse.Ok({
      message: 'Authorized payment consultado com sucesso',
      data: authorizedPayment,
    })
  } catch (error) {
    console.error('❌ [PAYMENT:getAuthorizedPayment] Erro ao buscar no MP:', error)
    return ApiResponse.InternalError({
      message: 'Erro ao buscar authorized_payment',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}