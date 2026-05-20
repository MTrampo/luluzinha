import { ApiResponse } from "@/commons/lib/http/responses";
import { getEstablishmentsByOwnerIdSupabase, updateEstablishmentSupabase } from "../repository/establishment.supabase";
import { EstablishmentUpdateInput, EstablishmentSupabase } from "@/commons/models/establishment";
import { ResponseProps } from "@/commons/models/api";

export const getEstablishmentsByOwnerIdApi = async (userId: string) => {
  const { data, error } = await getEstablishmentsByOwnerIdSupabase(userId)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar estabelecimentos.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Estabelecimentos obtidos com sucesso.",
    data: data
  });
}

export const updateEstablishmentDetailsApi = async (
  establishmentId: string,
  data: EstablishmentUpdateInput
): Promise<ResponseProps<EstablishmentSupabase | null>> => {
  const { data: updated, error } = await updateEstablishmentSupabase(establishmentId, data);
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao atualizar os dados da sua bancada.",
      error: error.message
    });
  }

  if (!updated) {
    return ApiResponse.NotFound({
      message: "Estabelecimento não encontrado para atualização."
    });
  }

  return ApiResponse.Ok({
    message: "Bancada atualizada com sucesso!",
    data: updated
  });
}