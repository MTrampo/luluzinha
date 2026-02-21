import { HttpStatusEnum } from "@/commons/enums/http";
import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastConfig {
  type: ToastType;
  defaultMessage: string;
}

const statusToastMap: Record<HttpStatusEnum, ToastConfig> = {
  [HttpStatusEnum.Ok]: {
    type: "success",
    defaultMessage: "Operação realizada com sucesso",
  },
  [HttpStatusEnum.Created]: {
    type: "success",
    defaultMessage: "Criado com sucesso",
  },
  [HttpStatusEnum.Accepted]: {
    type: "info",
    defaultMessage: "Solicitação aceita",
  },
  [HttpStatusEnum.NoContent]: {
    type: "success",
    defaultMessage: "Operação realizada com sucesso",
  },
  [HttpStatusEnum.BadRequest]: {
    type: "error",
    defaultMessage: "Dados inválidos",
  },
  [HttpStatusEnum.Unauthorized]: {
    type: "error",
    defaultMessage: "Não autorizado",
  },
  [HttpStatusEnum.Forbidden]: {
    type: "error",
    defaultMessage: "Acesso negado",
  },
  [HttpStatusEnum.NotFound]: {
    type: "error",
    defaultMessage: "Não encontrado",
  },
  [HttpStatusEnum.Conflict]: {
    type: "warning",
    defaultMessage: "Conflito na operação",
  },
  [HttpStatusEnum.InternalServerError]: {
    type: "error",
    defaultMessage: "Erro interno no servidor",
  },
};

export function handleToast(
  status: HttpStatusEnum,
  message?: string,
  loadingId?: string | number
): void {
  const toastConfig = statusToastMap[status];
  if (!toastConfig) return;

  const toastMessage = message || toastConfig.defaultMessage;
  const toastOptions = loadingId ? { id: loadingId } : {};

  toast[toastConfig.type](toastMessage, toastOptions);
}

export function loadingToast(message: string = "Processando..."): string | number {
  return toast.loading(message);
}

export function updateToast(
  toastId: string | number,
  status: HttpStatusEnum,
  message?: string
): void {
  const toastConfig = statusToastMap[status];
  if (!toastConfig) return;

  const toastMessage = message || toastConfig.defaultMessage;

  toast[toastConfig.type](toastMessage, { id: toastId });
}
