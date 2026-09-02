import Header from "@/components/header/dashboard";
import { Schedule } from "@/features/dashboard/schedule";
import { getSchedulesByDateAction } from "@/actions/schedule";
import { todayBrazilIso } from "@/commons/utils/helper";

type SchedulePageProps = {
  searchParams: Promise<{ data?: string }>;
};

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const { data } = await searchParams;
  const targetDate = data || todayBrazilIso();

  const response = await getSchedulesByDateAction(targetDate);
  const { schedules = [], blocks = [] } = response.data || {};

  return (
    <>
      <Header title="Agenda" />
      <div className="main-content">
        <Schedule
          schedules={schedules}
          blocks={blocks}
        />
      </div>
    </>
  )
}