import { Database } from "../types/database.types"

export interface PreApprovalPaymentData {
  mpPlanId: string
  reason: string
  externalReference: string
  payerEmail: string
  backUrl: string
}

export type InvoiceInsertPayload = Database['public']['Tables']['invoices']['Insert']
export type InvoiceUpdatePayload = Database['public']['Tables']['invoices']['Update']