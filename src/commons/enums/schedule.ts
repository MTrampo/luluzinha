export enum ScheduleStatusEnum {
  PENDING = 1,
  CONFIRMED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}

export const formatScheduleStatus = (status: number): string => {
  switch (status) {
    case ScheduleStatusEnum.PENDING:
      return "PENDENTE";
    case ScheduleStatusEnum.CONFIRMED:
      return "CONFIRMADO";
    case ScheduleStatusEnum.COMPLETED:
      return "CONCLUÍDO";
    case ScheduleStatusEnum.CANCELLED:
      return "CANCELADO";
    default:
      return "DESCONHECIDO";
  }
};
