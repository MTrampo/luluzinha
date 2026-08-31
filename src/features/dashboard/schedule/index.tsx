"use client"

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScheduleCard } from "./card/schedule-card";
import { ScheduleCardMobile } from "./card/mobile/schedule-card";
import { ScheduleBlockCard } from "./card/schedule-block-card";
import { ScheduleBlockCardMobile } from "./card/mobile/schedule-block-card";
import { NavCalendar } from "./nav-calendar";
import { ScheduleFilters, ScheduleDash, BlockFormatted } from "@/commons/models/schedule";
import { FaCalendarDays } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useIsCompactMobile } from "@/hooks/use-mobile";
import { ScheduleFeedbackEmpty } from "./feedback";
import { getFriendlyDateTitle } from "@/commons/utils/date";
import { SCHEDULE_TIMEZONE } from "@/commons/constants/schedule";

type TimelineItem =
  | { type: 'schedule'; id: string; time: number; data: ScheduleDash }
  | { type: 'block'; id: string; time: number; data: BlockFormatted };

interface ScheduleProps {
  schedules: ScheduleDash[];
  blocks: BlockFormatted[];
}

export function Schedule({ schedules, blocks }: ScheduleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("data");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dateParam ? new Date(dateParam + SCHEDULE_TIMEZONE) : new Date()
  );
  const [prevDateParam, setPrevDateParam] = useState(dateParam);

  if (dateParam !== prevDateParam) {
    setPrevDateParam(dateParam);
    setSelectedDate(dateParam ? new Date(dateParam + SCHEDULE_TIMEZONE) : new Date());
  }

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filters, setFilters] = useState<ScheduleFilters>({
    statuses: [],
    highlights: [],
    showBlocks: false,
    search: ""
  });

  const isCompact = useIsCompactMobile();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const isoDate = date.toISOString().split('T')[0];
      router.push(`/painel/agenda?data=${isoDate}`);
    } else {
      router.push("/painel/agenda");
    }
    setIsSheetOpen(false);
  };

  const filteredSchedules = useMemo(() => {
    if (filters.showBlocks) return [];

    return schedules.filter(s => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(s.status)) {
        return false;
      }

      if (filters.highlights.length > 0) {
        const matchesNew = filters.highlights.includes('new') && s.customer.isNew;
        const matchesBirthday = filters.highlights.includes('birthday') && s.customer.isBirthdayToday;

        if (!matchesNew && !matchesBirthday) return false;
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        const customerName = s.customer.nameFormatted.toLowerCase();
        const procedures = s.procedures.map(p => p.name.toLowerCase()).join(" ");
        if (!customerName.includes(search) && !procedures.includes(search)) {
          return false;
        }
      }

      return true;
    });
  }, [schedules, filters]);

  const filteredBlocks = useMemo(() => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return blocks.filter(b => b.reason.toLowerCase().includes(search));
    }

    return blocks;
  }, [blocks, filters.search]);

  const timelineItems = useMemo(() => {
    const scheduleItems: TimelineItem[] = filteredSchedules.map(s => ({
      type: 'schedule' as const,
      id: s.id,
      time: new Date(s.startAt).getTime(),
      data: s
    }))

    const blockItems: TimelineItem[] = filteredBlocks.map(b => {
      const [hours, minutes] = b.startTime.split(':');
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
  }, [filteredSchedules, filteredBlocks, selectedDate]);

  const friendlyTitle = useMemo(() => {
    const titleText = getFriendlyDateTitle(selectedDate);
    if (!isCompact) return titleText;

    const lowerTitle = titleText.toLowerCase();
    if (
      lowerTitle.endsWith("ontem") ||
      lowerTitle.endsWith("hoje") ||
      lowerTitle.endsWith("amanhã")
    ) {
      return titleText;
    }

    const prefix = "Atendimentos de";
    if (titleText.startsWith(prefix)) {
      const datePart = titleText.substring(prefix.length).trim();
      return (
        <>
          {prefix}
          <br />
          {datePart}
        </>
      );
    }

    return titleText;
  }, [selectedDate, isCompact]);

  return (
    <div className="flex gap-6 relative">
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex items-center justify-between shrink-0 gap-4 max-[425px]:gap-6">
          <div>
            <h2 className="text-purple-900 leading-tight tracking-tight text-lg md:text-2xl font-bold">
              {friendlyTitle}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium hidden sm:block">
              Acompanhe o ritmo do seu espaço e brilhe com suas{" "}
              <span className="text-purple-600 font-semibold">Poderosas</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="xl:hidden text-purple-600 hover:text-purple-700 hover:bg-purple-100/50 transition-all shrink-0 rounded-md"
                  title="Abrir Agenda"
                >
                  <FaCalendarDays size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-full max-w-[100vw] sm:w-95 border-l-purple-100 flex flex-col bg-white gap-0">
                <div className="p-5 sm:p-6 border-b border-purple-100/50 pr-12 shrink-0">
                  <SheetTitle className="text-purple-900 font-bold text-lg">
                    Agenda de Atendimentos
                  </SheetTitle>
                  <SheetDescription className="text-gray-500 text-xs mt-1 leading-normal">
                    Selecione uma data e filtre os procedimentos para organizar seu espaço.
                  </SheetDescription>
                </div>
                <div className="flex-1 min-h-0">
                  {isSheetOpen && (
                    <NavCalendar
                      selectedDate={selectedDate}
                      onSelectDate={handleDateSelect}
                      filters={filters}
                      onFilterChange={setFilters}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="pt-2 space-y-6 w-full mx-auto">
          {timelineItems.length > 0 ? (
            <div className="flex flex-col gap-4">
              {timelineItems.map((item) => (
                item.type === 'schedule' ? (
                  isCompact ? (
                    <ScheduleCardMobile key={item.id} schedule={item.data} />
                  ) : (
                    <ScheduleCard key={item.id} schedule={item.data} />
                  )
                ) : (
                  isCompact ? (
                    <ScheduleBlockCardMobile key={item.id} block={item.data} />
                  ) : (
                    <ScheduleBlockCard key={item.id} block={item.data} />
                  )
                )
              ))}
            </div>
          ) : (
            <ScheduleFeedbackEmpty />
          )}
        </div>
      </div>

      <div className="hidden xl:block">
        <div className="sticky top-20 [@media(max-height:820px)]:top-14 h-[calc(100vh-140px)] [@media(max-height:820px)]:h-[calc(100vh-90px)] 2xl:h-[calc(100vh-120px)] lg:w-72 xl:w-xs shrink-0 self-start flex flex-col">
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
