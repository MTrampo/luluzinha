import { ApiResponse } from "@/commons/lib/http/responses";
import { getPlanConfigBySlugSupabase } from "../repository/plan.supabase";

export async function getPlanConfigBySlugApi(slug: string) {
  const { data, error } = await getPlanConfigBySlugSupabase(slug)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar plano.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Plano obtido com sucesso.",
    data: data
  });
}