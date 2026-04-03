import { serverSupabase } from "@/commons/lib/supabase/server"
import { InvoiceInsertPayload, InvoiceUpdatePayload } from "@/commons/models/payment"

export const upsertInvoiceSupabase = async (payload: InvoiceInsertPayload) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('invoices')
    .upsert(payload, { onConflict: 'mp_payment_id' })
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

export const getInvoiceByMpPaymentIdSupabase = async (mpPaymentId: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('invoices')
    .select()
    .eq('mp_payment_id', mpPaymentId)
    .single()

  return { data, error }
}

export const updateInvoiceByMpPaymentIdSupabase = async (mpPaymentId: string, payload: InvoiceUpdatePayload) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase
    .from('invoices')
    .update(payload)
    .eq('mp_payment_id', mpPaymentId)
    .select('id')
    .single()

  return { data, error }
}
