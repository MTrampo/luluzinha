import { Button } from "@/components/ui/button";
import { CustomSheet } from "@/components/sheets/custom-sheet";
import { SearchCustomer } from "./search";
import { CustomerFormatted } from "@/commons/models/customer";
import { CustomerForm } from "@/components/forms/customer-form";
import { CustomerCard } from "./card";
import { FaUserPlus } from "react-icons/fa6";
import Header from "@/components/header/dashboard";
import { CustomerFeedbackSearchNotFound } from "./feedback";

type CustomersProps = {
  customers: CustomerFormatted[];
}

export default async function Customers({ customers }: CustomersProps) {
  return (
    <>
      <Header title="Poderosas" />
      <div className="main-content">
        <div className="flex justify-between items-center mb-6">
          <SearchCustomer />
          <CustomSheet
            title="Nova Poderosa"
            description="Preencha os dados abaixo para cadastrar uma nova cliente."
            trigger={
              <Button size='sm'>
                <FaUserPlus />
                Nova Poderosa
              </Button>
            }
          >
            <CustomerForm />
          </CustomSheet>
        </div>

        {customers.length === 0 ? (
          <CustomerFeedbackSearchNotFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
