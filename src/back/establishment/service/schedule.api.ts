import { addScheduleSupabase, deleteScheduleSupabase, getScheduleByIdSupabase, getSchedulesByEstablishmentSupabase, updateScheduleSupabase, getSchedulesByDateSupabase, getSchedulesByRangeSupabase } from "../repository/schedule.supabase";
import { ApiResponse } from "@/commons/lib/http/responses";
import { nowBrazilIso } from "@/commons/utils/helper";
import { ScheduleInsertPayload, ScheduleUpdatePayload, ScheduleProcedureInsertPayload, schedulesFormatter, formatSchedule, schedulesWeekDayFormatter, schedulesDashFormatter, ScheduleDashSupabase } from "@/commons/models/schedule";
import { startOfWeek, endOfWeek } from "date-fns";

export const createScheduleApi = async (schedule: ScheduleInsertPayload, procedures: Omit<ScheduleProcedureInsertPayload, 'schedule_id'>[]) => {
  const payloadToInsert: ScheduleInsertPayload = {
    ...schedule,
    created_at: nowBrazilIso(),
    updated_at: schedule.updated_at ?? null,
  };

  const { data, error } = await addScheduleSupabase(payloadToInsert, procedures as ScheduleProcedureInsertPayload[]);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao criar agendamento.",
      error: error.message
    });
  }

  return ApiResponse.Created({
    message: "Agendamento criado com sucesso.",
    data: data
  });
}


export const getSchedulesApi = async (establishmentId: string) => {
  const { data, error } = await getSchedulesByEstablishmentSupabase(establishmentId);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar agendamentos.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Agendamentos obtidos com sucesso.",
    data: schedulesDashFormatter(data)
  });
}

export const getSchedulesByDateApi = async (establishmentId: string, dateIsoString: string) => {
  const { data, error } = await getSchedulesByDateSupabase(establishmentId, dateIsoString);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar agendamentos na data específica.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Agendamentos da data obtidos com sucesso.",
    data: schedulesDashFormatter(data)
  });
}

export const getSchedulesWeekApi = async (establishmentId: string) => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 0 }); // Domingo
  const end = endOfWeek(today, { weekStartsOn: 0 }); // Sábado

  const { data, error } = await getSchedulesByRangeSupabase(
    establishmentId,
    start.toISOString(),
    end.toISOString()
  );

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar agendamentos da semana.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Agendamentos da semana obtidos com sucesso.",
    data: schedulesWeekDayFormatter(data)
  });
}


export const getScheduleByIdApi = async (id: string) => {
  const { data, error } = await getScheduleByIdSupabase(id);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar agendamento.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Agendamento obtido com sucesso.",
    data: data ? formatSchedule(data) : null
  });
}

export const updateScheduleApi = async (id: string, payload: ScheduleUpdatePayload) => {
  const payloadToUpdate: ScheduleUpdatePayload = {
    ...payload,
    updated_at: nowBrazilIso(),
  };

  const { data, error } = await updateScheduleSupabase(id, payloadToUpdate);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao atualizar agendamento.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Agendamento atualizado com sucesso.",
    data: data
  });
}

export const deleteScheduleApi = async (id: string) => {
  const { data, error } = await deleteScheduleSupabase(id);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao excluir agendamento.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Agendamento excluído com sucesso.",
    data: data
  });
}
