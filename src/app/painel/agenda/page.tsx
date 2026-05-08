import Header from "@/components/header/dashboard";
import { Schedule } from "@/features/schedule";
import { mockSchedules } from "@/commons/models/schedule";
import { headers } from "next/headers";

export default async function SchedulePage() {
  const schedules = mockSchedules;

  // Detecção simples de mobile no servidor para evitar flashes de hidratação
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobileServer = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  return (
    <>
      <Header title="Agenda" />
      <div className="main-content">
        <Schedule schedules={schedules} isMobileServer={isMobileServer} />
      </div>
    </>
  )
}