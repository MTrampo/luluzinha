import Header from "@/components/header/dashboard";
import { getCustomersAction } from "@/actions/customer";
import { getProceduresAction } from "@/actions/procedure";
import { getActiveEstablishmentsAction } from "@/actions/establishment";
import { NewAppointment } from "@/features/dashboard/schedule/steps/new-appointment";

export default async function NewAppointmentPage() {
  const [customersRes, proceduresRes, activeEstablishmentRes] = await Promise.all([
    getCustomersAction(),
    getProceduresAction(),
    getActiveEstablishmentsAction()
  ]);

  const customers = customersRes.data || [];
  const procedures = proceduresRes.data?.filter(p => p.isActive) || [];
  const activeEstablishment = activeEstablishmentRes.activeEstablishment;

  return (
    <>
      <Header title="Novo Atendimento" />
      <div className="main-content">
        <NewAppointment
          customers={customers}
          procedures={procedures}
          activeEstablishment={activeEstablishment}
        />
      </div>
    </>
  )
}