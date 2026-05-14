import { ScheduleStatusEnum } from "../enums/schedule";

export const statusMap: Record<number, { label: string; class: string; border: string }> = {
  [ScheduleStatusEnum.PENDING]: {
    label: "PENDENTE",
    class: "bg-amber-50 text-amber-600 border-amber-100",
    border: "border-l-amber-500",
  },
  [ScheduleStatusEnum.CONFIRMED]: {
    label: "CONFIRMADO",
    class: "bg-green-50 text-green-600 border-green-100",
    border: "border-l-green-500",
  },
  [ScheduleStatusEnum.COMPLETED]: {
    label: "CONCLUÍDO",
    class: "bg-purple-50 text-purple-600 border-purple-100",
    border: "border-l-purple-600",
  },
  [ScheduleStatusEnum.CANCELLED]: {
    label: "CANCELADO",
    class: "bg-red-50 text-red-600 border-red-100",
    border: "border-l-red-500",
  },
};
