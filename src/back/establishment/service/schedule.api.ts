import { addScheduleSupabase, deleteScheduleSupabase, getScheduleByIdSupabase, getSchedulesByEstablishmentSupabase, updateScheduleSupabase, getSchedulesByDateSupabase, getSchedulesByRangeSupabase, checkScheduleConflictsSupabase, updateScheduleWithProceduresSupabase } from "../repository/schedule.supabase";
import { getScheduleBlocksByDateSupabase } from "../repository/blocks.supabase";
import { ApiResponse } from "@/commons/lib/http/responses";
import { nowBrazilIso } from "@/commons/utils/helper";
import { ScheduleInsertPayload, ScheduleUpdatePayload, ScheduleProcedureInsertPayload, schedulesFormatter, formatSchedule, schedulesWeekDayFormatter, schedulesDashFormatter, ScheduleDashSupabase, blocksFormatter } from "@/commons/models/schedule";
import { startOfWeek, endOfWeek } from "date-fns";
import { ScheduleStatusEnum } from "@/commons/enums/schedule";

export const createScheduleApi = async (schedule: ScheduleInsertPayload, procedures: Omit<ScheduleProcedureInsertPayload, 'schedule_id'>[]) => {
  const payloadToInsert: ScheduleInsertPayload = {
    ...schedule,
    created_at: nowBrazilIso(),
    updated_at: schedule.updated_at ?? null,
  };

  // Verificação de conflitos
  const { conflict, error: conflictError } = await checkScheduleConflictsSupabase(
    schedule.establishment_id,
    schedule.start_at,
    schedule.end_at
  );

  if (conflictError) {
    return ApiResponse.InternalError({ message: "Erro ao validar conflitos.", error: conflictError.message });
  }

  if (conflict) {
    return ApiResponse.Conflict({
      message: "{luluzinha}, identificamos conflito de horários , q tal escolher outro?"
    });
  }

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
  const [schedulesRes, blocksRes] = await Promise.all([
    getSchedulesByDateSupabase(establishmentId, dateIsoString),
    getScheduleBlocksByDateSupabase(establishmentId, dateIsoString)
  ]);

  if (schedulesRes.error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar agendamentos.",
      error: schedulesRes.error.message
    });
  }

  const schedules = schedulesDashFormatter(schedulesRes.data);
  const blocks = blocksFormatter(blocksRes.data);

  // OTIMIZAÇÃO: Gera a lista de intervalos ocupados unificada (ISO Strings)
  const busyIntervals = [
    ...schedules
      .filter(s => s.status !== ScheduleStatusEnum.CANCELLED)
      .map(s => ({ startAt: s.startAt, endAt: s.endAt })),
    ...blocks.map(b => ({
      startAt: `${dateIsoString}T${b.startTime}:00`,
      endAt: `${dateIsoString}T${b.endTime}:00`
    }))
  ];

  return ApiResponse.Ok({
    message: "Dados da agenda obtidos com sucesso.",
    data: {
      schedules,
      blocks,
      busyIntervals
    }
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

export const updateScheduleWithProceduresApi = async (
  establishmentId: string,
  scheduleId: string,
  schedule: ScheduleUpdatePayload,
  procedures: Omit<ScheduleProcedureInsertPayload, 'schedule_id'>[]
) => {
  const payloadToUpdate: ScheduleUpdatePayload = {
    ...schedule,
    updated_at: nowBrazilIso(),
  };

  // Verificação de conflitos ignorando o agendamento atual
  if (payloadToUpdate.start_at && payloadToUpdate.end_at) {
    const { conflict, error: conflictError } = await checkScheduleConflictsSupabase(
      establishmentId,
      payloadToUpdate.start_at,
      payloadToUpdate.end_at,
      scheduleId
    );

    if (conflictError) {
      return ApiResponse.InternalError({ message: "Erro ao validar conflitos.", error: conflictError.message });
    }

    if (conflict) {
      return ApiResponse.Conflict({
        message: "{luluzinha}, identificamos conflito com este novo horário, que tal escolher outro?"
      });
    }
  }

  const { data, error } = await updateScheduleWithProceduresSupabase(scheduleId, payloadToUpdate, procedures as ScheduleProcedureInsertPayload[]);

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

export const resumeScheduleApi = async (
  establishmentId: string,
  scheduleId: string,
  startAt: string,
  endAt: string
) => {
  // Verificação de conflitos
  const { conflict, error: conflictError } = await checkScheduleConflictsSupabase(
    establishmentId,
    startAt,
    endAt,
    scheduleId // Ignoramos ele mesmo na busca
  );

  if (conflictError) {
    return ApiResponse.InternalError({ message: "Erro ao validar conflitos.", error: conflictError.message });
  }

  if (conflict) {
    return ApiResponse.Conflict({
      message: "{luluzinha}, já existe um atendimento neste horário. Não é possível reagendar automaticamente."
    });
  }

  const payloadToUpdate: ScheduleUpdatePayload = {
    status: ScheduleStatusEnum.CONFIRMED,
    updated_at: nowBrazilIso(),
  };

  const { data, error } = await updateScheduleSupabase(scheduleId, payloadToUpdate);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao reagendar atendimento.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Atendimento reagendado com sucesso.",
    data: data
  });
}
