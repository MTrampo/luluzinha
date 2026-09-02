"use client"

import { useState, useTransition } from "react";
import { parseISO, format } from "date-fns";
import { useRouter } from "next/navigation";
import { ScheduleDash } from "@/commons/models/schedule";
import { ProcedureFormatted } from "@/commons/models/procedure";
import { EstablishmentFormatted } from "@/commons/models/establishment";
import { SelectProceduresForm } from "@/components/forms/appointment/select-procedures-form";
import { SelectDateTimeForm } from "@/components/forms/appointment/select-datetime-form";
import { Button } from "@/components/ui/button";
import { calculateScheduleTotals, calculateScheduleDates } from "@/commons/utils/schedule";
import { formatCurrencyBRL, formatDuration } from "@/commons/utils/format";
import { updateScheduleWithProceduresAction } from "@/actions/schedule";
import { ScheduleStatusEnum } from "@/commons/enums/schedule";
import { toast } from "sonner";
import { HttpStatusEnum } from "@/commons/enums/http";
import { FaArrowsRotate, FaCircleCheck, FaArrowLeft } from "react-icons/fa6";

interface EditAppointmentProps {
  schedule: ScheduleDash;
  procedures: ProcedureFormatted[];
  activeEstablishment: EstablishmentFormatted | null;
}

export function EditAppointment({ schedule, procedures, activeEstablishment }: EditAppointmentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialDate = parseISO(schedule.startAt);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(format(initialDate, "HH:mm"));
  const [selectedProcedureIds, setSelectedProcedureIds] = useState<string[]>(schedule.procedures.map(p => p.id));

  const { selectedProcedures, totalDuration, totalPrice } = calculateScheduleTotals(
    selectedProcedureIds,
    procedures
  );

  const isSaveDisabled = selectedProcedureIds.length === 0 || !selectedDate || !selectedTime || isPending;

  const handleSave = () => {
    if (isSaveDisabled || !activeEstablishment) return;

    const { startAt, endAt } = calculateScheduleDates(
      selectedDate,
      selectedTime,
      totalDuration
    );

    startTransition(async () => {
      try {
        const response = await updateScheduleWithProceduresAction(
          schedule.id,
          {
            start_at: startAt.toISOString(),
            end_at: endAt.toISOString(),
            total_duration: totalDuration,
            total_price: totalPrice,
            status: ScheduleStatusEnum.CONFIRMED,
          },
          selectedProcedures.map(p => ({
            procedure_id: p.id,
            price_at_time: p.price,
            duration_at_time: p.duration
          }))
        );

        if (response.status === HttpStatusEnum.Ok) {
          toast.success("Agendamento atualizado com sucesso!");
          router.push("/painel/agenda");
          router.refresh();
        } else if (response.status === HttpStatusEnum.Conflict) {
          toast.error(response.message);
        } else {
          toast.error("Ops! Erro ao atualizar o agendamento.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ocorreu um erro inesperado.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 min-h-[calc(100vh-140px)]">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-purple-900">{schedule.customer.nameFormatted}</h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              Ajuste os procedimentos ou o horário conforme necessário.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            disabled={isPending}
            className="h-9 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md font-bold transition-all active:scale-95"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-purple-700">1. Serviços</h4>
        <SelectProceduresForm
          procedures={procedures}
          initialSelected={selectedProcedureIds}
          onSelect={setSelectedProcedureIds}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-purple-700">2. Data e Horário</h4>
        <SelectDateTimeForm
          activeEstablishment={activeEstablishment}
          procedures={procedures}
          selectedProcedureIds={selectedProcedureIds}
          initialSelectedDate={selectedDate}
          initialSelectedTime={selectedTime}
          onSelect={(date, time) => {
            setSelectedDate(date);
            setSelectedTime(time);
          }}
        />
      </div>

      {/* Footer Flutuante */}
      <div className="sticky bottom-4 mt-auto bg-white/95 backdrop-blur-md border border-purple-100 p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex justify-between items-center z-20">


        <div>
          <span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase tracking-wider">Novo Resumo</span>
          <div className="flex items-center gap-2">
            <span className="text-purple-700 font-black text-lg leading-none">{formatCurrencyBRL(totalPrice)}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 font-medium text-sm">{formatDuration(totalDuration)}</span>
          </div>
        </div>

        <Button
          variant="success"
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="shadow-md hover:shadow-lg transition-all px-8 h-12 text-base rounded-xl"
        >
          {isPending ? (
            <>
              <FaArrowsRotate className="animate-spin" /> Atualizando...
            </>
          ) : (
            <>
              <FaCircleCheck /> Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
