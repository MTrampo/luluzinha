'use server'

import { getEstablishmentsByOwnerIdApi } from "@/back/account/service/establishment.api";
import { getUserLoggedApi } from "@/back/account/service/auth.api";
import { establishmentsFormatter, EstablishmentFormatted } from "@/commons/models/establishment";
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";

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
