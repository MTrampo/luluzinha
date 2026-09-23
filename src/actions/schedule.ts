'use server'

import {
  createScheduleApi,
  deleteScheduleApi,
  getScheduleByIdApi,
  getSchedulesApi,
  updateScheduleApi,
  getSchedulesByDateApi,
  getSchedulesWeekApi,
  updateScheduleWithProceduresApi,
  resumeScheduleApi,
  getEstablishmentRetentionDaysApi,
} from "@/back/establishment/service/schedule.api";
import { revalidatePath } from "next/cache";
import { HttpStatusEnum } from "@/commons/enums/http";
import {
  ScheduleInsertPayload,
  ScheduleUpdatePayload,
  ScheduleProcedureInsertPayload,
  ScheduleDateData,
  ScheduleRetentionData,
  createEmptyScheduleDateData,
  createDefaultScheduleRetentionData,
} from "@/commons/models/schedule";
import { getAuthenticatedSessionContext } from "@/commons/lib/auth/establishment";
import { ApiResponse } from "@/commons/lib/http/responses";

export const createScheduleAction = async (schedule: ScheduleInsertPayload, procedures: Omit<ScheduleProcedureInsertPayload, 'schedule_id'>[]) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;

  const response = await createScheduleApi(schedule, procedures);
  
  if (response.status === HttpStatusEnum.Created || response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }
  
  return response;
};

export const getSchedulesAction = async () => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

  return await getSchedulesApi(establishmentId);
};

export const getSchedulesByDateAction = async (dateIsoString: string) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

  return await getSchedulesByDateApi(establishmentId, dateIsoString);
};

export const getSchedulesWeekAction = async () => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

  return await getSchedulesWeekApi(establishmentId);
};

export const getScheduleByIdAction = async (id: string) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;

  return await getScheduleByIdApi(id);
};

export const updateScheduleAction = async (id: string, payload: ScheduleUpdatePayload) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;

  const response = await updateScheduleApi(id, payload);
  
  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }
  
  return response;
};

export const deleteScheduleAction = async (id: string) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;

  const response = await deleteScheduleApi(id);
  
  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }
  
  return response;
};

export const updateScheduleWithProceduresAction = async (
  scheduleId: string,
  schedule: ScheduleUpdatePayload,
  procedures: Omit<ScheduleProcedureInsertPayload, 'schedule_id'>[]
) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

  const response = await updateScheduleWithProceduresApi(establishmentId, scheduleId, schedule, procedures);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }

  return response;
};

export const resumeScheduleAction = async (scheduleId: string, startAt: string, endAt: string) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

  const response = await resumeScheduleApi(establishmentId, scheduleId, startAt, endAt);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/agenda');
  }

  return response;
};

export const getScheduleRetentionDaysAction = async () => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

  return await getEstablishmentRetentionDaysApi(establishmentId);
};



