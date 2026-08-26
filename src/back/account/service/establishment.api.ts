import { ApiResponse } from "@/commons/lib/http/responses";
import { getEstablishmentsByOwnerIdSupabase, updateEstablishmentSupabase, checkSlugAvailabilitySupabase, insertEstablishmentSupabase } from "../repository/establishment.supabase";
import { EstablishmentUpdateInput, EstablishmentSupabase } from "@/commons/models/establishment";
import { ResponseProps } from "@/commons/models/api";
import { ESTABLISHMENT_DEFAULT_HOURS } from "@/commons/constants/establishment";

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

export const checkSlugAvailabilityApi = async (slug: string) => {
  const { exists, error } = await checkSlugAvailabilitySupabase(slug)
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao verificar disponibilidade do link.",
      error: error.message
    })
  }

  return ApiResponse.Ok({
    message: "Disponibilidade do link verificada.",
    data: { available: !exists }
  })
}

export const createEstablishmentApi = async (
  userId: string,
  establishmentData: {
    name: string
    slug: string
    avatar_url?: string | null
    phone?: string | null
    address?: string | null
  }
) => {
  const { data, error } = await insertEstablishmentSupabase(userId, {
    name: establishmentData.name,
    slug: establishmentData.slug,
    avatar_url: establishmentData.avatar_url || null,
    phone: establishmentData.phone || null,
    address: establishmentData.address || null,
    opening_hours: ESTABLISHMENT_DEFAULT_HOURS
  })

  if (error) {
    if (error.code === '23505') {
      return ApiResponse.BadRequest({
        message: "Esse link já está em uso por outra Poderosa. Escolha outro link!",
        error: error.message
      })
    }
    return ApiResponse.InternalError({
      message: "Erro ao criar sua bancada digital.",
      error: error.message
    })
  }

  return ApiResponse.Ok({
    message: "Sua bancada digital foi criada com sucesso!",
    data
  })
}