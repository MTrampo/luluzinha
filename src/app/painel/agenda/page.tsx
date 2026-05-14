import Header from "@/components/header/dashboard";
import { Schedule } from "@/features/dashboard/schedule";
import { headers } from "next/headers";
import { getSchedulesByDateAction } from "@/actions/schedule";
import { getBlocksByDateAction } from "@/actions/establishment-blocks";
import { todayBrazilIso } from "@/commons/utils/helper";

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date } = await searchParams;
  const targetDate = date || todayBrazilIso();

  const [schedulesRes, blocksRes] = await Promise.all([
    getSchedulesByDateAction(targetDate),
    getBlocksByDateAction(targetDate)
  ]);

  const schedules = schedulesRes.data || [];
  const blocks = blocksRes.data || [];

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobileServer = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  return (
    <>
      <Header title="Agenda" />
      <div className="main-content">
        <Schedule
          schedules={schedules}
          blocks={blocks}
          isMobileServer={isMobileServer}
        />
      </div>
    </>
  )
}