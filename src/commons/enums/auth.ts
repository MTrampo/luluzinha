export enum AuthErrorCodeEnum {
  // Cadastro e Confirmação
  UserAlreadyExists = "user_already_exists",
  SignupDisabled = "signup_disabled",
  WeakPassword = "weak_password",
  OverEmailSendRateLimit = "over_email_send_rate_limit",
  EmailNotConfirmed = "email_not_confirmed",
  
  // Login e Credenciais
  InvalidCredentials = "invalid_credentials",
  InvalidGrant = "invalid_grant",
  UserNotFound = "user_not_found",
  // Erros do Auth / Supabase comuns
  SamePassword = "same_password",
  InvalidPassword = "invalid_password",
  TokenExpired = "token_expired",
  InvalidConfirmationToken = "invalid_confirmation_token",
  
  // Geral/Sessão
  UnexpectedFailure = "unexpected_failure",
  ValidationFailed = "validation_failed",

  // Timeout e Rede
  UndErrConnectTimeout = "UND_ERR_CONNECT_TIMEOUT",
}