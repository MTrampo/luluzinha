import { ApiResponse } from "@/commons/lib/http/responses";
import { getActivePlansSupabase, getPlanConfigBySlugSupabase } from "../repository/plan.supabase";
import { planFormatter, plansFormatter } from "@/commons/models/plan";

export async function getPlanConfigBySlugApi(slug: string) {
  const { data, error } = await getPlanConfigBySlugSupabase(slug);
  if (error || !data) {
    return ApiResponse.NotFound({
      message: `Plano '${slug}' não encontrado ou inativo.`,
      error: error?.message,
    });
  }

  return ApiResponse.Ok({
    message: "Plano obtido com sucesso.",
    data: planFormatter(data),
  });
}

export async function listActivePlansApi() {
  const { data, error } = await getActivePlansSupabase();
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar catálogo de planos.",
      error: error.message,
    });
  }

  return ApiResponse.Ok({
    message: "Planos ativos obtidos com sucesso.",
    data: plansFormatter(data),
  });
}