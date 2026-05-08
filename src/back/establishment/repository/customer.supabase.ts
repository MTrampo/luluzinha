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
