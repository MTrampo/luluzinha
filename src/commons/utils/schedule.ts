import { OpeningHours } from "../models/establishment";
import { addMinutes, parseISO, isBefore, format, isSameDay } from "date-fns";
import { ProcedureFormatted } from "../models/procedure";

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
}

export interface ScheduleInterval {
  startAt: string;
  endAt: string;
}

export function getAvailableSlots(
  date: Date,
  openingHours: OpeningHours | null,
  busyIntervals: ScheduleInterval[],
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
      break;
    }

    // Se a data selecionada for hoje e o horário já passou
    if (isSameDay(date, now) && isBefore(currentSlot, now)) {
      currentSlot = addMinutes(currentSlot, 20);
      continue;
    }

    // Verifica sobreposição com intervalos ocupados (agendamentos ou bloqueios)
    let hasOverlap = false;
    for (const interval of busyIntervals) {
      const startIso = interval.startAt || (interval as any).start_at;
      const endIso = interval.endAt || (interval as any).end_at;

      if (!startIso || !endIso) continue;

      const intervalStart = parseISO(startIso);
      const intervalEnd = parseISO(endIso);

      // Overlap: Slot inicia antes do fim do intervalo E Slot termina depois do início do intervalo
      if (currentSlot < intervalEnd && slotEnd > intervalStart) {
        hasOverlap = true;
        break;
      }
    }

    slots.push({
      time: format(currentSlot, "HH:mm"),
      available: !hasOverlap
    });

    currentSlot = addMinutes(currentSlot, 20);
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

/**
 * Retorna uma lista de itens visíveis com base em um limite máximo, além da contagem de itens restantes.
 */
export function getVisibleProcedures<T>(procedures: T[], maxVisible: number) {
  const visibleProcedures = procedures.slice(0, maxVisible);
  const remainingCount = Math.max(0, procedures.length - maxVisible);
  return {
    visibleProcedures,
    remainingCount
  };
}

