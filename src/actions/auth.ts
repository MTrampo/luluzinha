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

export const signUpUserAction = async (input: UserSignUpFormInputs) => {
  const response = await signUpUserApi({
    ...input,
    name: input.email.split('@')[0],
  })
  return response
}

export const verifyOtpCodeAction = async (email: string, code: string) => {
  const response = await confirmUserEmailApi(email, code)

  if (response.status === HttpStatusEnum.Ok && response.data?.user) {
    const userId = response.data.user.id

    // 1. Criar perfil provisório
    await createProfileApi(userId, "Manicure Luluzinha", "avatar-1")

    // 2. Criar estabelecimento provisório
    const tempSlug = `bancada-temp-${userId.substring(0, 8)}`
    await createEstablishmentApi(userId, {
      name: "Minha Bancada",
      slug: tempSlug,
      avatar_url: "FaPaintbrush",
      phone: null,
      address: null
    })
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