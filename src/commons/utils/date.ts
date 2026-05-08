import { format, isToday, isTomorrow, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Retorna um título amigável baseado em uma data (Hoje, Amanhã ou Data Formatada)
 * Exemplo: "Ciclos de Hoje", "Ciclos de Amanhã", "Ciclos de Sex, 15 de Maio"
 */
export const getFriendlyDateTitle = (date: Date | undefined, prefix = "Ciclos") => {
  if (!date) return prefix;
  if (isToday(date)) return `${prefix} de Hoje`;
  if (isTomorrow(date)) return `${prefix} de Amanhã`;

  const formattedDate = format(date, "EEE, dd 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  return `${prefix} de ${capitalizedDate}`;
};

/**
 * Compara se duas datas são do mesmo dia, ignorando o horário
 */
export const isSameCalendarDay = (date1: Date | string | number, date2: Date | string | number) => {
  return isSameDay(new Date(date1), new Date(date2));
};
