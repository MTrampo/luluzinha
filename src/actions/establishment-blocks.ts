'use server'

import {
  listEstablishmentBlocksApi,
  createEstablishmentBlockApi,
  deleteEstablishmentBlockApi,
  getBlocksByDateApi
} from "@/back/establishment/service/blocks.api";
import { revalidatePath } from "next/cache";
import { HttpStatusEnum } from "@/commons/enums/http";
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";
import { BlockScheduleFormValues, BlockScheduleInsertPayload } from "@/commons/models/schedule";
import { format, parseISO, getDay } from "date-fns";
import { nowBrazilIso } from "@/commons/utils/helper";
import { ApiResponse } from "@/commons/lib/http/responses";

export const listEstablishmentBlocksAction = async () => {
  const id = (await getEstablishmentCookie())!;
  return await listEstablishmentBlocksApi(id);
}

export const getBlocksByDateAction = async (dateIsoString: string) => {
  const id = (await getEstablishmentCookie())!;
  return await getBlocksByDateApi(id, dateIsoString);
}

export const createEstablishmentBlockAction = async (values: BlockScheduleFormValues, userId: string) => {
  const establishmentId = (await getEstablishmentCookie())!;

  const finalReason = values.reasonSelect === "other" ? values.reasonCustom : values.reasonSelect;
  const startTime = values.isAllDay ? "00:00" : values.startTime;
  const endTime = values.isAllDay ? "23:59" : values.endTime;

  const payload: BlockScheduleInsertPayload = {
    establishment_id: establishmentId,
    reason: finalReason || null,
    start_time: startTime,
    end_time: endTime,
    date: values.isRecurring ? null : values.date || null,
    day_of_week: values.isRecurring && values.date ? getDay(parseISO(values.date)) : null,
    user_id: userId,
    created_at: nowBrazilIso(),
    updated_at: nowBrazilIso(),
  };

  const response = await createEstablishmentBlockApi(payload);
  if (response.status === HttpStatusEnum.Ok || response.status === HttpStatusEnum.Created) {
    revalidatePath('/painel/bloqueios');
    revalidatePath('/painel/agenda');
  }
  return response;
}

export const deleteEstablishmentBlockAction = async (id: string) => {
  const response = await deleteEstablishmentBlockApi(id);
  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/bloqueios');
    revalidatePath('/painel/agenda');
  }
  return response;
}
