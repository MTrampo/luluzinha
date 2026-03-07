import { MercadoPagoStatusEnum } from "@/commons/enums/subscription";
import { serverSupabase } from "@/commons/lib/supabase/server";
import { Database } from "@/commons/types/database.types";

export const getSubscriptionIdByUserIdSupabase = async (userId: string) => {
  const supabase = await serverSupabase()

  const { data } = await supabase
    .from('establishments')
    .select('subscription_id')
    .eq('owner_id', userId)
    .single()

  return data
}

export const upsertSubscriptionSupabase = async (
  subscriptionId: string | null | undefined,
  planName: string,
  baseValue: number,
  mpPreapprovalPlanId: string,
  establishmentId: string
) => {
  const supabase = await serverSupabase()

  const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] = {
    base_value: baseValue,
    plan_name: planName,
    mp_preapproval_plan_id: mpPreapprovalPlanId,
    mp_status: MercadoPagoStatusEnum.Pending,
    updated_at: new Date().toISOString(),
  }

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