import { SearchProcedure } from "./search";
import { ProcedureFormatted } from "@/commons/models/procedure";
import { ProceduresCard } from "./card";
import Header from "@/components/header/dashboard";
import { ProcedureFeedbackSearchNotFound } from "./feedback";
import { NewProcedureButton } from "./new-procedure-button";

type ProceduresProps = {
  procedures: ProcedureFormatted[];
}

export default async function Procedures({ procedures }: ProceduresProps) {
  return (
    <>
      <Header title="Procedimentos" />
      <div className="main-content">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-purple-900 leading-tight tracking-tight text-lg sm:text-xl font-bold">
                Menu de Procedimentos
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium hidden min-[480px]:block">
                Serviços disponíveis para encantar suas Poderosas.
              </p>
            </div>

            <NewProcedureButton />
          </div>

          <div className="w-full">
            <SearchProcedure placeholder="Buscar procedimento por nome..." />
          </div>
        </div>

        {procedures.length === 0 ? (
          <ProcedureFeedbackSearchNotFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {procedures.map((procedure) => (
              <ProceduresCard key={procedure.id} procedure={procedure} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}