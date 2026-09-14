import { ApiResponse } from "@/commons/lib/http/responses";
import { getActivePlansSupabase, getPlanConfigBySlugSupabase, getDefaultConfigPlanSupabase } from "../repository/plan.supabase";
import { planFormatter, plansFormatter, configPlanFormatter, ConfigPlanFormatted } from "@/commons/models/plan";

export async function getPlanConfigBySlugApi(slug: string) {
  const { data, error } = await getPlanConfigBySlugSupabase(slug);
  if (error || !data) {
    return ApiResponse.NotFound({
      message: `Plano '${slug}' não encontrado ou inativo.`,
      error: error?.message,
    });
  }

  const config = (data as unknown as { config_plans?: Parameters<typeof planFormatter>[1] })?.config_plans ?? null;

  return ApiResponse.Ok({
    message: "Plano obtido com sucesso.",
    data: planFormatter(data, config),
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

  const formatted = (data || []).map(p => {
    const config = (p as unknown as { config_plans?: Parameters<typeof planFormatter>[1] })?.config_plans ?? null;
    return planFormatter(p, config);
  });

  return ApiResponse.Ok({
    message: "Planos ativos obtidos com sucesso.",
    data: formatted,
  });
}

export async function getDefaultConfigPlanApi() {
  const { data, error } = await getDefaultConfigPlanSupabase();
  if (error || !data) {
    const fallbackConfig: ConfigPlanFormatted = {
      id: "default",
      name: "Padrão Luluzinha (Fundadoras)",
      maxProcedures: 6,
      maxUsers: 1,
      historyRetentionDays: 30,
      isDefault: true,
    };
    return ApiResponse.Ok({
      message: "Configuração padrão do sistema.",
      data: fallbackConfig,
    });
  }

  return ApiResponse.Ok({
    message: "Configuração padrão obtida com sucesso.",
    data: configPlanFormatter(data),
  });
}