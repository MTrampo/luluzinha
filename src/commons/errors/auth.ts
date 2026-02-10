import { AuthErrorCode } from "../enums/auth";
import { HttpStatusEnum } from "../enums/http";

interface ErrorDetail {
  message: string;
  status: HttpStatusEnum;
}

export const AuthErrorMap: Record<string, ErrorDetail> = {
  [AuthErrorCode.UserAlreadyExists]: {
    message: "Este e-mail já está cadastrado.",
    status: HttpStatusEnum.Conflict,
  },
  [AuthErrorCode.WeakPassword]: {
    message: "A senha fornecida é muito fraca.",
    status: HttpStatusEnum.BadRequest,
  },
  [AuthErrorCode.OverEmailSendRateLimit]: {
    message: "Muitas solicitações enviadas. Aguarde um momento.",
    status: HttpStatusEnum.BadRequest,
  },
  [AuthErrorCode.SignupDisabled]: {
    message: "O cadastro de novos usuários está desativado no momento.",
    status: HttpStatusEnum.Forbidden,
  },
  [AuthErrorCode.InvalidCredentials]: {
    message: "E-mail ou senha incorretos.",
    status: HttpStatusEnum.Unauthorized,
  },
  // ...
};

export function resolveAuthError(code?: string): ErrorDetail {
  if (code && AuthErrorMap[code]) {
    return AuthErrorMap[code];
  }

  // Fallback Genérico para códigos não mapeados ou erros inesperados
  return {
    message: "Ocorreu um erro inesperado no serviço de autenticação.",
    status: HttpStatusEnum.InternalServerError,
  };
}