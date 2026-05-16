"use client"

import { useState, useTransition } from "react"
import { FaEllipsisVertical, FaWhatsapp, FaCalendarXmark, FaCalendarDays, FaPenToSquare, FaCalendarCheck, FaRotateLeft } from "react-icons/fa6"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScheduleDash } from "@/commons/models/schedule"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { updateScheduleAction, resumeScheduleAction } from "@/actions/schedule"
import { ScheduleStatusEnum } from "@/commons/enums/schedule"
import { toast } from "sonner"
import { HttpStatusEnum } from "@/commons/enums/http"
import Link from "next/link"

interface AppointmentMenuProps {
  schedule: ScheduleDash;
}

type ActionType = "finish" | "cancel" | "resume" | null;

export function AppointmentMenu({ schedule }: AppointmentMenuProps) {
  const [actionType, setActionType] = useState<ActionType>(null);
  const [isPending, startTransition] = useTransition();

  const isCancelled = schedule.status === ScheduleStatusEnum.CANCELLED;

  const handleConfirmAction = () => {
    startTransition(async () => {
      if (actionType === "resume") {
        const response = await resumeScheduleAction(schedule.id, schedule.startAt, schedule.endAt);
        
        if (response.status === HttpStatusEnum.Ok) {
          toast.success("Atendimento reagendado com sucesso!");
          setActionType(null);
        } else if (response.status === HttpStatusEnum.Conflict) {
          toast.error(response.message);
          setActionType(null);
        } else {
          toast.error("Ops! Ocorreu um erro ao reagendar o atendimento.");
          setActionType(null);
        }
        return;
      }

      let statusToUpdate: ScheduleStatusEnum;
      let successMessage = "";

      if (actionType === "finish") {
        statusToUpdate = ScheduleStatusEnum.COMPLETED;
        successMessage = "Prontinho! Mais um atendimento concluído com sucesso.";
      } else if (actionType === "cancel") {
        statusToUpdate = ScheduleStatusEnum.CANCELLED;
        successMessage = "Atendimento cancelado. Agenda livre para novas Poderosas!";
      } else {
        return;
      }

      const response = await updateScheduleAction(schedule.id, { status: statusToUpdate });

      if (response.status === HttpStatusEnum.Ok) {
        toast.success(successMessage);
        setActionType(null);
      } else {
        toast.error("Ops! Ocorreu um erro ao atualizar o atendimento.");
        setActionType(null);
      }
    });
  };

  const dialogProps = {
    finish: {
      title: "Finalizar Atendimento",
      description: "Deseja marcar este atendimento como concluído?",
      confirmText: "Concluir",
    },
    cancel: {
      title: "Cancelar Atendimento",
      description: "Tem certeza que deseja cancelar o atendimento dessa Poderosa?",
      confirmText: "Cancelar Atendimento",
    },
    resume: {
      title: "Reagendar Atendimento",
      description: "Deseja reagendar o atendimento para este mesmo horário?",
      confirmText: "Reagendar",
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-10 md:w-10 text-gray-500 hover:text-purple-600 hover:bg-purple-50 data-[state=open]:text-purple-600 data-[state=open]:bg-purple-50 rounded-md transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <FaEllipsisVertical className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {schedule.customer.waLink && (
            <DropdownMenuItem
              asChild
              className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-green-50 focus:text-green-700"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={schedule.customer.waLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="w-4 h-4 text-green-500" />
                <span className="font-medium">Chamar Poderosa</span>
              </a>
            </DropdownMenuItem>
          )}

          {!isCancelled && (
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-green-50 focus:text-green-700"
              onClick={(e) => {
                e.stopPropagation();
                setActionType("finish");
              }}
            >
              <FaCalendarCheck className="w-4 h-4 text-green-600" />
              <span className="font-medium">Finalizar Atendimento</span>
            </DropdownMenuItem>
          )}

          {isCancelled && (
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-blue-50 focus:text-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                setActionType("resume");
              }}
            >
              <FaRotateLeft className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Reagendar Atendimento</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            asChild
            className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-purple-50 focus:text-purple-700"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/painel/agenda/atendimento/${schedule.id}/editar`}>
              <FaPenToSquare className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Editar Atendimento</span>
            </Link>
          </DropdownMenuItem>

          {!isCancelled && (
            <>
              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem
                className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-red-50 focus:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setActionType("cancel");
                }}
              >
                <FaCalendarXmark className="w-4 h-4 text-red-600" />
                <span className="font-medium">Cancelar Atendimento</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={!!actionType}
        onOpenChange={(open) => !open && !isPending && setActionType(null)}
        title={actionType ? dialogProps[actionType].title : ""}
        description={actionType ? dialogProps[actionType].description : ""}
        confirmText={actionType ? dialogProps[actionType].confirmText : "Confirmar"}
        cancelText="Voltar"
        onConfirm={handleConfirmAction}
        isPending={isPending}
      />
    </>
  )
}
