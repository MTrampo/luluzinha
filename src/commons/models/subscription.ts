import { getSubscriptionStatus } from "@/components/maps/status-map";
import { Database } from "../types/database.types";
import { formatCurrencyBRL, formatDate } from "../utils/format";

export interface UpdateSubscription {
  subscriptionId: string | null;
  planName: string;
  planPrice: number;
  mpPlanId: string;
  establishmentId: string;
  mpPayerEmail: string;
}

export interface SubscriptionPayloadCookie {
  subscriptionId: string;
  status: string;
  currentPeriodEnd: string | null;
}

export type SubscriptionPreApprovalPayload = Database['public']['Tables']['subscriptions']['Insert']
export type SubscriptionUpdatePayload = Database['public']['Tables']['subscriptions']['Update']
export type SubscriptionInconsistencyPayload = Database['public']['Tables']['subscription_inconsistencies']['Insert']

export type SubscriptionSupabase = Database['public']['Tables']['subscriptions']['Row']

export interface SubscriptionFormatted {
  id: string;
  mpPreapprovalPlanId: string | null;
  mpSubscriptionId: string | null;
  mpStatus: string;
  planName: string | null;
  baseValue: number;
  extraUsersCount: number | null;
  extraUserPrice: number | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  mpPayerId: number | null;
  mpPayerEmail: string | null;

  // Formatted
  mpStatusFormatted: string;
  baseValueFormatted: string;
  currentPeriodStartFormatted: string;
  currentPeriodEndFormatted: string;
  createdAtFormatted: string;
  updatedAtFormatted: string;
}

export const subscriptionFormatter = (data: SubscriptionSupabase): SubscriptionFormatted => {
  return {
    id: data.id,
    mpPreapprovalPlanId: data.mp_preapproval_plan_id,
    mpSubscriptionId: data.mp_subscription_id,
    mpStatus: data.mp_status,
    planName: data.plan_name,
    baseValue: data.base_value,
    extraUsersCount: data.extra_users_count,
    extraUserPrice: data.extra_user_price,
    currentPeriodStart: data.current_period_start,
    currentPeriodEnd: data.current_period_end,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    mpPayerId: data.mp_payer_id,
    mpPayerEmail: data.mp_payer_email,

    // Formatted fields
    mpStatusFormatted: getSubscriptionStatus(data.mp_status).label,
    baseValueFormatted: formatCurrencyBRL(data.base_value),
    currentPeriodStartFormatted: formatDate(data.current_period_start),
    currentPeriodEndFormatted: formatDate(data.current_period_end),
    createdAtFormatted: formatDate(data.created_at),
    updatedAtFormatted: formatDate(data.updated_at),
  }
}