import { serverSupabase } from "@/commons/lib/supabase/server";

export async function getPlanConfigBySlugSupabase(slug: string) {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('config_plans')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  return {  data, error }
}