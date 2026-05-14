import Header from "@/components/header/dashboard";
import { BlocksList } from "@/features/dashboard/establishment/blocks-list";
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";

export default async function BlocksPage() {
  const activeId = (await getEstablishmentCookie())!;

  return (
    <>
      <Header title="Meus Bloqueios" />
      <div className="main-content relative overflow-hidden">
        <div className="absolute top-0 right-0 -u-z-10 w-1/2 h-1/2 bg-linear-to-br from-purple-100/40 to-transparent blur-3xl rounded-full" />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="text-purple-900">Gestão de Disponibilidade</h4>
            <p className="text-sm text-gray-500">Visualize e gerencie os horários que você reservou na sua agenda.</p>
          </div>

          <BlocksList establishmentId={activeId} />
        </div>
      </div>
    </>
  );
}
