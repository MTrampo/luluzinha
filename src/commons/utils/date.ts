import { format, isToday, isTomorrow, isYesterday, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export const getFriendlyDateTitle = (date: Date | undefined, prefix = "Atendimentos") => {
  if (!date) return prefix;

  if (isYesterday(date)) return `${prefix} de Ontem`;
  if (isToday(date)) return `${prefix} de Hoje`;
  if (isTomorrow(date)) return `${prefix} de Amanhã`;

  const formattedDate = format(date, "EEE, dd 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  const formattedMonth = capitalizedDate.replace(/ de ([a-z])/g, (_, char) => ` de ${char.toUpperCase()}`);

  return `${prefix} de ${formattedMonth}`;
};

export const isSameCalendarDay = (date1: Date | string | number, date2: Date | string | number) => {
  return isSameDay(new Date(date1), new Date(date2));
};
