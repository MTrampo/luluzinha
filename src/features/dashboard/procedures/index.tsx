import { Button } from "@/components/ui/button";
import { CustomSheet } from "@/components/sheets/custom-sheet";
import { SearchProcedure } from "./search";
import { ProcedureFormatted } from "@/commons/models/procedure";
import { ProcedureForm } from "@/components/forms/procedure-form";
import { ProceduresCard } from "./card";
import { FaHeartCirclePlus } from "react-icons/fa6";
import Header from "@/components/header/dashboard";
import { ProcedureFeedbackSearchNotFound } from "./feedback";

type ProceduresProps = {
  procedures: ProcedureFormatted[];
}

export default async function Procedures({ procedures }: ProceduresProps) {
  return (
    <>
      <Header title="Procedimentos" />
      <div className="main-content">
        <div className="flex justify-between items-center mb-6">
          <SearchProcedure />
          <CustomSheet
            title="Novo Procedimento"
            description="Preencha os dados abaixo para cadastrar um novo procedimento."
            trigger={
              <Button size='sm'>
                <FaHeartCirclePlus />
                Novo Procedimento
              </Button>
            }
          >
            <ProcedureForm />
          </CustomSheet>
        </div>

        {procedures.length === 0 ? (
          <ProcedureFeedbackSearchNotFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {procedures.map((procedure) => (
              <ProceduresCard key={procedure.id} procedure={procedure} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}