import { TZDate } from "@date-fns/tz"
import { format } from "date-fns"

const TIMEZONE = "America/Sao_Paulo"

export const nowBrazilIso = (): string => {
  return format(new TZDate(new Date(), TIMEZONE), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
}

export const toIsoOrNull = (value?: string | null) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export const parseCurrencyBRLToNumber = (value: string): number => {
  if (!value) return 0

  const cleanValue = value
    .replace(/[R$\s.]/g, '')
    .replace(',', '.')

  return Number(cleanValue) || 0
}

export const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours * 60) + minutes
}

export const convertMinutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length > 0) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return "??";
}

export const checkIsBirthdayToday = (birthday: string | null): boolean => {
  if (!birthday) return false;
  const today = new Date();
  const bday = new Date(birthday + 'T12:00:00Z');
  return today.getDate() === bday.getDate() && today.getMonth() === bday.getMonth();
}