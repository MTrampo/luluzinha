import { ApiResponse } from "@/commons/lib/http/responses";
import { selectIdAndSubscriptionIdEstablishmentByUserIdSupabase } from "../repository/establishment.supabase"

export const selectIdAndSubscriptionIdEstablishmentByUserIdApi = async (userId: string) => {
  const { data, error } = await selectIdAndSubscriptionIdEstablishmentByUserIdSupabase(userId)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar estabelecimento.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Estabelecimento obtidos com sucesso.",
    data: data
  });
}