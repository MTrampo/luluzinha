'use server'

import { revalidatePath } from "next/cache";
import {
  ProcedureFormInputs,
  ProcedureInsertPayload,
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
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";
import { ApiResponse } from "@/commons/lib/http/responses";

export const addProcedureAction = async (input: ProcedureFormInputs) => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return ApiResponse.BadRequest({ message: "Estabelecimento não identificado." });
  }

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
}

export const getProceduresAction = async () => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return ApiResponse.Ok({ message: "Estabelecimento não identificado.", data: [] });
  }

  const response = await listProceduresApi(establishmentId);
  return response;
}

export const updateProcedureAction = async (id: string, input: ProcedureFormInputs) => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return ApiResponse.BadRequest({ message: "Estabelecimento não identificado." });
  }

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
}

export const deleteProcedureAction = async (id: string) => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return ApiResponse.BadRequest({ message: "Estabelecimento não identificado." });
  }

  const response = await deleteProcedureApi(id);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/procedimentos');
  }

  return response;
}

export const toggleProcedureActiveAction = async (id: string, isActive: boolean) => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return ApiResponse.BadRequest({ message: "Estabelecimento não identificado." });
  }

  const response = await toggleProcedureActiveApi(id, isActive);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/procedimentos');
  }

  return response;
}

export const getProcedureLimitInfoAction = async () => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return ApiResponse.Ok<ProcedureLimitInfo>({
      message: "Nenhum espaço ativo.",
      data: createDefaultProcedureLimitInfo(),
    });
  }

  return await getProcedureLimitInfoApi(establishmentId);
}

