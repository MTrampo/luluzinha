'use server'

import { revalidatePath } from "next/cache";
import {
  ProcedureFormInputs,
  ProcedureInsertPayload,
  ProcedureFormatted,
  ProcedureLimitInfo,
  createDefaultProcedureLimitInfo,
} from "@/commons/models/procedure";
import { HttpStatusEnum } from "@/commons/enums/http";
import {
  addProcedureApi,
  listProceduresApi,
  updateProcedureApi,
  deleteProcedureApi,
  toggleProcedureActiveApi,
  getProcedureLimitInfoApi,
} from "@/back/establishment/service/procedure.api";
import { convertTimeToMinutes, parseCurrencyBRLToNumber } from "@/commons/utils/helper";
import { getAuthenticatedSessionContext } from "@/commons/lib/auth/establishment";
import { ApiResponse } from "@/commons/lib/http/responses";
import { ResponseProps } from "@/commons/models/api";

export const addProcedureAction = async (input: ProcedureFormInputs) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

  const payload: ProcedureInsertPayload = {
    ...input,
    name: input.name.toLowerCase().trim(),
    description: input.description?.toLowerCase().trim() || null,
    price: parseCurrencyBRLToNumber(input.price),
    duration: convertTimeToMinutes(input.duration),
    establishment_id: establishmentId,
    is_active: true,
  };

  const response = await addProcedureApi(payload);

  if (response.status === HttpStatusEnum.Created || response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/procedimentos');
  }

  return response;
};

export const getProceduresAction = async (): Promise<ResponseProps<ProcedureFormatted[] | null>> => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error as ResponseProps<null>;
  const { establishmentId } = session.context;

  const response = await listProceduresApi(establishmentId);
  return response;
};



export const updateProcedureAction = async (id: string, input: ProcedureFormInputs) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;

  const payload: Partial<ProcedureInsertPayload> = {
    name: input.name.toLowerCase().trim(),
    description: input.description?.toLowerCase().trim() || null,
    price: parseCurrencyBRLToNumber(input.price),
    duration: convertTimeToMinutes(input.duration),
  };

  const response = await updateProcedureApi(id, payload);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/procedimentos');
  }

  return response;
};

export const deleteProcedureAction = async (id: string) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;

  const response = await deleteProcedureApi(id);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/procedimentos');
  }

  return response;
};

export const toggleProcedureActiveAction = async (id: string, isActive: boolean) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;

  const response = await toggleProcedureActiveApi(id, isActive);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/procedimentos');
  }

  return response;
};

export const getProcedureLimitInfoAction = async () => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

  return await getProcedureLimitInfoApi(establishmentId);
};


