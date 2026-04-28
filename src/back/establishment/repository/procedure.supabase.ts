import { serverSupabase } from "@/commons/lib/supabase/server";
import { ProcedureInsertPayload } from "@/commons/models/procedure";

export const addProcedureSupabase = async (payload: ProcedureInsertPayload) => {
  const supabase = await serverSupabase()
  const { data, error } = await supabase
    .from('procedures')
    .insert(payload)
    .select('*')
    .single()

  return { data, error }
}

export const updateProcedureSupabase = async (id: string, payload: Partial<ProcedureInsertPayload>) => {
  const supabase = await serverSupabase()
  const { data, error } = await supabase
    .from('procedures')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  return { data, error }
}

export const setProcedureActiveSupabase = async (id: string, isActive: boolean) => {
  const supabase = await serverSupabase()
  const { data, error } = await supabase
    .from('procedures')
    .update({ is_active: isActive })
    .eq('id', id)
    .select('id')
    .single()

  return { data, error }
}

export const deleteProcedureSupabase = async (id: string) => {
  const supabase = await serverSupabase()
  const { data, error } = await supabase
    .from('procedures')
    .delete()
    .eq('id', id)
    .select('id')
    .single()

  return { data, error }
}
