'use server'

import { confirmUserEmailApi, getUserLoggedApi, resetUserPasswordApi, sendPasswordResetEmailApi, signInUserApi, signOutApi, signUpUserApi } from "@/back/account/service/auth.api";
import { HttpStatusEnum } from "@/commons/enums/http";
import { ForgotPasswordFormInputs, UserSignInFormInputs, UserSignUpFormInputs } from "@/commons/models/user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const signInUserAction = async (input: UserSignInFormInputs) => {
  const response = await signInUserApi(input)
  return response
}

export const signUpUserAction = async (input: UserSignUpFormInputs) => {
  const response = await signUpUserApi(input)
  return response
}

export const verifyOtpCodeAction = async (email: string, code: string) => {
  const response = await confirmUserEmailApi(email, code)
  return response
}

export const signOutAction = async () => {
  const response = await signOutApi()
  if (response.status === HttpStatusEnum.Ok) {
    revalidatePath('/', 'layout')
    redirect('/')
  }
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