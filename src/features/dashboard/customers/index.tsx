import { Button } from "@/components/ui/button";
import { CustomSheet } from "@/components/sheets/custom-sheet";
import { SearchInput } from "../../../components/inputs/search";
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
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-purple-900 leading-tight tracking-tight text-lg sm:text-xl font-bold">
                Suas Poderosas
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium hidden min-[480px]:block">
                Acompanhe e cuide das clientes do seu espaço.
              </p>
            </div>

            <CustomSheet
              title="Nova Poderosa"
              description="Preencha os dados abaixo para cadastrar uma nova cliente."
              trigger={
                <Button variant="theme" size="sm" className="font-bold gap-2 shadow-xs shrink-0 rounded-lg h-9 px-3.5">
                  <FaUserPlus className="text-xs" />
                  <span className="text-xs sm:text-sm">Nova Poderosa</span>
                </Button>
              }
            >
              <CustomerForm />
            </CustomSheet>
          </div>

          <div className="w-full">
            <SearchInput placeholder="Buscar Poderosa por nome ou celular..." />
          </div>
        </div>

        {customers.length === 0 ? (
          <CustomerFeedbackSearchNotFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
