import { ApiResponse } from "@/commons/lib/http/responses";
import {
  listEstablishmentBlocksSupabase,
  createEstablishmentBlockSupabase,
  deleteEstablishmentBlockSupabase,
  getBlocksByDateSupabase
} from "../repository/blocks.supabase";
import { serverSupabase } from "@/commons/lib/supabase/server";
import { BlockScheduleInsertPayload } from "@/commons/models/schedule";

export const listEstablishmentBlocksApi = async (establishmentId: string) => {
  const { data, error } = await listEstablishmentBlocksSupabase(establishmentId)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar bloqueios.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Bloqueios obtidos com sucesso.",
    data: data
  });
}

export const createEstablishmentBlockApi = async (payload: BlockScheduleInsertPayload) => {
  const supabase = await serverSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return ApiResponse.Unauthorized({ message: "Usuário não autenticado." });
  }

  const { error } = await createEstablishmentBlockSupabase({
    ...payload,
    user_id: user.id
  })

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao criar bloqueio.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Bloqueio criado com sucesso."
  });
}

export const deleteEstablishmentBlockApi = async (id: string) => {
  const { error } = await deleteEstablishmentBlockSupabase(id)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao excluir bloqueio.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Bloqueio excluído com sucesso."
  });
}

export const getBlocksByDateApi = async (establishmentId: string, date: string) => {
  const { data, error } = await getBlocksByDateSupabase(establishmentId, date)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar bloqueios da data.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Bloqueios da data obtidos com sucesso.",
    data: data
  });
}
