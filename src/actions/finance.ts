"use server"

import {
  getFinanceDashboardApi,
  getFinanceTransactionsPaginatedApi,
} from "@/back/finance/service/finance.api";
import { getAuthenticatedSessionContext } from "@/commons/lib/auth/establishment";
import { nowBrazilIso } from "@/commons/utils/helper";
import { startOfMonth, endOfMonth } from "date-fns";
import { HttpStatusEnum } from "@/commons/enums/http";
import { PaginationParams } from "@/commons/models/pagination";

export async function getFinanceDashboardAction(
  dateLocalIsoString?: string,
  pagination: PaginationParams = { page: 1, pageSize: 10 }
) {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) {
    return { success: false, error: session.error.message || "Sua sessão expirou por segurança. Por favor, faça login novamente para acessar o seu espaço.", data: null };
  }
  const { establishmentId } = session.context;

  // Se não vier data, assume agora
  const targetDateStr = dateLocalIsoString || nowBrazilIso();
  const targetDate = new Date(targetDateStr);

  const firstDay = startOfMonth(targetDate).toISOString();
  const lastDay = endOfMonth(targetDate).toISOString();

  const response = await getFinanceDashboardApi(
    establishmentId,
    targetDateStr,
    firstDay,
    lastDay,
    pagination
  );

  return {
    success: response.status === HttpStatusEnum.Ok,
    data: response.data,
    message: response.message,
    error: response.error,
  };
}

export async function getFinanceTransactionsPaginatedAction(
  dateLocalIsoString?: string,
  pagination: PaginationParams = { page: 1, pageSize: 10 }
) {
  const session = await getAuthenticatedSessionContext();
  if (!session.success) {
    return { success: false, error: session.error.message || "Sua sessão expirou por segurança. Por favor, faça login novamente para acessar o seu espaço.", data: null };
  }
  const { establishmentId } = session.context;

  const targetDateStr = dateLocalIsoString || nowBrazilIso();
  const targetDate = new Date(targetDateStr);

  const firstDay = startOfMonth(targetDate).toISOString();
  const lastDay = endOfMonth(targetDate).toISOString();

  const response = await getFinanceTransactionsPaginatedApi(
    establishmentId,
    firstDay,
    lastDay,
    pagination
  );

  return {
    success: response.status === HttpStatusEnum.Ok,
    data: response.data,
    message: response.message,
    error: response.error,
  };
}


