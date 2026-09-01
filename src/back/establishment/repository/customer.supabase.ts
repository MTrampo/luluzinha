import { CustomerInsertPayload, CustomerUpdatePayload } from "@/commons/models/customer";
import { serverSupabase } from "@/commons/lib/supabase/server";

export const addCustomerSupabase = async (payload: CustomerInsertPayload) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('customers')
    .insert(payload)
    .select()
    .single();

  return { data, error };
}

export const updateCustomerSupabase = async (id: string, payload: Partial<CustomerUpdatePayload>) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('customers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export const deleteCustomerSupabase = async (id: string) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export const getCustomersByEstablishmentSupabase = async (establishmentId: string) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('establishment_id', establishmentId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export const getCustomersPaginatedSupabase = async (
  establishmentId: string,
  params: { page: number; pageSize: number; search?: string }
) => {
  const { page, pageSize, search } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await serverSupabase();
  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .eq('establishment_id', establishmentId);

  if (search && search.trim() !== '') {
    const term = search.trim();
    query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  return { data, count: count ?? 0, error };
}
