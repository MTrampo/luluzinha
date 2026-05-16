import { ScheduleStatusEnum } from "../../commons/enums/schedule";
import { FaLock, FaUtensils, FaStethoscope, FaHouse, FaBriefcase } from "react-icons/fa6";

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

export const blockIconMap = [
  { keywords: ["almoço", "comer", "lanche"], icon: FaUtensils },
  { keywords: ["médico", "doutor", "saúde", "exame"], icon: FaStethoscope },
  { keywords: ["pessoal", "casa", "família"], icon: FaHouse },
  { keywords: ["trabalho", "reunião", "curso", "compromisso"], icon: FaBriefcase },
];

/**
 * Retorna o ícone correspondente ao motivo do bloqueio baseado em palavras-chave.
 * @param reason Motivo do bloqueio
 * @returns Componente de ícone (JSX)
 */
export const getBlockIcon = (reason: string) => {
  const normalizedReason = reason.toLowerCase();
  const match = blockIconMap.find(item =>
    item.keywords.some(keyword => normalizedReason.includes(keyword))
  );

  const Icon = match ? match.icon : FaLock;

  return <Icon className="text-sm md:text-base opacity-70" />;
};
