import { ApiResponse } from "@/commons/lib/http/responses";
import { CustomerInsertPayload, CustomerUpdatePayload, customersFormatter } from "@/commons/models/customer";
import {
  addCustomerSupabase,
  updateCustomerSupabase,
  deleteCustomerSupabase,
  getCustomersByEstablishmentSupabase,
} from "../repository/customer.supabase";
import { nowBrazilIso } from "@/commons/utils/helper";

export const addCustomerApi = async (payload: CustomerInsertPayload) => {
  const payloadToInsert: CustomerInsertPayload = {
    ...payload,
    created_at: nowBrazilIso(),
    updated_at: payload.updated_at ?? null,
  }

  const { data, error } = await addCustomerSupabase(payloadToInsert);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao cadastrar cliente.",
      error: error.message
    });
  }

  return ApiResponse.Created({
    message: "Poderosa cadastrada com sucesso!",
    data: data
  });
}

export const updateCustomerApi = async (id: string, payload: Partial<CustomerUpdatePayload>) => {
  const payloadToUpdate: Partial<CustomerUpdatePayload> = {
    ...payload,
    updated_at: nowBrazilIso(),
  }

  const { data, error } = await updateCustomerSupabase(id, payloadToUpdate);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao atualizar os dados da cliente.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Dados da Poderosa atualizados com sucesso!",
    data: data
  });
}

export const deleteCustomerApi = async (id: string) => {
  const { data, error } = await deleteCustomerSupabase(id);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao remover cliente.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Poderosa removida com sucesso.",
    data: data
  });
}

export const listCustomersApi = async (establishmentId: string) => {
  const { data, error } = await getCustomersByEstablishmentSupabase(establishmentId);

  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao buscar a lista de poderosas.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Poderosas obtidas com sucesso.",
    data: customersFormatter(data || [])
  });
}
