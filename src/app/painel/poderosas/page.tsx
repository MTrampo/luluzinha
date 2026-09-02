import { getCustomersPaginatedAction } from "@/actions/customer";
import { CustomerFeedbackEmpty, CustomerFeedbackError } from "@/features/dashboard/customers/feedback";
import Customers from "@/features/dashboard/customers";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
}

export default async function PoderosasPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const response = await getCustomersPaginatedAction({ page: 1, pageSize: 12, search: q });

  if (response.status !== 200 || !response.data) {
    return <CustomerFeedbackError message={response.message || "Erro ao carregar clientes."} />
  }

  if (response.data.totalCount === 0 && !q) {
    return <CustomerFeedbackEmpty />
  }

  return <Customers initialData={response.data} searchTerm={q || ""} />;
}