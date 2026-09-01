"use client"

import { useState, useTransition } from "react"
import { ScheduleFormatted } from "@/commons/models/schedule"
import { StandardAvatar } from "@/components/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { statusMap } from "@/components/maps/status-map"
import {
  FaWhatsapp,
  FaCalendarDay,
  FaClock,
  FaPenToSquare,
  FaXmark,
  FaReceipt,
  FaCircleInfo,
  FaShareNodes,
  FaWandMagicSparkles,
  FaCakeCandles,
  FaArrowLeft,
  FaCalendarCheck,
  FaCalendarXmark,
  FaFlagCheckered,
  FaStopwatch,
  FaCheckDouble,
  FaRotateLeft
} from "react-icons/fa6"
import Link from "next/link"
import { cn } from "@/commons/lib/tw-merge"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { updateScheduleAction, resumeScheduleAction } from "@/actions/schedule"
import { ScheduleStatusEnum } from "@/commons/enums/schedule"
import { toast } from "sonner"
import { HttpStatusEnum } from "@/commons/enums/http"

interface DetailsContentProps {
  schedule: ScheduleFormatted;
}

type ActionType = "finish" | "cancel" | "resume" | null;

export function DetailsContent({ schedule }: DetailsContentProps) {
  const currentStatus = statusMap[schedule.status];
  const isCancelled = schedule.status === ScheduleStatusEnum.CANCELLED;
  const isCompleted = schedule.status === ScheduleStatusEnum.COMPLETED;

  const [actionType, setActionType] = useState<ActionType>(null);
  const [isPending, startTransition] = useTransition();

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

  const handleShareSummary = () => {
    const cleanPhone = `55${schedule.customer.phone}`.replace(/\D/g, '');

    const message = `Olá, ${schedule.customer.nameFormatted}! ✨

Passando para confirmar seu atendimento:

🗓️ *Data:* ${schedule.dateFormatted}
🕒 *Horário:* ${schedule.startTimeFormatted}
💅 *Procedimentos:*
${schedule.procedures.map(p => `• ${p.name}`).join('\n')}

💰 *Total:* ${schedule.totalPriceFormatted}

Estou te esperando com muito carinho! ❤️`;

    if (schedule.customer.phone) {
      const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500 pb-12">

      {/* HEADER PADRÃO DO SISTEMA */}
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-purple-900 leading-tight tracking-tight text-lg sm:text-xl font-bold truncate">
              {schedule.customer.nameFormatted}
            </h2>
            <Badge className={cn("px-2 py-0.5 h-5 rounded-md text-[0.65rem] font-semibold uppercase tracking-wide shadow-none border shrink-0", currentStatus.class)}>
              {currentStatus.label}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
            Confira os detalhes do atendimento agendado.
          </p>
        </div>

        {/* BOTÕES DE AÇÃO DO HEADER */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-9 px-3 text-purple-700 hover:text-purple-800 hover:bg-purple-50 font-bold border-purple-200/80 shadow-2xs rounded-lg"
          >
            <Link href="/painel/agenda">
              <FaArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voltar</span>
            </Link>
          </Button>

          {!isCompleted && (
            <Button
              variant="theme"
              size="sm"
              asChild
              className="h-9 px-3 font-bold shadow-xs rounded-lg gap-2"
            >
              <Link href={`/painel/agenda/atendimento/${schedule.id}/editar`}>
                <FaPenToSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editar</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative mt-1">

        {/* CONTEÚDO PRINCIPAL (PROCEDIMENTOS E INFORMAÇÕES) */}
        <div className="flex flex-col flex-1 gap-6">

          {/* Info Rápida do Contato */}
          <div className="bg-white border border-purple-100/80 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <StandardAvatar
                initials={schedule.customer.initials}
                className="h-11 w-11 text-base font-bold border border-purple-100/60"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-purple-600/75 uppercase tracking-wider">Contato da Poderosa</span>
                <a href={schedule.customer.waLink || "#"} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-purple-950 hover:text-purple-700 transition-colors">
                  {schedule.customer.phoneFormatted}
                </a>
              </div>
            </div>

            {(schedule.customer.isNew || schedule.customer.isBirthdayToday) && (
              <div className="flex flex-wrap items-center gap-2">
                {schedule.customer.isNew && (
                  <Badge className="bg-purple-600 text-white border-none text-[0.65rem] font-bold px-2.5 py-1 rounded-md shadow-xs w-fit">
                    <FaWandMagicSparkles className="w-3 h-3 mr-1.5 text-purple-100" />
                    Primeira Vez
                  </Badge>
                )}
                {schedule.customer.isBirthdayToday && (
                  <Badge className="bg-pink-100 text-pink-700 border border-pink-200 text-[0.65rem] font-bold px-2.5 py-1 rounded-md shadow-none w-fit">
                    <FaCakeCandles className="w-3 h-3 mr-1.5 text-pink-600" />
                    Aniversariante
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* LISTA DE PROCEDIMENTOS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2 px-1">
              Procedimentos Agendados
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200/70 font-bold h-5 px-1.5 text-[0.65rem]">
                {schedule.procedures.length}
              </Badge>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {schedule.procedures.map((proc) => (
                <Card key={proc.id} className="p-4 border-purple-100/80 bg-white shadow-xs rounded-xl">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-purple-950 text-sm">{proc.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <FaClock className="w-3 h-3 text-purple-400" />
                        {proc.durationAtTimeFormatted}
                      </div>
                    </div>
                    <span className="font-black text-purple-900 text-sm tabular-nums">{proc.priceAtTimeFormatted}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* NOTAS DA PODEROSA */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-purple-950 px-1">
              Anotações da Poderosa
            </h3>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed border shadow-xs",
              schedule.customer.hasNotes
                ? "bg-purple-50/25 border-purple-100/80 text-purple-950"
                : "bg-gray-50/50 border-purple-100/60 text-gray-400 border-dashed"
            )}>
              {schedule.customer.hasNotes
                ? `"${schedule.customer.notes}"`
                : `Ainda não temos registros de preferências para a ${schedule.customer.nameFormatted}. Que tal adicionar algo na próxima visita?`}
            </div>
          </div>
        </div>

        {/* SIDEBAR / CARD DE RESUMO DO ATENDIMENTO */}
        <aside className="w-full lg:w-xs shrink-0 self-start">
          <div className="sticky top-20 flex flex-col">
            <Card className="w-full bg-white rounded-2xl shadow-xs border border-purple-100/80 overflow-hidden flex flex-col p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100/60 shadow-2xs">
                  <FaReceipt className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-purple-950 text-sm">
                  Resumo do Atendimento
                </h3>
              </div>

              <div className="space-y-3 bg-purple-50/30 p-3.5 sm:p-4 rounded-xl border border-purple-100/60">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    <FaCalendarDay className="w-3.5 h-3.5 text-purple-500" />
                    Data
                  </span>
                  <span className="font-bold text-purple-950">{schedule.dateFormatted}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    <FaClock className="w-3.5 h-3.5 text-purple-500" />
                    Início
                  </span>
                  <span className="font-bold text-purple-950">{schedule.startTimeFormatted}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    <FaFlagCheckered className="w-3.5 h-3.5 text-purple-500" />
                    Término
                  </span>
                  <span className="font-bold text-purple-950">{schedule.endTimeFormatted}</span>
                </div>

                <Separator className="bg-purple-100/60" />

                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    <FaStopwatch className="w-3.5 h-3.5 text-purple-500" />
                    Duração
                  </span>
                  <span className="font-bold text-purple-950">{schedule.totalDurationFormatted}</span>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    <FaCheckDouble className="w-3.5 h-3.5 text-purple-500" />
                    Procedimentos
                  </span>
                  <span className="font-bold text-purple-950">{schedule.procedures.length} itens</span>
                </div>
              </div>

              {/* VALOR TOTAL */}
              <div className="flex flex-col items-center justify-center bg-purple-600 rounded-xl p-5 border border-purple-700 shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <FaReceipt className="w-16 h-16 text-white" />
                </div>
                <span className="text-[0.65rem] font-bold text-purple-200 uppercase tracking-widest mb-0.5 relative z-10">Total do Atendimento</span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight relative z-10 tabular-nums">
                  {schedule.totalPriceFormatted}
                </span>
              </div>

              {/* AÇÕES DO ATENDIMENTO INTEGRADAS NO CARD */}
              {!isCompleted && (
                <div className="flex flex-col gap-2.5 pt-2">
                  {!isCancelled && (
                    <Button 
                      variant="success" 
                      onClick={() => setActionType("finish")}
                      className="w-full h-11 gap-2 text-sm shadow-xs font-bold rounded-xl"
                    >
                      <FaCalendarCheck className="w-4 h-4" />
                      Finalizar Atendimento
                    </Button>
                  )}

                  {isCancelled && (
                    <Button 
                      onClick={() => setActionType("resume")}
                      className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2 text-sm rounded-xl shadow-xs"
                    >
                      <FaRotateLeft className="w-4 h-4" />
                      Reagendar Atendimento
                    </Button>
                  )}

                  <Button
                    onClick={handleShareSummary}
                    className="w-full h-11 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200/80 font-bold gap-2 text-sm rounded-xl shadow-2xs"
                  >
                    <FaWhatsapp className="w-4 h-4 text-emerald-600" />
                    Lembrar Poderosa
                  </Button>

                  {!isCancelled && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setActionType("cancel")}
                      className="w-full h-10 text-red-500 hover:text-red-700 hover:bg-red-50 gap-2 text-xs sm:text-sm font-semibold rounded-xl"
                    >
                      <FaCalendarXmark className="w-3.5 h-3.5 opacity-60" />
                      Cancelar Atendimento
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </aside>

      </div>

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
    </div>
  )
}
