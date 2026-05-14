import { OpeningHours } from "../models/establishment";
import { addMinutes, parseISO, isBefore, format, isSameDay } from "date-fns";
import { ProcedureFormatted } from "../models/procedure";

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
}

export interface ScheduleInterval {
  start_at: string;
  end_at: string;
}

export function getAvailableSlots(
  date: Date,
  openingHours: OpeningHours | null,
  schedules: ScheduleInterval[],
  totalDurationMinutes: number
): TimeSlot[] {
  if (!openingHours) return [];

  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
  const dayOfWeek = dayNames[date.getDay()];
  const todayHours = openingHours[dayOfWeek];

  if (!todayHours || todayHours.closed) {
    return [];
  }

  const [openH, openM] = todayHours.open.split(':').map(Number);
  const [closeH, closeM] = todayHours.close.split(':').map(Number);

  const startTime = new Date(date);
  startTime.setHours(openH, openM, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(closeH, closeM, 0, 0);

  const slots: TimeSlot[] = [];
  let currentSlot = new Date(startTime);
  const now = new Date();

  while (currentSlot < endTime) {
    const slotEnd = addMinutes(currentSlot, totalDurationMinutes);

    // Se o procedimento não couber até o horário de fechamento
    if (slotEnd > endTime) {
      // Avança para ver se por acaso tem um slot válido depois? Não, se não cabe agora, horários posteriores também não caberão (já que o close time é fixo e a duração é a mesma).
      break;
    }

    // Se a data selecionada for hoje e o horário já passou
    if (isSameDay(date, now) && isBefore(currentSlot, now)) {
      currentSlot = addMinutes(currentSlot, 20);
      continue;
    }

    // Verifica sobreposição com agendamentos existentes
    let hasOverlap = false;
    for (const schedule of schedules) {
      const scheduleStart = parseISO(schedule.start_at);
      const scheduleEnd = parseISO(schedule.end_at);

      // Overlap: Slot inicia antes do fim do agendamento E Slot termina depois do início do agendamento
      if (currentSlot < scheduleEnd && slotEnd > scheduleStart) {
        hasOverlap = true;
        break;
      }
    }

    slots.push({
      time: format(currentSlot, "HH:mm"),
      available: !hasOverlap
    });

    currentSlot = addMinutes(currentSlot, 20); // Geração a cada 20 minutos
  }

  return slots;
}

/**
 * Calcula os totais de duração e preço para uma lista de procedimentos selecionados.
 */
export function calculateScheduleTotals(procedureIds: string[], allProcedures: ProcedureFormatted[]) {
  const selectedProcedures = allProcedures.filter(p => procedureIds.includes(p.id));

  const totalDuration = selectedProcedures.reduce((acc, p) => acc + p.duration, 0);
  const totalPrice = selectedProcedures.reduce((acc, p) => acc + p.price, 0);

  return {
    selectedProcedures,
    totalDuration,
    totalPrice
  };
}

/**
 * Gera as datas de início e fim baseadas na data selecionada, hora e duração total.
 */
export function calculateScheduleDates(selectedDate: Date, selectedTime: string, totalDuration: number) {
  const [hours, minutes] = selectedTime.split(':').map(Number);

  const startAt = new Date(selectedDate);
  startAt.setHours(hours, minutes, 0, 0);

  const endAt = new Date(startAt);
  endAt.setMinutes(startAt.getMinutes() + totalDuration);

  return {
    startAt,
    endAt
  };
}
