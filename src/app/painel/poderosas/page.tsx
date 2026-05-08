import { getCustomersAction } from "@/actions/customer";
import { CustomerFeedbackEmpty, CustomerFeedbackError } from "@/features/customers/feedback";
import Customers from "@/features/customers";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
}

export default async function PoderosasPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const response = await getCustomersAction();

  if (response.status !== 200) {
    return <CustomerFeedbackError message={response.message} />
  }

  let customers = response.data || [];

  if (customers.length === 0 && !q) {
    return <CustomerFeedbackEmpty />
  }

  if (q) {
    const term = q.toLowerCase();
    customers = customers.filter(customer => {

      const phoneDigits = customer.phone?.replace(/\D/g, "") || "";
      const searchDigits = q.replace(/\D/g, "");

      const matchName = customer.name.toLowerCase().includes(term);
      const matchPhone = searchDigits.length > 0 && phoneDigits.includes(searchDigits);

      return matchName || matchPhone;
    });
  }

  return <Customers customers={customers} />;
}