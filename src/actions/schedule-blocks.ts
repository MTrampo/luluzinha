'use server'

import {
  listScheduleBlocksApi,
  createScheduleBlockApi,
  deleteScheduleBlockApi,
  getScheduleBlocksByDateApi
} from "@/back/establishment/service/blocks.api";
import { revalidatePath } from "next/cache";
import { HttpStatusEnum } from "@/commons/enums/http";
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";
import { BlockScheduleFormValues } from "@/commons/models/schedule";

export const listScheduleBlocksAction = async () => {
  const id = (await getEstablishmentCookie())!;
  return await listScheduleBlocksApi(id);
}

export const getScheduleBlocksByDateAction = async (dateIsoString: string) => {
  const id = (await getEstablishmentCookie())!;
  return await getScheduleBlocksByDateApi(id, dateIsoString);
}

export const createScheduleBlockAction = async (values: BlockScheduleFormValues) => {
  const establishmentId = (await getEstablishmentCookie())!;

  const response = await createScheduleBlockApi(values, establishmentId);
  if (response.status === HttpStatusEnum.Ok || response.status === HttpStatusEnum.Created) {
    revalidatePath('/painel/bancada');
    revalidatePath('/painel/agenda');
  }
  return response;
}

export const deleteScheduleBlockAction = async (id: string) => {
  const response = await deleteScheduleBlockApi(id);
  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/bancada');
    revalidatePath('/painel/agenda');
  }
  return response;
}
