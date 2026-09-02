import { ResetPasswordRequestBody, SignInRequestBody, UserRequestBody } from "@/commons/models/user";
import { confirmCodePasswordReset, createAuthSupabase, createProfileSupabase, getUserLogged, killAuthSupabase, sendPasswordResetEmail, signInWithEmail, updatePassword, verifyCode, getProfileByUserIdSupabase } from "../repository/auth.supabase";
import { resolveAuthError } from "@/commons/errors/auth";
import { ApiResponse } from "@/commons/lib/http/responses";
import { getEstablishmentsByOwnerIdAuthSupabase } from "../repository/establishment.supabase";
import { getSubscriptionIdByUserIdAuthSupabase } from "../repository/subscription.supabase";
import { MercadoPagoStatusEnum } from "@/commons/enums/subscription";
import { SubscriptionPayloadCookie } from "@/commons/models/subscription";
import { establishmentsFormatter } from "@/commons/models/establishment";
import { clearCookieSubscription, setCookieSubscription } from "@/commons/lib/auth/subscription";
import { clearEstablishmentCookie } from "@/commons/lib/auth/establishment";

export const signInUserApi = async (body: SignInRequestBody) => {
  const { data, error } = await signInWithEmail(body.email, body.password)

  if (error) {
    const { message, status } = resolveAuthError(error.code);
    return {
      status,
      message,
      data: null,
      error: error.message
    };
  }

  if (!data.user || !data.session) {
    return ApiResponse.Unauthorized({
      message: "Falha na autenticação.",
      error: "Sessão ou usuário não retornados."
    });
  }

  const userId = data.user.id;
  const token = data.session.access_token;

  // Buscar estabelecimentos vinculados (Usando o cliente com RLS do usuário via Token)
  const { data: establishments } = await getEstablishmentsByOwnerIdAuthSupabase(userId, token);

  // Buscar dados da assinatura (Usando o cliente com RLS do usuário via Token)
  const subscription = await getSubscriptionIdByUserIdAuthSupabase(userId, token);

  // Buscar perfil da manicure
  const { data: profile } = await getProfileByUserIdSupabase(userId);

  // Definir o caminho de redirecionamento recomendado
  let redirectPath = '/assinatura';
  let subscriptionPayload: SubscriptionPayloadCookie | null = null;

  if (subscription) {
    subscriptionPayload = {
      subscriptionId: subscription.id,
      status: subscription.mp_status,
      currentPeriodEnd: subscription.current_period_end
    };

    // Se estiver autorizado, manda para o painel
    if (subscription.mp_status === MercadoPagoStatusEnum.Authorized) {
      redirectPath = '/painel';
    }

    // Salva o cookie de assinatura já no servidor para o Middleware enxergar no próximo request
    await setCookieSubscription(JSON.stringify(subscriptionPayload));
  }

  return ApiResponse.Ok({
    message: "Login realizado com sucesso.",
    data: {
      ...data,
      establishments: establishmentsFormatter(establishments),
      subscription: subscriptionPayload,
      profile: profile || null,
      redirectPath
    }
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

  return ApiResponse.Ok({
    message: `E-mail de confirmação enviado para ${body.email}`,
    data: data
  });
}

export const signOutApi = async () => {
  const error = await killAuthSupabase()

  if (error) {
    console.warn(`[signOutApi] Erro ao deslogar no Supabase (prosseguindo com limpeza local):`, error.message)
  }

  await clearCookieSubscription()
  await clearEstablishmentCookie()

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

export const createProfileApi = async (userId: string, name: string, avatarUrl?: string | null) => {
  const { data: profileData, error: profileError } = await createProfileSupabase(userId, name, avatarUrl)
  if (profileError) {
    return ApiResponse.InternalError({
      message: "Falha ao criar o perfil da manicure.",
      error: profileError.message,
    });
  }

  return ApiResponse.Ok({
    message: "Perfil criado com sucesso.",
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
    const { message, status } = resolveAuthError(updateError.code);
    const response = {
      status,
      message,
      data: null,
      error: updateError.message
    };

    return response;
  }

  return ApiResponse.Ok({
    message: "Senha alterada com sucesso.",
    data: data
  });
}

export const getUserLoggedApi = async () => {
  const { data, error } = await getUserLogged()

  if (error) {
    return ApiResponse.Unauthorized({
      message: "Erro ao buscar usuário logado.",
      error: error.message,
    });
  }

  return ApiResponse.Ok({
    message: "Usuário buscado com sucesso.",
    data: data
  });
}