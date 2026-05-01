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

  // Remove "R$", espaços, pontos de milhar e substitui vírgula por ponto
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