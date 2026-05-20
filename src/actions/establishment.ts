'use server'

import { getEstablishmentsByOwnerIdApi, updateEstablishmentDetailsApi } from "@/back/account/service/establishment.api";
import { getUserLoggedApi } from "@/back/account/service/auth.api";
import { establishmentsFormatter, EstablishmentFormatted, EstablishmentUpdateInput, EstablishmentSupabase } from "@/commons/models/establishment";
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";
import { revalidatePath } from "next/cache";
import { ResponseProps } from "@/commons/models/api";

export const getEstablishmentsByOwnerIdAction = async (userId: string) => {
  const response = await getEstablishmentsByOwnerIdApi(userId);
  return response;
}

export const getActiveEstablishmentsAction = async (): Promise<{
  establishments: EstablishmentFormatted[];
  activeEstablishment: EstablishmentFormatted | null;
}> => {
  const userResult = await getUserLoggedApi()
  const userId = userResult.data?.user?.id

  if (!userId) {
    return { establishments: [], activeEstablishment: null }
  }

  const response = await getEstablishmentsByOwnerIdApi(userId)
  const formatted = establishmentsFormatter(response.data) || []

  const activeId = await getEstablishmentCookie()
  const active = formatted.find(e => e.id === activeId) || formatted[0] || null

  return { establishments: formatted, activeEstablishment: active }
}

export const updateEstablishmentAction = async (
  establishmentId: string,
  data: EstablishmentUpdateInput
): Promise<ResponseProps<EstablishmentSupabase | null>> => {
  const response = await updateEstablishmentDetailsApi(establishmentId, data);
  if (response.status === 200) {
    revalidatePath("/painel/bancada");
    revalidatePath("/painel/conta");
  }
  return response;
}
