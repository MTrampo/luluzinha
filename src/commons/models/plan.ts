import { Database } from "@/commons/types/database.types";
import { formatCurrencyBRL } from "@/commons/utils/format";

export type PlanConfigSupabase = Database['public']['Tables']['plans']['Row'];

export interface PlanConfigFormatted {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  priceFormatted: string;
  mpPlanId: string;
  maxProcedures: number;
  maxUsers: number;
  historyRetentionDays: number;
  billingPeriod: string;
  isActive: boolean;
  isFeatured: boolean;
  badge: string | null;
  sortOrder: number;
  features: string[];
}

export const planFormatter = (data: PlanConfigSupabase): PlanConfigFormatted => {
  let parsedFeatures: string[] = [];

  if (data.features) {
    if (Array.isArray(data.features)) {
      parsedFeatures = data.features.map(f => String(f));
    } else if (typeof data.features === 'string') {
      try {
        const parsed = JSON.parse(data.features);
        if (Array.isArray(parsed)) {
          parsedFeatures = parsed.map(f => String(f));
        }
      } catch {
        parsedFeatures = [];
      }
    }
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    priceFormatted: formatCurrencyBRL(Number(data.price)),
    mpPlanId: data.mp_plan_id,
    maxProcedures: data.max_procedures ?? 6,
    maxUsers: data.max_users ?? 1,
    historyRetentionDays: data.history_retention_days ?? 30,
    billingPeriod: data.billing_period || 'monthly',
    isActive: data.is_active ?? true,
    isFeatured: data.is_featured ?? false,
    badge: data.badge,
    sortOrder: data.sort_order ?? 0,
    features: parsedFeatures,
  };
};

export const plansFormatter = (data: PlanConfigSupabase[] | null): PlanConfigFormatted[] => {
  return data ? data.map(planFormatter) : [];
};
