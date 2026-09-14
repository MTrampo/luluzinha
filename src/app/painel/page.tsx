import Header from "@/components/header/dashboard";
import { getSchedulesWeekAction } from "@/actions/schedule";
import { CardWeekDay } from "@/features/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início",
};

export default async function Home() {
  const schedulesRes = await getSchedulesWeekAction();
  const schedules = schedulesRes.data || [];

  return (
    <>
      <Header title="Início" />
      <div className="main-content">
        <h2 className="text-purple-900">Semana</h2>
        <CardWeekDay initialSchedules={schedules} />
      </div>
    </>
  )
}