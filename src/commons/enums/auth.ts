export enum AuthErrorCode {
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
  
  // Geral/Sessão
  UnexpectedFailure = "unexpected_failure",
  ValidationFailed = "validation_failed",
}