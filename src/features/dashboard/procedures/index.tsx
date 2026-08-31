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

            <CustomSheet
              title="Novo Procedimento"
              description="Preencha os dados abaixo para cadastrar um novo procedimento."
              trigger={
                <Button variant="theme" size="sm" className="font-bold gap-2 shadow-xs shrink-0 rounded-lg h-9 px-3.5">
                  <FaHeartCirclePlus className="text-xs" />
                  <span className="text-xs sm:text-sm">Novo Procedimento</span>
                </Button>
              }
            >
              <ProcedureForm />
            </CustomSheet>
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