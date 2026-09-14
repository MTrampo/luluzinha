import { authSupabase, serverSupabase } from "@/commons/lib/supabase/server";
import { internalSupabase } from "@/commons/lib/supabase/internal";
import { SubscriptionPreApprovalPayload, SubscriptionUpdatePayload } from "@/commons/models/subscription";

async function getClient() {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return internalSupabase();
    }
  } catch {}
  return await serverSupabase();
}

export const getSubscriptionIdByUserIdSupabase = async (userId: string) => {
  const supabase = await serverSupabase()

  const { data } = await supabase
    .from('establishments')
    .select('subscriptions(*)')
    .eq('owner_id', userId)
    .single()

  return data?.subscriptions ?? null
}

export const getSubscriptionByMpSubscriptionIdSupabase = async (mpSubscriptionId: string) => {
  const supabase = await serverSupabase()

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('mp_subscription_id', mpSubscriptionId)
    .single()

  return data ?? null
}

export const upsertSubscriptionSupabase = async (
  subscriptionData: SubscriptionPreApprovalPayload,
  subscriptionId: string | null,
  establishmentId: string
) => {
  const supabase = await getClient()


  // Se existe subscription_id, atualiza. Caso contrário, cria um novo registro
  if (subscriptionId) {
    console.log("Atualizando subscription com ID:", subscriptionId)
    const { data, error } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('id', subscriptionId)
      .select('id')
      .single()

    console.log("Resultado do upsertSubscriptionSupabase (update):", { data, error })

    return { data, error }
  } else {
    console.log("Criando nova subscription com dados:", subscriptionData)
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select('id')
      .single()

    console.log("Resultado do upsertSubscriptionSupabase:", { data, error })

    if (!error && data?.id) {
      // Atualiza o establishment com o novo subscription_id

      console.log("Atualizando establishment com novo subscription_id:", data.id)
      await supabase
        .from('establishments')
        .update({ subscription_id: data.id })
        .eq('id', establishmentId)
    }

    return { data, error }
  }
}

export const updateSubscriptionByIdSupabase = async (subscriptionId: string, payload: SubscriptionUpdatePayload) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('subscriptions')
    .update(payload)
    .eq('id', subscriptionId)
    .select('id')
    .single()

  return { data, error }
}

export const getSubscriptionIdByUserIdAuthSupabase = async (userId: string, token: string) => {
  const supabase = authSupabase(token)

  const { data } = await supabase
    .from('establishments')
    .select('subscriptions(*)')
    .eq('owner_id', userId)

  if (Array.isArray(data) && data.length > 0) {
    return data[0].subscriptions ?? null
  }

  return null
}

export interface EstablishmentPlanLimits {
  planSlug: string;
  planName: string;
  maxProcedures: number;
  maxUsers: number;
  historyRetentionDays: number;
  isDefault: boolean;
  subscriptionStatus: string;
}

export const getPlanConfigByEstablishmentIdSupabase = async (establishmentId: string): Promise<{
  data: EstablishmentPlanLimits;
  error: null;
}> => {
  const supabase = await getClient();

  const fallbackLimits: EstablishmentPlanLimits = {
    planSlug: 'financier-luluzinha',
    planName: 'Fundadoras',
    maxProcedures: 6,
    maxUsers: 1,
    historyRetentionDays: 30,
    isDefault: true,
    subscriptionStatus: 'pending',
  };

  try {
    const { data: establishment } = await supabase
      .from('establishments')
      .select('id, subscription_id, subscriptions(*)')
      .eq('id', establishmentId)
      .maybeSingle();

    const subscription = establishment?.subscriptions as {
      mp_preapproval_plan_id?: string | null;
      mp_status?: string;
    } | null;

    if (subscription?.mp_preapproval_plan_id) {
      const { data: plan } = await supabase
        .from('plans')
        .select('*, config_plans(*)')
        .eq('mp_plan_id', subscription.mp_preapproval_plan_id)
        .maybeSingle();

      if (plan) {
        const config = (plan as unknown as { config_plans?: {
          max_procedures: number;
          max_users: number;
          history_retention_days: number;
          is_default: boolean;
        } })?.config_plans;

        if (config) {
          return {
            data: {
              planSlug: plan.slug,
              planName: plan.name,
              maxProcedures: config.max_procedures ?? 6,
              maxUsers: config.max_users ?? 1,
              historyRetentionDays: config.history_retention_days ?? 30,
              isDefault: config.is_default ?? false,
              subscriptionStatus: subscription.mp_status || 'pending',
            },
            error: null,
          };
        }
      }
    }

    // Se não encontrou plano específico, busca a configuração padrão (is_default = true)
    const { data: defaultConfig } = await supabase
      .from('config_plans')
      .select('*')
      .eq('is_default', true)
      .maybeSingle();

    if (defaultConfig) {
      return {
        data: {
          ...fallbackLimits,
          maxProcedures: defaultConfig.max_procedures ?? 6,
          maxUsers: defaultConfig.max_users ?? 1,
          historyRetentionDays: defaultConfig.history_retention_days ?? 30,
          subscriptionStatus: subscription?.mp_status || 'pending',
        },
        error: null,
      };
    }
  } catch (err) {
    console.error("Erro ao buscar limites do plano para o estabelecimento:", err);
  }

  return { data: fallbackLimits, error: null };
};