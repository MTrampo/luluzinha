import { ResetPasswordRequestBody, SignInRequestBody, UserRequestBody } from "@/commons/models/user";
import { confirmCodePasswordReset, createAuthSupabase, createProfileSupabase, getUserLogged, killAuthSupabase, sendPasswordResetEmail, signInWithEmail, updatePassword, verifyCode } from "../repository/auth.supabase";
import { resolveAuthError } from "@/commons/errors/auth";
import { ApiResponse } from "@/commons/lib/http/responses";

export const signInUserApi = async (body: SignInRequestBody) => {
  const { data, error } = await signInWithEmail(body.email, body.password)
  console.log('data:', data) // Log para depuração
  console.log('error:', error) // Log para depuração

  if (error) {
    const { message, status } = resolveAuthError(error.code);
    const response = {
      status,
      message,
      data: null,
      error: error.message
    };
    
    return response;
  }

  return ApiResponse.Ok({
    message: "Login realizado com sucesso.",
    data: data
  });
}

export const signUpUserApi = async (body: UserRequestBody) => {
  const { data, error } = await createAuthSupabase(body)

  if (error) {
    const { message, status } = resolveAuthError(error.code);
    const response = {
      status,
      message,
      data: null,
      error: error.message
    };

    return response;
  }

  const userId = data?.user?.id;
  if (!userId) {
    return ApiResponse.InternalError({
      message: "Erro inesperado ao criar usuário.",
      error: "Usuário autenticado, mas ID do usuário não encontrado."
    });
  }

  //await createProfileApi(userId, body);

  return ApiResponse.Ok({
    message: `E-mail de confirmação enviado para ${body.email}`,
    data: data
  });
}

export const signOutApi = async () => {
  const error = await killAuthSupabase()
  
  if (error) {
    return ApiResponse.InternalError({
      message: "Erro ao deslogar usuário.",
      error: error.message,
    });
  }

  return ApiResponse.Ok({
    message: "Usuário deslogado com sucesso.",
    data: null
  });
}

export const sendPasswordResetEmailApi = async (email: string) => {
  const { data, error } = await sendPasswordResetEmail(email)

  if (error) {
    const { message, status } = resolveAuthError(error.code);
    const response = {
      status,
      message,
      data: null,
      error: error.message
    };
    
    return response;
  }

  return ApiResponse.Ok({
    message: `E-mail de recuperação enviado para ${email} (se a conta existir).`,
    data: data
  });
}

export const createProfileApi = async (userId: string, body: UserRequestBody) => {
  const { data: profileData, error: profileError } = await createProfileSupabase(userId, body)
  if (profileError) {
    return ApiResponse.InternalError({
      message: "Usuário autenticado, mas falha ao criar perfil no banco.",
      error: profileError.message,
    });
  }

  return ApiResponse.Ok({
    message: "Usuário criado com sucesso.",
    data: profileData
  })
}

export const confirmUserEmailApi = async (email: string, code: string) => {
  const { data, error } = await verifyCode(email, code)
  if (error) {
    return ApiResponse.Unauthorized({
      message: "Erro ao confirmar e-mail do usuário.",
      error: error.message
    });
  }

  const userName = data?.user?.user_metadata?.display_name || email;

  return ApiResponse.Ok({
    message: `Bem-vindo(a) a Luluzinha, ${userName}! Seu e-mail foi confirmado com sucesso.`,
    data: data
  });
}

export const resetUserPasswordApi = async (body: ResetPasswordRequestBody) => {
  const { error } = await confirmCodePasswordReset(body.email, body.code)
  if (error) {
    console.error("Erro ao confirmar código de recuperação:", error);
    const { message, status } = resolveAuthError(error.code);
    const response = {
      status,
      message,
      data: null,
      error: error.message
    };
    
    return response;
  }

  const { data, error: updateError } = await updatePassword(body.password)
  if (updateError) {
    const { message, status } = resolveAuthError(updateError.code)
    const response = {
      status,
      message,
      data: null,
      error: updateError,
    }

    return response
  }

  return ApiResponse.Ok({
    message: `${data.user?.user_metadata.display_name || 'Luluzinha'}, sua senha foi redefinida com sucesso! Você já pode entrar com a nova senha.`,
    data: data
  });
}

export const getUserLoggedApi = async () => {
  const { data, error } = await getUserLogged()
  if (error) {
    return ApiResponse.InternalError({
      message: "Não identificado, faça login novamente.",
      error: error.message
    });
  }

  return ApiResponse.Ok({
    message: "Dados do usuário logado obtidos com sucesso.",
    data: data
  });
}