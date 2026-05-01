import { ApiResponse } from "@/commons/lib/http/responses";
import { getEstablishmentsByOwnerIdSupabase } from "../repository/establishment.supabase"

export const getEstablishmentsByOwnerIdApi = async (userId: string) => {
  const { data, error } = await getEstablishmentsByOwnerIdSupabase(userId)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar estabelecimentos.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Estabelecimentos obtidos com sucesso.",
    data: data
  });
}