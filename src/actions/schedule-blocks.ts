'use server'

import {
  listScheduleBlocksApi,
  createScheduleBlockApi,
  deleteScheduleBlockApi,
  getScheduleBlocksByDateApi
} from "@/back/establishment/service/blocks.api";
import { revalidatePath } from "next/cache";
import { HttpStatusEnum } from "@/commons/enums/http";
import { getOrResolveEstablishmentId } from "@/commons/lib/auth/establishment";
import { BlockScheduleFormValues } from "@/commons/models/schedule";
import { ApiResponse } from "@/commons/lib/http/responses";

export const listScheduleBlocksAction = async () => {
  const id = await getOrResolveEstablishmentId();
  if (!id) return ApiResponse.Ok({ message: "Nenhum bloqueio encontrado.", data: [] });
  return await listScheduleBlocksApi(id);
}

export const getScheduleBlocksByDateAction = async (dateIsoString: string) => {
  const id = await getOrResolveEstablishmentId();
  if (!id) return ApiResponse.Ok({ message: "Nenhum bloqueio encontrado.", data: [] });
  return await getScheduleBlocksByDateApi(id, dateIsoString);
}


export const createScheduleBlockAction = async (values: BlockScheduleFormValues) => {
  const establishmentId = await getOrResolveEstablishmentId();
  if (!establishmentId) return ApiResponse.NotFound({ message: "Espaço não encontrado." });

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
