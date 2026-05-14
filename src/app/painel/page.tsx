import Header from "@/components/header/dashboard";
import { getSchedulesWeekAction } from "@/actions/schedule";
import { CardWeekDay } from "@/features/dashboard";

export default async function Home() {
  const schedulesRes = await getSchedulesWeekAction();
  const schedules = schedulesRes.data || [];

  return (
    <>
      <Header title="Início" />
      <div className="main-content">
        <h4 className="text-purple-900">Semana</h4>
        <CardWeekDay initialSchedules={schedules} />
      </div>
    </>
  )
}