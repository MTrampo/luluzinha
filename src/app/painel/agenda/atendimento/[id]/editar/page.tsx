import Header from "@/components/header/dashboard";
import { getScheduleByIdAction } from "@/actions/schedule";
import { getProceduresAction } from "@/actions/procedure";
import { getActiveEstablishmentsAction } from "@/actions/establishment";
import { ErrorState } from "@/components/errors/error-state";
import { Metadata } from "next";
import { EditAppointment } from "@/features/dashboard/schedule/edit/edit-appointment";

export const metadata: Metadata = {
  title: "Editar Atendimento | Luluzinha",
  description: "Edite as informações e horário do atendimento.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAppointmentPage({ params }: PageProps) {
  const { id } = await params;

  const [scheduleRes, proceduresRes, activeEstablishmentRes] = await Promise.all([
    getScheduleByIdAction(id),
    getProceduresAction(),
    getActiveEstablishmentsAction()
  ]);

  if (!scheduleRes.data) {
    return (
      <>
        <Header title="Editar Atendimento" />
        <div className="main-content flex items-center justify-center min-h-[60vh]">
          <ErrorState
            type="not-found"
            title="Atendimento não encontrado"
            description="O atendimento que você está tentando editar não existe ou foi removido."
          />
        </div>
      </>
    );
  }

  const procedures = proceduresRes.data?.filter(p => p.isActive) || [];
  const activeEstablishment = activeEstablishmentRes.activeEstablishment;

  return (
    <>
      <Header title="Editar Atendimento" />
      <div className="main-content">
        <EditAppointment
          schedule={scheduleRes.data}
          procedures={procedures}
          activeEstablishment={activeEstablishment}
        />
      </div>
    </>
  );
}
