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
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">

      {/* HEADER PADRÃO DO SISTEMA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-purple-900 leading-tight tracking-tight">
              {schedule.customer.nameFormatted}
            </h2>
            <Badge className={cn("px-2 py-0 h-5 rounded-md text-[0.65rem] font-semibold uppercase tracking-wide shadow-none border", currentStatus.class)}>
              {currentStatus.label}
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Confira os detalhes do atendimento agendado.
          </p>
        </div>

        {/* BOTÕES DE AÇÃO - MOBILE STICKY STACK */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="h-9 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md font-bold transition-all active:scale-95">
            <Link href="/painel/agenda" className="flex items-center gap-2">
              <FaArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Link>
          </Button>

          <div className="w-px h-6 bg-purple-200 mx-2 hidden sm:block" />

          {!isCompleted && (
            <Button variant="ghost" size="sm" asChild className="h-9 text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-bold px-3 transition-all active:scale-95">
              <Link href={`/painel/agenda/atendimento/${schedule.id}/editar`} className="flex items-center gap-2">
                <FaPenToSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Editar</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative mt-2">

        {/* CONTEÚDO PRINCIPAL (PROCEDIMENTOS) */}
        <div className="flex flex-col flex-1 gap-6">

          {/* Info Rápida */}
          <div className="flex flex-wrap gap-4 px-1">
            <div className="flex items-center gap-3">
              <StandardAvatar
                initials={schedule.customer.initials}
                className="h-12 w-12 text-base font-bold"
              />
              <div className="flex flex-col">
                <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Contato</span>
                <a href={schedule.customer.waLink || "#"} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors">
                  {schedule.customer.phoneFormatted}
                </a>
              </div>
            </div>

            {(schedule.customer.isNew || schedule.customer.isBirthdayToday) && (
              <>
                <Separator orientation="vertical" className="h-10 hidden sm:block" />
                <div className="flex flex-col gap-1 justify-center">
                  {schedule.customer.isNew && (
                    <Badge className="bg-linear-to-r from-purple-600 to-purple-400 text-white border-none text-[0.65rem] font-bold px-2 py-0.5 rounded-md shadow-sm w-fit">
                      <FaWandMagicSparkles className="w-3 h-3 mr-1.5 text-purple-100" />
                      Primeira Vez
                    </Badge>
                  )}
                  {schedule.customer.isBirthdayToday && (
                    <Badge className="bg-purple-200/50 text-purple-900 border-purple-300 text-[0.65rem] font-bold px-2 py-0.5 rounded-md shadow-none w-fit">
                      <FaCakeCandles className="w-3 h-3 mr-1.5 text-purple-900" />
                      Aniversariante
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 px-1">
              Procedimentos Agendados
              <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-purple-100 font-bold h-5 px-1.5 text-[0.65rem]">
                {schedule.procedures.length}
              </Badge>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.procedures.map((proc) => (
                <Card key={proc.id} className="p-4 border-purple-100/50 bg-white shadow-none rounded-md hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="flex flex-col gap-0.5">
                        <p className="font-bold text-gray-800 text-sm">{proc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                          <FaClock className="w-3 h-3" />
                          {proc.durationAtTimeFormatted}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-purple-900 text-sm">{proc.priceAtTimeFormatted}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* NOTAS DA PODEROSA */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800">
              Anotações da Poderosa
            </h3>
            <div className={cn(
              "p-4 rounded-md text-sm leading-relaxed border",
              schedule.customer.hasNotes
                ? "bg-amber-50/20 border-amber-100/50 text-amber-900/80 italic"
                : "bg-gray-50/50 border-gray-100 text-gray-400 border-dashed"
            )}>
              {schedule.customer.hasNotes
                ? `"${schedule.customer.notes}"`
                : `Ainda não temos registros de preferências para a ${schedule.customer.nameFormatted}. Que tal adicionar algo na próxima visita?`}
            </div>
          </div>
        </div>

        {/* SIDEBAR DE RESUMO (IGUAL AO CALENDÁRIO) */}
        <aside className="w-full lg:w-xs shrink-0 self-start">
          <div className="sticky top-20 flex flex-col">
            <Card className="w-full bg-white rounded-md shadow-[0_20px_50px_rgba(147,51,234,0.06)] border border-purple-100 overflow-hidden flex flex-col p-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
                  <FaReceipt className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-purple-900 text-sm">
                  Resumo do Atendimento
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-3 bg-gray-50/50 p-4 rounded-md border border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium flex items-center gap-2">
                      <FaCalendarDay className="w-3.5 h-3.5 text-purple-400" />
                      Data
                    </span>
                    <span className="font-bold text-gray-800">{schedule.dateFormatted}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium flex items-center gap-2">
                      <FaClock className="w-3.5 h-3.5 text-purple-400" />
                      Início
                    </span>
                    <span className="font-bold text-gray-800">{schedule.startTimeFormatted}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium flex items-center gap-2">
                      <FaFlagCheckered className="w-3.5 h-3.5 text-purple-400" />
                      Término
                    </span>
                    <span className="font-bold text-gray-800">{schedule.endTimeFormatted}</span>
                  </div>

                  <Separator className="bg-gray-200/50" />

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium flex items-center gap-2">
                      <FaStopwatch className="w-3.5 h-3.5 text-purple-400" />
                      Duração
                    </span>
                    <span className="font-bold text-gray-800">{schedule.totalDurationFormatted}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium flex items-center gap-2">
                      <FaCheckDouble className="w-3.5 h-3.5 text-purple-400" />
                      Procedimentos
                    </span>
                    <span className="font-bold text-gray-800">{schedule.procedures.length} itens</span>
                  </div>
                </div>

                <div className="py-2">
                  <div className="flex flex-col items-center justify-center bg-purple-600 rounded-md p-6 border border-purple-700 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      <FaReceipt className="w-16 h-16 text-white" />
                    </div>
                    <span className="text-[0.6rem] font-bold text-purple-200 uppercase tracking-widest mb-1 relative z-10">Total da Bancada</span>
                    <span className="text-3xl font-black text-white tracking-tighter relative z-10">
                      {schedule.totalPriceFormatted}
                    </span>
                  </div>
                </div>

                {!isCompleted && (
                  <div className="flex flex-col gap-2">
                    {!isCancelled && (
                      <Button 
                        variant="success" 
                        onClick={() => setActionType("finish")}
                        className="w-full h-11 gap-2 text-sm shadow-md transition-all active:scale-95 group font-bold"
                      >
                        <FaCalendarCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Finalizar Atendimento
                      </Button>
                    )}

                    {isCancelled && (
                      <Button 
                        onClick={() => setActionType("resume")}
                        className="w-full h-11 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/50 hover:border-blue-300 gap-2 text-sm transition-all active:scale-95 group font-bold shadow-md"
                      >
                        <FaRotateLeft className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                        Reagendar Atendimento
                      </Button>
                    )}

                    <Button
                      onClick={handleShareSummary}
                      className="w-full h-11 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50 hover:border-emerald-300 font-bold gap-2 text-sm transition-all active:scale-95 group shadow-none"
                    >
                      <FaWhatsapp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Lembrar Poderosa
                    </Button>

                    {!isCancelled && (
                      <Button 
                        variant="ghost" 
                        onClick={() => setActionType("cancel")}
                        className="w-full h-11 text-red-400 hover:text-red-600 hover:bg-red-50 gap-2 text-sm transition-all active:scale-95 font-medium shadow-none"
                      >
                        <FaCalendarXmark className="w-4 h-4 opacity-50" />
                        Cancelar Atendimento
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </aside>

      </div>
      {/* MOBILE STICKY ACTION BAR */}
      {!isCompleted && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50 flex flex-col gap-3 shadow-[0_-10px_30px_rgba(147,51,234,0.15)] pb-safe">
          {!isCancelled ? (
            <Button
              variant="success"
              onClick={() => setActionType("finish")}
              className="w-full h-12 font-bold gap-2 text-sm shadow-md transition-all active:scale-95"
            >
              <FaCalendarCheck className="w-4 h-4" />
              Finalizar Atendimento
            </Button>
          ) : (
            <Button
              onClick={() => setActionType("resume")}
              className="w-full h-12 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold gap-2 text-sm shadow-md transition-all active:scale-95"
            >
              <FaRotateLeft className="w-4 h-4" />
              Reagendar Atendimento
            </Button>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleShareSummary}
              className="flex-1 h-12 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold gap-2 text-sm transition-all active:scale-95"
            >
              <FaWhatsapp className="w-4 h-4" />
              Lembrar
            </Button>
            {!isCancelled && (
              <Button
                variant="ghost"
                onClick={() => setActionType("cancel")}
                className="flex-1 h-12 text-red-400 hover:text-red-600 hover:bg-red-50 font-bold gap-2 text-sm transition-all active:scale-95"
              >
                <FaCalendarXmark className="w-4 h-4 opacity-50" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      )}

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
