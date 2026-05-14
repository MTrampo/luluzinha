'use server'

import { createScheduleApi, deleteScheduleApi, getScheduleByIdApi, getSchedulesApi, updateScheduleApi, getSchedulesByDateApi, getSchedulesWeekApi } from "@/back/establishment/service/schedule.api";
import { revalidatePath } from "next/cache";
import { HttpStatusEnum } from "@/commons/enums/http";
import { ScheduleInsertPayload, ScheduleUpdatePayload, ScheduleProcedureInsertPayload } from "@/commons/models/schedule";
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";
import { ApiResponse } from "@/commons/lib/http/responses";

export const createScheduleAction = async (schedule: ScheduleInsertPayload, procedures: Omit<ScheduleProcedureInsertPayload, 'schedule_id'>[]) => {
  const response = await createScheduleApi(schedule, procedures);
  
  if (response.status === HttpStatusEnum.Created || response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }
  
  return response;
}

export const getSchedulesAction = async () => {
  const id = (await getEstablishmentCookie())!;
  return await getSchedulesApi(id);
}

export const getSchedulesByDateAction = async (dateIsoString: string) => {
  const id = (await getEstablishmentCookie())!;
  return await getSchedulesByDateApi(id, dateIsoString);
}

export const getSchedulesWeekAction = async () => {
  const id = (await getEstablishmentCookie())!;
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
