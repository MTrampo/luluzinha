import { Database } from "@/commons/types/database.types";
import { PlanConfigFormatted } from "./plan";

export type PlanInvitationSupabase = Database['public']['Tables']['plan_invitations']['Row'];

export interface PlanInvitationFormatted {
  id: string;
  token: string;
  planSlug: string;
  recipientName: string | null;
  recipientEmail: string | null;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  usedAt: string | null;
  usedByUserId: string | null;
  createdAt: string;
  isExpired: boolean;
  isAvailable: boolean;
  plan?: PlanConfigFormatted | null;
}

export const invitationFormatter = (
  data: PlanInvitationSupabase,
  plan?: PlanConfigFormatted | null
): PlanInvitationFormatted => {
  const expiresDate = new Date(data.expires_at).getTime();
  const now = Date.now();
  const isExpired = expiresDate <= now;
  const isAvailable = data.is_active && !isExpired && data.used_count < data.max_uses;

  return {
    id: data.id,
    token: data.token,
    planSlug: data.plan_slug,
    recipientName: data.recipient_name,
    recipientEmail: data.recipient_email,
    maxUses: data.max_uses,
    usedCount: data.used_count,
    isActive: data.is_active,
    expiresAt: data.expires_at,
    usedAt: data.used_at,
    usedByUserId: data.used_by_user_id,
    createdAt: data.created_at,
    isExpired,
    isAvailable,
    plan: plan ?? null,
  };
};
