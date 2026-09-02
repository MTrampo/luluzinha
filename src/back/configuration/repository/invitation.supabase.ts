import { serverSupabase } from "@/commons/lib/supabase/server";

export async function getInvitationByTokenSupabase(token: string) {
  const supabase = await serverSupabase();

  const { data, error } = await supabase
    .from('plan_invitations')
    .select('*')
    .eq('token', token)
    .single();

  return { data, error };
}

export async function consumeInvitationSupabase(invitationId: string, userId: string) {
  const supabase = await serverSupabase();

  const { data, error } = await supabase
    .from('plan_invitations')
    .update({
      used_count: 1,
      used_at: new Date().toISOString(),
      used_by_user_id: userId,
      is_active: false,
    })
    .eq('id', invitationId)
    .select()
    .single();

  return { data, error };
}

export async function createInvitationSupabase(params: {
  token: string;
  planSlug: string;
  recipientName?: string;
  recipientEmail?: string;
  expiresInHours?: number;
}) {
  const supabase = await serverSupabase();
  const expiresInMs = (params.expiresInHours ?? 24) * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + expiresInMs).toISOString();

  const { data, error } = await supabase
    .from('plan_invitations')
    .insert({
      token: params.token,
      plan_slug: params.planSlug,
      recipient_name: params.recipientName ?? null,
      recipient_email: params.recipientEmail ?? null,
      max_uses: 1,
      used_count: 0,
      is_active: true,
      expires_at: expiresAt,
    })
    .select()
    .single();

  return { data, error };
}
