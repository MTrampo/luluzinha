import dynamic from "next/dynamic";
import { FeedbackLoading } from "@/components/feedbacks/feedback-loading";
import { defineStepper } from "@stepperize/react";
import { FaCalendar, FaFileCircleCheck, FaPaintbrush, FaUser } from "react-icons/fa6";

/**
 * Componentes carregados dinamicamente para o fluxo de agendamento.
 * O uso de dynamic ajuda a reduzir o bundle inicial da página, 
 * carregando cada formulário apenas quando a usuária avança no stepper.
 */

export const SelectCustomerForm = dynamic(
  () => import("@/components/forms/appointment/select-customer-form").then(m => m.SelectCustomerForm),
  { loading: () => <FeedbackLoading title="Carregando Poderosas..." className="min-h-[400px]" /> }
);

export const SelectProceduresForm = dynamic(
  () => import("@/components/forms/appointment/select-procedures-form").then(m => m.SelectProceduresForm),
  { loading: () => <FeedbackLoading title="Carregando Procedimentos..." className="min-h-[400px]" /> }
);

export const SelectDateTimeForm = dynamic(
  () => import("@/components/forms/appointment/select-datetime-form").then(m => m.SelectDateTimeForm),
  { loading: () => <FeedbackLoading title="Carregando Calendário..." className="min-h-[400px]" /> }
);

export const AppointmentSummary = dynamic(
  () => import("@/components/forms/appointment/summary").then(m => m.AppointmentSummary),
  { loading: () => <FeedbackLoading title="Preparando Resumo..." className="min-h-[400px]" /> }
);

export const { Scoped, useStepper } = defineStepper(
  { id: "customer", title: "Poderosa", description: "Selecione a cliente", icon: <FaUser /> },
  { id: "procedures", title: "Procedimentos", description: "O que vamos fazer?", icon: <FaPaintbrush /> },
  { id: "datetime", title: "Data e Hora", description: "Quando será?", icon: <FaCalendar /> },
  { id: "summary", title: "Resumo do Agendamento", description: "Confirme os dados", icon: <FaFileCircleCheck /> }
);