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

export type InvoiceSupabase = Database['public']['Tables']['invoices']['Row']

export interface InvoiceFormatted {
  id: string
  establishmentId: string | null
  subscriptionId: string | null
  mpSubscriptionId: string | null
  mpPreapprovalId: string | null
  mpPayerId: number | null
  mpPayerEmail: string | null
  mpInvoiceId: string
  amount: number | null
  currency: string | null
  status: string | null
  paidAt: string | null
  createdAt: string | null
  updatedAt: string | null
  rawPayload: any

  // Formatted
  amountFormatted: string
  paidAtFormatted: string
  createdAtFormatted: string
  statusFormatted: string
  statusClassName: string
}

export const invoiceFormatter = (data: InvoiceSupabase): InvoiceFormatted => {
  let statusFormatted = "Pendente"
  let statusClassName = "bg-amber-50 text-amber-700 border border-amber-200"

  switch (data.status?.toLowerCase()) {
    case "approved":
    case "paid":
      statusFormatted = "Pago"
      statusClassName = "bg-emerald-50 text-emerald-700 border border-emerald-200"
      break
    case "pending":
    case "authorized":
      statusFormatted = "Pendente"
      statusClassName = "bg-amber-50 text-amber-700 border border-amber-200"
      break
    case "cancelled":
    case "canceled":
      statusFormatted = "Cancelado"
      statusClassName = "bg-rose-50 text-rose-700 border border-rose-200"
      break
    case "rejected":
    case "refunded":
    case "charged_back":
      statusFormatted = "Recusado"
      statusClassName = "bg-rose-50 text-rose-700 border border-rose-200"
      break
  }

  // Import dynamic helper formatting to keep layout clean
  const { formatCurrencyBRL, formatDate } = require("../utils/format")

  return {
    id: data.id,
    establishmentId: data.establishment_id,
    subscriptionId: data.subscription_id,
    mpSubscriptionId: data.mp_subscription_id,
    mpPreapprovalId: data.mp_preapproval_id,
    mpPayerId: data.mp_payer_id ? Number(data.mp_payer_id) : null,
    mpPayerEmail: data.mp_payer_email,
    mpInvoiceId: data.mp_invoice_id,
    amount: data.amount ? Number(data.amount) : 0,
    currency: data.currency,
    status: data.status,
    paidAt: data.paid_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    rawPayload: data.raw_payload,

    amountFormatted: formatCurrencyBRL(data.amount ? Number(data.amount) : 0),
    paidAtFormatted: data.paid_at ? formatDate(data.paid_at) : "Pendente",
    createdAtFormatted: formatDate(data.created_at),
    statusFormatted,
    statusClassName,
  }
}