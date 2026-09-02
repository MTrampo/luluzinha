import { ComponentType } from "react";
import { ScheduleStatusEnum } from "../../commons/enums/schedule";
import { 
  FaLock, 
  FaUtensils, 
  FaStethoscope, 
  FaHouse, 
  FaBriefcase,
  FaPaintbrush,
  FaScissors,
  FaSpa,
  FaCrown,
  FaHeart,
  FaGem,
  FaStore,
  FaStar,
  FaFaceSmile,
  FaHandSparkles,
  FaSun,
  FaMoon
} from "react-icons/fa6";
import { IoFlowerSharp } from "react-icons/io5";

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

export const getSubscriptionStatus = (status?: string | null) => {
  switch (status) {
    case "authorized":
      return { label: "Ativa", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" }
    case "pending":
      return { label: "Pendente", className: "bg-amber-50 text-amber-700 border border-amber-200" }
    case "paused":
      return { label: "Pausada", className: "bg-blue-50 text-blue-700 border border-blue-200" }
    case "cancelled":
      return { label: "Cancelada", className: "bg-rose-50 text-rose-700 border border-rose-200" }
    case "rejected":
      return { label: "Recusada", className: "bg-rose-50 text-rose-700 border border-rose-200" }
    default:
      return { label: "Sem Assinatura", className: "bg-gray-50 text-gray-600 border border-gray-200" }
  }
}

export const EstablishmentIconMap: Record<string, ComponentType<{ className?: string }>> = {
  FaPaintbrush,
  FaScissors,
  FaSpa,
  FaCrown,
  FaHeart,
  FaGem,
  FaStore,
  FaStar,
  FaFaceSmile,
  FaHandSparkles,
  IoFlowerSharp,
  FaSun,
  FaMoon
}