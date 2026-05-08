"use client"

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScheduleCard } from "./schedule-card";
import { NavCalendar } from "./nav-calendar";
import { ScheduleFormatted } from "@/commons/models/schedule";
import { FaCalendarPlus, FaCalendarMinus, FaCalendarDays } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { cn } from "@/commons/lib/tw-merge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ptBR } from "date-fns/locale";
import { ScheduleFeedbackEmpty } from "./feedback";
import { getFriendlyDateTitle, isSameCalendarDay } from "@/commons/utils/date";

interface ScheduleProps {
  schedules: ScheduleFormatted[];
  isMobileServer?: boolean;
}

export function Schedule({ schedules, isMobileServer }: ScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobileClient = useIsMobile();
  const isMobile = isMobileClient ?? isMobileServer;

  const filteredSchedules = schedules.filter((schedule) =>
    isSameCalendarDay(schedule.date, selectedDate || new Date())
  );

  return (
    <div className="flex gap-6 relative">
      <div className="flex flex-col flex-1 gap-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-purple-900 leading-tight tracking-tight">
              {getFriendlyDateTitle(selectedDate)}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">
              Acompanhe o ritmo da sua bancada e brilhe com suas <span className="text-purple-600 font-semibold">Poderosas</span>.
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
                <NavCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="pt-2 space-y-6 w-full mx-auto">
          {filteredSchedules.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4 w-full">
              {filteredSchedules.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} isMobileServer={isMobileServer} />
              ))}
            </div>
          ) : (
            <ScheduleFeedbackEmpty />
          )}
        </div>
      </div>

      <div className="hidden lg:block relative w-xs shrink-0 self-start">
        <div className="sticky top-16 h-fit">
          <div className="w-full bg-white rounded-md shadow-[0_20px_50px_rgba(147,51,234,0.06)] border border-purple-100 overflow-hidden flex flex-col">
            <NavCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
}
