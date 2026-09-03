import { serverSupabase } from "@/commons/lib/supabase/server";
import { WaitlistCreateInput } from "@/commons/models/waitlist";

export async function createWaitlistEntrySupabase(input: WaitlistCreateInput) {
  const supabase = await serverSupabase();

  const { data, error } = await supabase
    .from("waitlist")
    .insert({
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      origin: input.origin || "landing_pricing",
      notes: input.notes || null,
    })
    .select()
    .single();

  return { data, error };
}

export async function findWaitlistEntryByContactSupabase(params: { phone?: string | null; email?: string | null }) {
  const supabase = await serverSupabase();

  let query = supabase.from("waitlist").select("*");

  if (params.phone && params.email) {
    query = query.or(`phone.eq.${params.phone},email.eq.${params.email}`);
  } else if (params.phone) {
    query = query.eq("phone", params.phone);
  } else if (params.email) {
    query = query.eq("email", params.email);
  } else {
    return { data: null, error: null };
  }

  const { data, error } = await query.limit(1).maybeSingle();
  return { data, error };
}

export async function listWaitlistSupabase() {
  const supabase = await serverSupabase();

  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}
