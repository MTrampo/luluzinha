import { Database } from "@/commons/types/database.types";
import { formatCurrencyBRL } from "@/commons/utils/format";

export type PlanConfigSupabase = Database['public']['Tables']['plans']['Row'];
export type ConfigPlanSupabase = Database['public']['Tables']['config_plans']['Row'];

export interface ConfigPlanFormatted {
  id: string;
  name: string;
  maxProcedures: number;
  maxUsers: number;
  historyRetentionDays: number;
  isDefault: boolean;
}

export const configPlanFormatter = (data: ConfigPlanSupabase): ConfigPlanFormatted => {
  return {
    id: data.id,
    name: data.name,
    maxProcedures: data.max_procedures ?? 6,
    maxUsers: data.max_users ?? 1,
    historyRetentionDays: data.history_retention_days ?? 30,
    isDefault: data.is_default ?? false,
  };
};

export interface PlanConfigFormatted {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  priceFormatted: string;
  mpPlanId: string;
  configPlanId: string | null;
  maxProcedures: number;
  maxUsers: number;
  historyRetentionDays: number;
  billingPeriod: string;
  isActive: boolean;
  isFeatured: boolean;
  badge: string | null;
  sortOrder: number;
  features: string[];
  config?: ConfigPlanFormatted | null;
}

export const planFormatter = (
  data: PlanConfigSupabase,
  config?: ConfigPlanSupabase | null
): PlanConfigFormatted => {
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

  const maxProcedures = config?.max_procedures ?? 6;
  const maxUsers = config?.max_users ?? 1;
  const historyRetentionDays = config?.history_retention_days ?? 30;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    priceFormatted: formatCurrencyBRL(Number(data.price)),
    mpPlanId: data.mp_plan_id,
    configPlanId: data.config_plan_id,
    maxProcedures,
    maxUsers,
    historyRetentionDays,
    billingPeriod: data.billing_period || 'monthly',
    isActive: data.is_active ?? true,
    isFeatured: data.is_featured ?? false,
    badge: data.badge,
    sortOrder: data.sort_order ?? 0,
    features: parsedFeatures,
    config: config ? configPlanFormatter(config) : null,
  };
};

export const plansFormatter = (data: PlanConfigSupabase[] | null): PlanConfigFormatted[] => {
  return data ? data.map(p => planFormatter(p)) : [];
};
