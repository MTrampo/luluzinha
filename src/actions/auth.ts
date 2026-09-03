'use server'

import { confirmUserEmailApi, getUserLoggedApi, resetUserPasswordApi, sendPasswordResetEmailApi, signInUserApi, signOutApi, signUpUserApi, createProfileApi } from "@/back/account/service/auth.api";
import { HttpStatusEnum } from "@/commons/enums/http";
import { ForgotPasswordFormInputs, UserSignInFormInputs, UserSignUpFormInputs } from "@/commons/models/user";
import { revalidatePath } from "next/cache";
import { createEstablishmentApi } from "@/back/account/service/establishment.api";

export const signInUserAction = async (input: UserSignInFormInputs) => {
  const response = await signInUserApi(input)
  return response
}

export const signUpUserAction = async (input: UserSignUpFormInputs, invitationToken?: string) => {
  // Durante a fase Alpha Fechada, cadastros são restritos a convidadas com token válido
  if (!invitationToken) {
    return {
      status: HttpStatusEnum.Forbidden,
      message: "No momento, o cadastro na Luluzinha é restrito a convidadas na fase Alpha Fechada.",
      data: null
    }
  }

  const { validateInvitationTokenApi } = await import("@/back/configuration/service/invitation.api");
  const invitationRes = await validateInvitationTokenApi(invitationToken);

  if (invitationRes.status !== HttpStatusEnum.Ok || !invitationRes.data) {
    return {
      status: HttpStatusEnum.Forbidden,
      message: invitationRes.message || "Convite inválido ou expirado.",
      data: null
    }
  }

  const response = await signUpUserApi({
    ...input,
    name: input.email.split('@')[0],
  })
  return response
}


export const verifyOtpCodeAction = async (email: string, code: string, invitationToken?: string) => {
  const response = await confirmUserEmailApi(email, code)

  if (response.status === HttpStatusEnum.Ok && response.data?.user) {
    const userId = response.data.user.id

    // 1. Criar perfil provisório
    await createProfileApi(userId, "Manicure Luluzinha", "avatar-1")

    // 2. Criar estabelecimento provisório
    const tempSlug = `espaco-temp-${userId.substring(0, 8)}`
    await createEstablishmentApi(userId, {
      name: "Meu Espaço",
      slug: tempSlug,
      avatar_url: "FaPaintbrush",
      phone: null,
      address: null
    })

    // 3. Se houver token de convite, ativa a assinatura gratuita e consome o convite
    if (invitationToken) {
      try {
        const { activateInvitationAction } = await import("@/actions/invitation")
        await activateInvitationAction(userId, invitationToken)
        const { clearInvitationCookie } = await import("@/commons/lib/auth/invitation")
        await clearInvitationCookie()
      } catch (err) {
        console.error("Erro ao ativar convite após verificação de OTP:", err)
      }
    }
  }

  return response
}



export const signOutAction = async () => {
  const response = await signOutApi()
  return response
}

export const sendForgotPasswordEmailAction = async (email: string) => {
  const response = await sendPasswordResetEmailApi(email)
  return response
}

export const resetPasswordAction = async (email: string, input: ForgotPasswordFormInputs) => {
  const requestBody = {
    email,
    code: input.code,
    password: input.password,
  }

  const response = await resetUserPasswordApi(requestBody)
  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/', 'layout')
  }

  return response
}

export const getUserLoggedAction = async () => {
  const response = await getUserLoggedApi()
  return response
}

export const createProfileUserAction = async (name: string, avatarUrl?: string | null) => {
  const userResult = await getUserLoggedApi()
  const userId = userResult.data?.user?.id
  if (!userId) {
    return {
      status: 401,
      message: "Usuário não autenticado.",
      data: null
    }
  }

  const response = await createProfileApi(userId, name, avatarUrl)
  return response
}