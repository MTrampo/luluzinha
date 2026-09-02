import { AuthErrorCodeEnum } from "../enums/auth";
import { HttpStatusEnum } from "../enums/http";

interface ErrorDetail {
  message: string;
  status: HttpStatusEnum;
}

export const AuthErrorMap: Record<string, ErrorDetail> = {
  [AuthErrorCodeEnum.UserAlreadyExists]: {
    message: "Este e-mail já está cadastrado.",
    status: HttpStatusEnum.Conflict,
  },
  [AuthErrorCodeEnum.WeakPassword]: {
    message: "A senha fornecida é muito fraca.",
    status: HttpStatusEnum.BadRequest,
  },
  [AuthErrorCodeEnum.OverEmailSendRateLimit]: {
    message: "Acesso temporariamente bloqueado.Muitas solicitações de e-mail enviadas.",
    status: HttpStatusEnum.Forbidden,
  },
  [AuthErrorCodeEnum.SignupDisabled]: {
    message: "O cadastro de novos usuários está desativado no momento.",
    status: HttpStatusEnum.Forbidden,
  },
  [AuthErrorCodeEnum.InvalidCredentials]: {
    message: "E-mail ou senha incorretos.",
    status: HttpStatusEnum.Unauthorized,
  },
  [AuthErrorCodeEnum.SamePassword]: {
    message: "A nova senha deve ser diferente da anterior.",
    status: HttpStatusEnum.UnprocessableEntity,
  },
  [AuthErrorCodeEnum.InvalidPassword]: {
    message: "Senha inválida ou não atende aos requisitos mínimos de segurança.",
    status: HttpStatusEnum.BadRequest,
  },
  [AuthErrorCodeEnum.UserNotFound]: {
    message: "Luluzinha não encontrada.",
    status: HttpStatusEnum.NotFound,
  },
  [AuthErrorCodeEnum.InvalidConfirmationToken]: {
    message: "Código de confirmação inválido.",
    status: HttpStatusEnum.BadRequest,
  },
  [AuthErrorCodeEnum.TokenExpired]: {
    message: "O token expirou.",
    status: HttpStatusEnum.BadRequest,
  },
  [AuthErrorCodeEnum.RefreshTokenNotFound]: {
    message: "Sua sessão expirou por segurança. Por favor, acesse seu espaço novamente.",
    status: HttpStatusEnum.Unauthorized,
  },
  [AuthErrorCodeEnum.InvalidGrant]: {
    message: "Sua credencial de acesso é inválida ou expirou. Por favor, acesse seu espaço novamente.",
    status: HttpStatusEnum.Unauthorized,
  },

  [AuthErrorCodeEnum.UndErrConnectTimeout]: {
    message: "Sobrecarga de conexão. Por favor, tente novamente mais tarde.",
    status: HttpStatusEnum.InternalServerError,
  },
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