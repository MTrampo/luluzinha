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