import { addDays, format, startOfWeek } from "date-fns";

export function generateServiceWeek() {
  const today = new Date()
  
  const firstDayOfWeek = startOfWeek(today, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }).map((_, index) =>
    addDays(firstDayOfWeek, index)
  )

  return weekDays
}