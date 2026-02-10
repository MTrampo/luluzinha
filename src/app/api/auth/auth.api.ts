import { UserRequestBody } from "@/commons/models/user";
import { createAuthSupabase, createProfileSupabase } from "./auth.supabase";
import { resolveAuthError } from "@/commons/errors/auth";
import { ApiResponse } from "@/commons/lib/http/responses";

export const signUpUserApi = async (body: UserRequestBody) => {
  const { data: dataAuth, error: errorAuth } = await createAuthSupabase(body)

  if (errorAuth) {
    const { message, status } = resolveAuthError(errorAuth.code);
    const response = {
      status,
      message,
      data: null,
      error: errorAuth.message
    };

    return response;
  }

  const userId = dataAuth?.user?.id;
  if (!userId) {
    return ApiResponse.InternalError({
      message: "Erro inesperado ao criar usuário.",
      error: "Usuário autenticado, mas ID do usuário não encontrado."
    });
  }

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