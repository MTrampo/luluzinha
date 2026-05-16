"use client"

import { useState, useTransition, useEffect } from "react";
import Image from 'next/image';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { EstablishmentFormatted } from "@/commons/models/establishment";
import { ProcedureFormatted } from "@/commons/models/procedure";
import { getSchedulesByDateAction } from "@/actions/schedule";
import { getAvailableSlots, TimeSlot } from "@/commons/utils/schedule";
import { cn } from "@/commons/lib/tw-merge";
import { formatDuration } from "@/commons/utils/format";
import { FaTriangleExclamation, FaCircleCheck, FaClock } from "react-icons/fa6";
import svgSelectDay from '@/commons/assets/svgs/select-day.svg';

import { FeedbackLoading } from "@/components/feedbacks/feedback-loading";

export function SelectDateTimeForm({
  activeEstablishment,
  selectedProcedureIds,
  procedures,
  initialSelectedDate,
  initialSelectedTime,
  onSelect,
}: {
  activeEstablishment: EstablishmentFormatted | null;
  selectedProcedureIds: string[];
  procedures: ProcedureFormatted[];
  initialSelectedDate?: Date;
  initialSelectedTime?: string;
  onSelect?: (date: Date, time: string) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialSelectedDate);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(initialSelectedTime);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isPending, startTransition] = useTransition();

  const totalDuration = selectedProcedureIds.reduce((acc, id) => {
    const p = procedures.find((p) => p.id === id);
    return acc + (p?.duration || 0);
  }, 0);

  useEffect(() => {
    if (selectedDate && activeEstablishment) {
      startTransition(async () => {
        const dateIso = format(selectedDate, "yyyy-MM-dd");
        const response = await getSchedulesByDateAction(dateIso);
        const { busyIntervals = [] } = response.data || {};

        const slots = getAvailableSlots(
          selectedDate,
          activeEstablishment.openingHours,
          busyIntervals,
          totalDuration
        );

        setAvailableSlots(slots);

        if (selectedTime) {
          const isStillAvailable = slots.find((s) => s.time === selectedTime && s.available);
          if (!isStillAvailable) {
            setSelectedTime(undefined);
          }
        }
      });
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, activeEstablishment, totalDuration]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && onSelect) {
      onSelect(selectedDate, time);
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  }

  const availableOnly = availableSlots.filter(s => s.available);

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300 w-full">

      <div className="w-full md:w-[380px] p-6 md:p-8 md:border-r border-gray-100 shrink-0 flex justify-center bg-white">
        <div className="w-full max-w-[340px]">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={ptBR}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            className="w-full flex justify-center p-0 bg-transparent"
            classNames={{
              month_caption: "flex justify-center items-center h-10 w-full text-purple-900 font-bold px-10 mb-4 uppercase",
              nav: "flex items-center justify-between absolute w-full inset-x-0 z-10 px-2",
              button_previous: "h-9 w-9 text-purple-600 hover:bg-purple-100 rounded-md transition-all flex items-center justify-center",
              button_next: "h-9 w-9 text-purple-600 hover:bg-purple-100 rounded-md transition-all flex items-center justify-center",
              table: "w-full border-collapse",
              weekdays: "flex w-full mb-3",
              weekday: "text-purple-400 font-bold text-[10px] uppercase tracking-[0.2em] flex-1 text-center h-8 flex items-center justify-center",
              week: "flex w-full mt-1.5",
              day: "relative flex-1 aspect-square p-0 flex items-center justify-center group",
              selected: "bg-purple-600 text-white hover:bg-purple-700 focus:bg-purple-600 rounded-md font-bold shadow-md shadow-purple-100 scale-95 transition-all",
              today: "bg-purple-50 text-purple-700 font-bold rounded-md border border-purple-100",
              outside: "text-gray-200 opacity-50",
              day_button: "w-full h-full rounded-md flex items-center justify-center text-sm transition-all hover:bg-purple-50 hover:text-purple-700",
            }}
          />
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 bg-gray-50/30">
        {!selectedDate ? (
          <div className="h-full flex flex-col items-center justify-center text-center min-h-[300px]">
            <Image src={svgSelectDay} alt="Selecione um dia" className="w-56 h-56 drop-shadow-sm opacity-90" priority />
            <h3 className="text-gray-900">Qual o melhor dia?</h3>
            <p className="text-gray-500 text-sm">
              Selecione uma data no calendário ao lado para ver os horários que a sua bancada está livre.
            </p>
          </div>
        ) : isPending ? (
          <FeedbackLoading
            title="Buscando horários..."
            description="Preparando sua agenda de atendimentos"
          />
        ) : availableSlots.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <FaTriangleExclamation size={24} />
            </div>
            <p className="text-gray-900 font-bold text-xl">Sem atendimento</p>
            <p className="text-gray-500 text-sm mt-2 max-w-[240px]">
              O estabelecimento não atende nesta data. Escolha outro dia.
            </p>
          </div>
        ) : availableOnly.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
              <FaCircleCheck size={24} />
            </div>
            <p className="text-gray-900 font-bold text-xl">Agenda Lotada!</p>
            <p className="text-gray-500 text-sm mt-2 max-w-[260px]">
              Que sucesso! Todos os horários já foram reservados por outras Poderosas neste dia.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <FaClock className="text-purple-600" />
                  Horários Livres
                </h3>
                <p className="text-sm text-gray-500 capitalize mt-0.5">
                  {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase tracking-wider">Duração</span>
                <span className="text-gray-900 font-bold text-base leading-none">{formatDuration(totalDuration)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-[340px] overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {availableSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={cn(
                      "py-2 px-1 rounded-full text-sm font-semibold transition-all duration-200 border",
                      !slot.available && "opacity-40 cursor-not-allowed bg-gray-50 border-transparent text-gray-400",
                      slot.available && !isSelected && "bg-white border-gray-200 text-gray-700 hover:border-purple-600 hover:text-purple-600",
                      isSelected && "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/20"
                    )}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
