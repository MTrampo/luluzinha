import { SearchProcedure } from "./search";
import { ProcedureFormatted, ProcedureLimitInfo } from "@/commons/models/procedure";
import { ProceduresCard } from "./card";
import Header from "@/components/header/dashboard";
import { ProcedureFeedbackSearchNotFound } from "./feedback";
import { NewProcedureButton } from "./new-procedure-button";

type ProceduresProps = {
  procedures: ProcedureFormatted[];
  limitInfo?: ProcedureLimitInfo | null;
}

export default async function Procedures({ procedures, limitInfo }: ProceduresProps) {
  const totalCount = limitInfo?.totalCount ?? procedures.length;
  const maxProcedures = limitInfo?.maxProcedures ?? 6;
  const canAddMore = limitInfo?.canAddMore ?? (totalCount < maxProcedures);
  const planName = limitInfo?.planName ?? "Fundadoras";

  return (
    <>
      <Header title="Procedimentos" />
      <div className="main-content">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-purple-900 leading-tight tracking-tight text-lg sm:text-xl font-bold">
                  Menu de Procedimentos
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200/60">
                  {totalCount} de {maxProcedures} cadastrados
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium hidden min-[480px]:block">
                Serviços disponíveis para encantar suas Poderosas.
              </p>
            </div>

            <NewProcedureButton
              canAddMore={canAddMore}
              totalCount={totalCount}
              maxProcedures={maxProcedures}
              planName={planName}
            />
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