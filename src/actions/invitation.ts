'use server'

import { validateInvitationTokenApi, consumeInvitationApi, generateInvitationApi } from "@/back/configuration/service/invitation.api"
import { activateFreeSubscriptionApi } from "@/back/account/service/subscription.api"

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
  if (validation.error || !validation.data) {
    return {
      status: validation.status,
      message: validation.message,
      data: null,
      error: validation.error ?? validation.message
    }
  }

  const invitation = validation.data

  // 2. Ativa o plano gratuito (Alpha) por 30 dias
  const activation = await activateFreeSubscriptionApi(userId, invitation.planSlug)
  if (activation.error) {
    return {
      status: activation.status,
      message: activation.message,
      data: null,
      error: activation.error
    }
  }

  // 3. Marca o convite como consumido
  await consumeInvitationApi(invitation.id, userId)

  return {
    status: 200,
    message: "Convite VIP ativado com sucesso! Bem-vinda ao seu novo espaço digital.",
    data: {
      planSlug: invitation.planSlug,
      redirectTo: "/painel"
    },
    error: null
  }
}

export const saveInvitationCookieAction = async (token: string) => {
  const { setInvitationCookie } = await import("@/commons/lib/auth/invitation")
  await setInvitationCookie(token)
  return { status: 200, message: "Cookie de convite salvo." }
}

export const acceptInvitationRedirectAction = async (formData: FormData) => {
  const token = formData.get("token") as string
  if (token) {
    const { setInvitationCookie } = await import("@/commons/lib/auth/invitation")
    await setInvitationCookie(token)
  }
  const { redirect } = await import("next/navigation")
  redirect(`/cadastrar?convite=${token}`)
}

export const generateInvitationAction = async (params?: {

  planSlug?: string;
  recipientName?: string;
  recipientEmail?: string;
  expiresInHours?: number;
}) => {
  const { generateInvitationApi } = await import("@/back/configuration/service/invitation.api")
  const response = await generateInvitationApi(params || {})
  return {
    status: response.status,
    message: response.message,
    data: response.data ?? null,
    error: response.error ?? null,
  }
}


