"use server"

import { getFinanceDashboardApi } from "@/back/finance/service/finance.api";
import { getEstablishmentCookie } from "@/commons/lib/auth/establishment";
import { nowBrazilIso } from "@/commons/utils/helper";
import { startOfMonth, endOfMonth } from "date-fns";
import { HttpStatusEnum } from "@/commons/enums/http";

export async function getFinanceDashboardAction(dateLocalIsoString?: string) {
  const establishmentId = await getEstablishmentCookie();
  if (!establishmentId) {
    return { success: false, error: "Estabelecimento não encontrado." };
  }

  // Se não vier data, assume agora
  const targetDateStr = dateLocalIsoString || nowBrazilIso();
  const targetDate = new Date(targetDateStr);

  const firstDay = startOfMonth(targetDate).toISOString();
  const lastDay = endOfMonth(targetDate).toISOString();

  const response = await getFinanceDashboardApi(
    establishmentId,
    targetDateStr,
    firstDay,
    lastDay
  );

  return {
    success: response.status === HttpStatusEnum.Ok,
    data: response.data,
    message: response.message,
    error: response.error
  };
}
