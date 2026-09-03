'use server'

import { createScheduleApi, deleteScheduleApi, getScheduleByIdApi, getSchedulesApi, updateScheduleApi, getSchedulesByDateApi, getSchedulesWeekApi, updateScheduleWithProceduresApi, resumeScheduleApi } from "@/back/establishment/service/schedule.api";
import { revalidatePath } from "next/cache";
import { HttpStatusEnum } from "@/commons/enums/http";
import { ScheduleInsertPayload, ScheduleUpdatePayload, ScheduleProcedureInsertPayload } from "@/commons/models/schedule";
import { getOrResolveEstablishmentId } from "@/commons/lib/auth/establishment";
import { ApiResponse } from "@/commons/lib/http/responses";

export const createScheduleAction = async (schedule: ScheduleInsertPayload, procedures: Omit<ScheduleProcedureInsertPayload, 'schedule_id'>[]) => {
  const response = await createScheduleApi(schedule, procedures);
  
  if (response.status === HttpStatusEnum.Created || response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }
  
  return response;
}

export const getSchedulesAction = async () => {
  const id = await getOrResolveEstablishmentId();
  if (!id) return ApiResponse.Ok({ message: "Nenhum espaço ativo.", data: [] });
  return await getSchedulesApi(id);
}

export const getSchedulesByDateAction = async (dateIsoString: string) => {
  const id = await getOrResolveEstablishmentId();
  if (!id) return ApiResponse.Ok({ message: "Nenhum espaço ativo.", data: { schedules: [], blocks: [], busyIntervals: [] } });
  return await getSchedulesByDateApi(id, dateIsoString);
}

export const getSchedulesWeekAction = async () => {
  const id = await getOrResolveEstablishmentId();
  if (!id) return ApiResponse.Ok({ message: "Nenhum espaço ativo.", data: [] });
  return await getSchedulesWeekApi(id);
}

export const getScheduleByIdAction = async (id: string) => {
  return await getScheduleByIdApi(id);
}

export const updateScheduleAction = async (id: string, payload: ScheduleUpdatePayload) => {
  const response = await updateScheduleApi(id, payload);
  
  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }
  
  return response;
}

export const deleteScheduleAction = async (id: string) => {
  const response = await deleteScheduleApi(id);
  
  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }
  
  return response;
}

export const updateScheduleWithProceduresAction = async (
  scheduleId: string,
  schedule: ScheduleUpdatePayload,
  procedures: Omit<ScheduleProcedureInsertPayload, 'schedule_id'>[]
) => {
  const establishmentId = await getOrResolveEstablishmentId();
  if (!establishmentId) return ApiResponse.NotFound({ message: "Espaço não encontrado." });
  const response = await updateScheduleWithProceduresApi(establishmentId, scheduleId, schedule, procedures);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }

  return response;
}

export const resumeScheduleAction = async (scheduleId: string, startAt: string, endAt: string) => {
  const establishmentId = await getOrResolveEstablishmentId();
  if (!establishmentId) return ApiResponse.NotFound({ message: "Espaço não encontrado." });
  const response = await resumeScheduleApi(establishmentId, scheduleId, startAt, endAt);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }

  return response;
}

