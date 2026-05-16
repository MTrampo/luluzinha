import { ApiResponse } from "@/commons/lib/http/responses";
import {
  listScheduleBlocksSupabase,
  createScheduleBlockSupabase,
  deleteScheduleBlockSupabase,
  getScheduleBlocksByDateSupabase,
  checkScheduleBlockConflictsSupabase
} from "../repository/blocks.supabase";
import { serverSupabase } from "@/commons/lib/supabase/server";
import { BlockScheduleFormValues, BlockScheduleInsertPayload, blocksFormatter } from "@/commons/models/schedule";
import { parseISO, getDay } from "date-fns";
import { nowBrazilIso } from "@/commons/utils/helper";
import { BlockRecurringTypeEnum } from "@/commons/enums/schedule";

export const listScheduleBlocksApi = async (establishmentId: string) => {
  const { data, error } = await listScheduleBlocksSupabase(establishmentId)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar bloqueios.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Bloqueios obtidos com sucesso.",
    data: blocksFormatter(data)
  });
}

export const createScheduleBlockApi = async (values: BlockScheduleFormValues, establishmentId: string) => {
  const supabase = await serverSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return ApiResponse.Unauthorized({ message: "Usuário não autenticado." });
  }

  const finalReason = values.reasonSelect === "other" ? values.reasonCustom : values.reasonSelect;
  const startTime = (values.isAllDay ? "00:00" : values.startTime).substring(0, 5);
  const endTime = (values.isAllDay ? "23:59" : values.endTime).substring(0, 5);

  const payload: any = {
    establishment_id: establishmentId,
    reason: finalReason || null,
    start_time: startTime,
    end_time: endTime,
    date: values.recurringType !== BlockRecurringTypeEnum.NONE ? null : values.date || null,
    day_of_week: values.recurringType === BlockRecurringTypeEnum.WEEKLY && values.date ? getDay(parseISO(values.date)) : null,
    recurring_type: values.recurringType,
    user_id: user.id,
    created_at: nowBrazilIso(),
    updated_at: nowBrazilIso(),
  };

  // Verificação de conflitos
  const { conflict, type: conflictType, error: conflictError } = await checkScheduleBlockConflictsSupabase(
    establishmentId,
    payload.start_time,
    payload.end_time,
    payload.date,
    payload.recurring_type,
    payload.day_of_week
  );

  if (conflictError) {
    return ApiResponse.InternalError({ message: "Erro ao validar conflitos.", error: conflictError.message });
  }

  if (conflict) {
    const conflictMsg = conflictType === 'schedule' 
      ? "{luluzinha}, identificamos conflito de horários com um agendamento existente, que tal escolher outro?"
      : "{luluzinha}, identificamos conflito de horários com outro bloqueio, que tal escolher outro?";
    return ApiResponse.Conflict({ message: conflictMsg });
  }

  const { error } = await createScheduleBlockSupabase(payload)

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao criar bloqueio.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Bloqueio criado com sucesso."
  });
}

export const deleteScheduleBlockApi = async (id: string) => {
  const { error } = await deleteScheduleBlockSupabase(id)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao excluir bloqueio.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Bloqueio excluído com sucesso."
  });
}

export const getScheduleBlocksByDateApi = async (establishmentId: string, date: string) => {
  const { data, error } = await getScheduleBlocksByDateSupabase(establishmentId, date)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar bloqueios da data.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Bloqueios da data obtidos com sucesso.",
    data: blocksFormatter(data)
  });
}
