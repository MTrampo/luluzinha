import Header from "@/components/header/dashboard";
import { InputSearch } from "@/components/inputs/search";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/features/services/card";
import { FaHeartCirclePlus } from "react-icons/fa6";

export default async function Services() {
  return (
    <>
      <Header title="Procedimentos" />
      <div className="main-content">
        <div className="flex justify-between items-center">
          <InputSearch/>
          <Button size='sm'>
            <FaHeartCirclePlus />
            Novo Procedimento
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
        </div>
      </div>
    </>
  )
}