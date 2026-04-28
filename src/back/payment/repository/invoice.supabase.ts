import { serverSupabase } from "@/commons/lib/supabase/server"
import { InvoiceInsertPayload, InvoiceUpdatePayload } from "@/commons/models/payment"

export const upsertInvoiceSupabase = async (payload: InvoiceInsertPayload) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('invoices')
    .upsert(payload, { onConflict: 'mp_invoice_id' })
    .select('id')
    .single()

  return { data, error }
}

export const getInvoicesByEstablishmentIdSupabase = async (establishmentId: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('invoices')
    .select()
    .eq('establishment_id', establishmentId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export const getInvoiceByMpInvoiceIdSupabase = async (mpInvoiceId: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('invoices')
    .select()
    .eq('mp_invoice_id', mpInvoiceId)
    .single()

  return { data, error }
}

export const updateInvoiceByMpInvoiceIdSupabase = async (mpInvoiceId: string, payload: InvoiceUpdatePayload) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('invoices')
    .update(payload)
    .eq('mp_invoice_id', mpInvoiceId)
    .select('id')
    .single()

  return { data, error }
}
