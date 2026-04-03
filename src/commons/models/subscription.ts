import { Database } from "../types/database.types";

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