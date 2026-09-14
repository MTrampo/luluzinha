import Header from "@/components/header/dashboard";
import { Schedule } from "@/features/dashboard/schedule";
import { getSchedulesByDateAction } from "@/actions/schedule";
import { todayBrazilIso } from "@/commons/utils/helper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda de Atendimentos",
};

type SchedulePageProps = {
  searchParams: Promise<{ data?: string }>;
};

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const { data } = await searchParams;
  const targetDate = data || todayBrazilIso();

  const response = await getSchedulesByDateAction(targetDate);
  const { schedules = [], blocks = [], historyRetentionDays } = response.data || {};

  return (
    <>
      <Header title="Agenda" />
      <div className="main-content">
        <Schedule
          schedules={schedules}
          blocks={blocks}
          historyRetentionDays={historyRetentionDays}
        />
      </div>
    </>
  )
}