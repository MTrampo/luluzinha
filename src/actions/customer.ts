'use server'

import { revalidatePath } from "next/cache";
import { CustomerFormInputs, CustomerInsertPayload, CustomerUpdatePayload } from "@/commons/models/customer";
import { HttpStatusEnum } from "@/commons/enums/http";
import { addCustomerApi, listCustomersApi, updateCustomerApi, deleteCustomerApi } from "@/back/establishment/service/customer.api";
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";

export const addCustomerAction = async (input: CustomerFormInputs) => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Estabelecimento não identificado.",
      data: null
    }
  }

  const payload: CustomerInsertPayload = {
    ...input,
    name: input.name.trim(),
    phone: input.phone ? input.phone.replace(/\D/g, "") : null,
    email: input.email?.toLowerCase().trim() || null,
    birthday: input.birthday || null,
    notes: input.notes || null,
    establishment_id: establishmentId,
  };

  const response = await addCustomerApi(payload);

  if (response.status === HttpStatusEnum.Created || response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/poderosas');
  }

  return response;
}

export const getCustomersAction = async () => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Estabelecimento não identificado.",
      data: []
    }
  }

  const response = await listCustomersApi(establishmentId);
  return response;
}

export const updateCustomerAction = async (id: string, input: CustomerFormInputs) => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Estabelecimento não identificado.",
      data: null
    }
  }

  const payload: Partial<CustomerUpdatePayload> = {
    name: input.name.trim(),
    phone: input.phone ? input.phone.replace(/\D/g, "") : null,
    email: input.email?.toLowerCase().trim() || null,
    birthday: input.birthday || null,
    notes: input.notes || null,
  };

  const response = await updateCustomerApi(id, payload);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/poderosas');
  }

  return response;
}

export const deleteCustomerAction = async (id: string) => {
  const establishmentId = await getEstablishmentCookie();

  if (!establishmentId) {
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Estabelecimento não identificado.",
      data: null
    }
  }

  const response = await deleteCustomerApi(id);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/poderosas');
  }

  return response;
}
