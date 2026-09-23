'use server'

import { revalidatePath } from "next/cache";
import { CustomerFormInputs, CustomerInsertPayload, CustomerUpdatePayload, CustomerFormatted } from "@/commons/models/customer";
import { HttpStatusEnum } from "@/commons/enums/http";
import { addCustomerApi, listCustomersApi, listCustomersPaginatedApi, updateCustomerApi, deleteCustomerApi } from "@/back/establishment/service/customer.api";
import { getAuthenticatedSessionContext } from "@/commons/lib/auth/establishment";
import { PaginationParams } from "@/commons/models/pagination";
import { ResponseProps } from "@/commons/models/api";

export const addCustomerAction = async (input: CustomerFormInputs) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

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
};

export const getCustomersAction = async (): Promise<ResponseProps<CustomerFormatted[] | null>> => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error as ResponseProps<null>;
  const { establishmentId } = session.context;

  const response = await listCustomersApi(establishmentId);
  return response;
};



export const getCustomersPaginatedAction = async (params: PaginationParams = {}) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;
  const { establishmentId } = session.context;

  const response = await listCustomersPaginatedApi(establishmentId, params);
  return response;
};

export const updateCustomerAction = async (id: string, input: CustomerFormInputs) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;

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
};

export const deleteCustomerAction = async (id: string) => {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) return session.error;

  const response = await deleteCustomerApi(id);

  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/painel/poderosas');
  }

  return response;
};

