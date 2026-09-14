'use server'

import { redirect } from "next/navigation"
import { validateInvitationTokenApi, consumeInvitationApi, generateInvitationApi } from "@/back/configuration/service/invitation.api"
import { activateFreeSubscriptionApi } from "@/back/account/service/subscription.api"
import { setInvitationCookie } from "@/commons/lib/auth/invitation"

export const validateInvitationAction = async (token: string) => {
  const response = await validateInvitationTokenApi(token)
  return {
    status: response.status,
    message: response.message,
    data: response.data ?? null,
    error: response.error ?? null,
  }
}

export const activateInvitationAction = async (userId: string, token: string) => {
  // 1. Valida o token
  const validation = await validateInvitationTokenApi(token)
  const planSlug = validation.data?.planSlug || 'alpha-parceira'

  // 2. Ativa o plano gratuito (Alpha) por 30 dias
  const activation = await activateFreeSubscriptionApi(userId, planSlug)

  // 3. Se o convite for válido, marca como consumido
  if (validation.data?.id) {
    await consumeInvitationApi(validation.data.id, userId)
  }

  if (activation.error) {
    return {
      status: activation.status,
      message: activation.message,
      data: null,
      error: activation.error
    }
  }

  return {
    status: 200,
    message: "Convite VIP ativado com sucesso! Bem-vinda ao seu novo espaço digital.",
    data: {
      planSlug,
      redirectTo: "/painel"
    },
    error: null
  }
}

export const saveInvitationCookieAction = async (token: string) => {
  await setInvitationCookie(token)
  return { status: 200, message: "Cookie de convite salvo." }
}

export const acceptInvitationRedirectAction = async (formData: FormData) => {
  const token = formData.get("token") as string
  if (token) {
    await setInvitationCookie(token)
  }
  redirect(`/cadastrar?convite=${token}`)
}

export const generateInvitationAction = async (params?: {
  planSlug?: string;
  recipientName?: string;
  recipientEmail?: string;
  expiresInHours?: number;
}) => {
  const response = await generateInvitationApi(params || {})
  return {
    status: response.status,
    message: response.message,
    data: response.data ?? null,
    error: response.error ?? null,
  }
}



