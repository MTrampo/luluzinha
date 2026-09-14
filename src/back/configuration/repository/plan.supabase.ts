import { serverSupabase } from "@/commons/lib/supabase/server";

export async function getPlanConfigBySlugSupabase(slug: string) {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('plans')
    .select('*, config_plans(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  return { data, error }
}

export async function getActivePlansSupabase() {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('plans')
    .select('*, config_plans(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return { data, error }
}

export async function getDefaultConfigPlanSupabase() {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('config_plans')
    .select('*')
    .eq('is_default', true)
    .maybeSingle();

  return { data, error }
}