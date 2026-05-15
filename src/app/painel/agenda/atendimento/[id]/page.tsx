import Header from "@/components/header/dashboard";
import { getScheduleByIdAction } from "@/actions/schedule";
import { DetailsContent } from "@/features/dashboard/schedule/details/details-content";
import { ErrorState } from "@/components/errors/error-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhes do Atendimento | Luluzinha",
  description: "Visualize as informações detalhadas do atendimento da sua Poderosa.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const response = await getScheduleByIdAction(id);

  if (!response.data) {
    return (
      <>
        <Header title="Atendimento" />
        <div className="main-content flex items-center justify-center min-h-[60vh]">
          <ErrorState
            type="not-found"
            title="Atendimento não encontrado"
            description="O atendimento que você está procurando não existe ou foi removido."
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Detalhes do Atendimento" />
      <div className="main-content">
        <DetailsContent schedule={response.data} />
      </div>
    </>
  );
}
