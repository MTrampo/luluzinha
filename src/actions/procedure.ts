'use server'

import { revalidatePath } from "next/cache";

import { ProcedureFormInputs, ProcedureInsertPayload } from "@/commons/models/procedure";
import { HttpStatusEnum } from "@/commons/enums/http";
import { addProcedureApi, listProceduresApi, updateProcedureApi, deleteProcedureApi, toggleProcedureActiveApi } from "@/back/establishment/service/procedure.api";
import { convertTimeToMinutes, parseCurrencyBRLToNumber } from "@/commons/utils/helper";
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";


export const addProcedureAction = async (input: ProcedureFormInputs) => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Estabelecimento não identificado.",
      data: null
    }
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
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Estabelecimento não identificado.",
      data: []
    }
  }

  const response = await listProceduresApi(establishmentId);
  return response;
}

export const updateProcedureAction = async (id: string, input: ProcedureFormInputs) => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Estabelecimento não identificado.",
      data: null
    }
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
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Estabelecimento não identificado.",
      data: null
    }
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
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Estabelecimento não identificado.",
      data: null
    }
  }

  const response = await toggleProcedureActiveApi(id, isActive);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/procedimentos');
  }

  return response;
}
