"use client"

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScheduleCard } from "./card/schedule-card";
import { ScheduleBlockCard } from "./card/schedule-block-card";
import { NavCalendar } from "./nav-calendar";
import { ScheduleFilters, ScheduleDash } from "@/commons/models/schedule";
import { FaCalendarDays } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScheduleFeedbackEmpty } from "./feedback";
import { getFriendlyDateTitle } from "@/commons/utils/date";
import { SCHEDULE_TIMEZONE } from "@/commons/constants/schedule";
import { BlockScheduleSupabase } from "@/commons/models/schedule";

type TimelineItem = 
  | { type: 'schedule'; id: string; time: number; data: ScheduleDash }
  | { type: 'block'; id: string; time: number; data: BlockScheduleSupabase };

interface ScheduleProps {
  schedules: ScheduleDash[];
  blocks: BlockScheduleSupabase[];
  isMobileServer?: boolean;
}

export function Schedule({ schedules, blocks, isMobileServer }: ScheduleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dateParam ? new Date(dateParam + SCHEDULE_TIMEZONE) : new Date()
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filters, setFilters] = useState<ScheduleFilters>({
    statuses: [],
    highlights: []
  });

  const isMobileClient = useIsMobile();
  const isMobile = isMobileClient ?? isMobileServer;

  useEffect(() => {
    if (dateParam) {
      const newDate = new Date(dateParam + SCHEDULE_TIMEZONE);
      setSelectedDate(newDate);
    } else {
      setSelectedDate(new Date());
    }
  }, [dateParam]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const isoDate = date.toISOString().split('T')[0];
      router.push(`/painel/agenda?date=${isoDate}`);
      setIsSheetOpen(false);
    }
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(s.status)) {
        return false;
      }

      if (filters.highlights.length > 0) {
        const matchesNew = filters.highlights.includes('new') && s.customer.isNew;
        const matchesBirthday = filters.highlights.includes('birthday') && s.customer.isBirthdayToday;

        if (!matchesNew && !matchesBirthday) return false;
      }

      return true;
    });
  }, [schedules, filters]);

  const timelineItems = useMemo(() => {
    const scheduleItems: TimelineItem[] = filteredSchedules.map(s => ({
      type: 'schedule' as const,
      id: s.id,
      time: new Date(s.startAt).getTime(),
      data: s
    }))

    const blockItems: TimelineItem[] = blocks.map(b => {
      const [hours, minutes] = b.start_time.split(':');
      const blockDate = new Date(selectedDate || new Date());
      blockDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      return {
        type: 'block' as const,
        id: b.id,
        time: blockDate.getTime(),
        data: b
      };
    })

    const items: TimelineItem[] = [
      ...scheduleItems,
      ...blockItems
    ];

    return items.sort((a, b) => a.time - b.time);
  }, [filteredSchedules, blocks, selectedDate]);

  return (
    <div className="flex gap-6 relative">
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-purple-900 leading-tight tracking-tight">
              {getFriendlyDateTitle(selectedDate)}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              Acompanhe o ritmo da sua bancada e brilhe com suas{" "}
              <span className="text-purple-600 font-semibold">Poderosas</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-purple-600 hover:text-purple-700 hover:bg-purple-100/50 transition-all shrink-0 rounded-md"
                  title="Abrir Agenda"
                >
                  <FaCalendarDays size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-[320px] sm:w-[400px] border-l-purple-100">
                <NavCalendar
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="pt-2 space-y-6 w-full mx-auto">
          {timelineItems.length > 0 ? (
            <div className="flex flex-col gap-4">
              {timelineItems.map((item) => (
                item.type === 'schedule' ? (
                  <ScheduleCard key={item.id} schedule={item.data} isMobileServer={isMobileServer} />
                ) : (
                  <ScheduleBlockCard key={item.id} block={item.data} />
                )
              ))}
            </div>
          ) : (
            <ScheduleFeedbackEmpty />
          )}
        </div>
      </div>

      <div className="hidden lg:block relative w-xs shrink-0 self-start">
        <div className="sticky top-20 h-[calc(100vh-140px)] flex flex-col">
          <div className="w-full h-full bg-white rounded-md shadow-[0_20px_50px_rgba(147,51,234,0.06)] border border-purple-100 overflow-hidden flex flex-col min-h-0 flex-1">
            <NavCalendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
