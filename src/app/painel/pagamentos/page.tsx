import { redirect } from "next/navigation"
import { getUserLoggedAction } from "@/actions/auth"
import { getUserSubscriptionAction, getInvoicesAction } from "@/actions/subscription"
import PaymentsDashboard from "@/features/dashboard/payments"

export default async function PagamentosPage() {
  const userResult = await getUserLoggedAction()
  if (userResult.status !== 200 || !userResult.data?.user) {
    redirect("/")
  }

  const invoicesResult = await getInvoicesAction()
  const isOwner = invoicesResult.status === 200 ? !!invoicesResult.data?.isOwner : false
  const invoices = invoicesResult.status === 200 ? (invoicesResult.data?.invoices || []) : []

  let subscription = null
  if (isOwner) {
    const subResult = await getUserSubscriptionAction()
    subscription = subResult.status === 200 ? subResult.data : null
  }

  return (
    <PaymentsDashboard 
      subscription={subscription} 
      invoices={invoices} 
      isOwner={isOwner} 
    />
  )
}
