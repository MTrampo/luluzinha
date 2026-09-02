import { ApiResponse } from "@/commons/lib/http/responses";
import { ProcedureInsertPayload, ProcedureUpdatePayload, proceduresFormatter } from "@/commons/models/procedure";
import {
  addProcedureSupabase,
  updateProcedureSupabase,
  setProcedureActiveSupabase,
  deleteProcedureSupabase,
  getProceduresByEstablishmentSupabase,
} from "../repository/procedure.supabase";
import { nowBrazilIso } from "@/commons/utils/helper";

export const addProcedureApi = async (payload: ProcedureInsertPayload) => {
  const payloadToInsert: ProcedureInsertPayload = {
    name: payload.name,
    duration: payload.duration,
    price: payload.price,
    establishment_id: payload.establishment_id,
    description: payload.description ?? null,
    is_active: payload.is_active ?? true,
    created_at: nowBrazilIso(),
    updated_at: payload.updated_at ?? null,
  }

  const { data, error } = await addProcedureSupabase(payloadToInsert)

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao criar procedimento.",
      error: error.message
    })
  }

  return ApiResponse.Created({
    message: "Procedimento criado com sucesso.",
    data: data
  })
}

export const updateProcedureApi = async (id: string, payload: Partial<ProcedureUpdatePayload>) => {
  const payloadToUpdate: Partial<ProcedureUpdatePayload> = {
    ...payload,
    updated_at: nowBrazilIso(),
  }

  const { data, error } = await updateProcedureSupabase(id, payloadToUpdate)

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao atualizar procedimento.",
      error: error.message
    })
  }

  return ApiResponse.Ok({
    message: "Procedimento atualizado com sucesso.",
    data: data
  })
}

export const toggleProcedureActiveApi = async (id: string, isActive: boolean) => {
  const { data, error } = await setProcedureActiveSupabase(id, isActive)

  if (error) {
    return ApiResponse.InternalError({
      message: isActive ? "Erro ao ativar procedimento." : "Erro ao desativar procedimento.",
      error: error.message
    })
  }

  return ApiResponse.Ok({
    message: isActive ? "Procedimento ativado com sucesso." : "Procedimento desativado com sucesso.",
    data: data
  })
}

export const deleteProcedureApi = async (id: string) => {
  const { data, error } = await deleteProcedureSupabase(id)

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao excluir procedimento.",
      error: error.message
    })
  }

  return ApiResponse.Ok({
    message: "Procedimento excluído com sucesso.",
    data: data
  })
}

export const listProceduresApi = async (establishmentId: string) => {
  const { data, error } = await getProceduresByEstablishmentSupabase(establishmentId)

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar procedimentos.",
      error: error.message
    })
  }

  return ApiResponse.Ok({
    message: "Procedimentos obtidos com sucesso.",
    data: proceduresFormatter(data)
  })
}
