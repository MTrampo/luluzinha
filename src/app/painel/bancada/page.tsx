import Header from "@/components/header/dashboard";

import { getActiveEstablishmentsAction } from "@/actions/establishment";
import { redirect } from "next/navigation";
import EstablishmentDashboard from "@/features/dashboard/establishment";

export default async function BancadaPage() {
  const { activeEstablishment } = await getActiveEstablishmentsAction();

  if (!activeEstablishment) {
    redirect("/painel");
  }

  return (
    <>
      <Header title="Minha Bancada" />
      <div className="main-content">
        <EstablishmentDashboard establishment={activeEstablishment} />
      </div>
    </>
  );
}
