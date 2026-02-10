import Header from "@/components/header/dashboard";
import { InputSearch } from "@/components/inputs/search";
import { Button } from "@/components/ui/button";
import { CustomerCard } from "@/features/customers/card";
import { FaUserPlus } from "react-icons/fa6";

export default async function Customers() {
  return (
    <>
      <Header title="Poderosas"/>
      <div className="main-content">
        <div className="flex justify-between items-center">
          <InputSearch/>
          <Button size='sm'>
            <FaUserPlus />
            Nova Poderosa
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <CustomerCard />
          <CustomerCard />
          <CustomerCard />
          <CustomerCard />
          <CustomerCard />
          <CustomerCard />
          <CustomerCard />
          <CustomerCard />
        </div>
      </div>
    </>
  )
}