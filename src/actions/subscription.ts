'use server'

import { createCheckoutSessionApi, manageUserSubscriptionApi, associateSubscriptionPayerEmailApi, refreshSubscriptionApi } from "@/back/account/service/subscription.api"

export const getSubscriptionEndpointAction = async (mpPayerEmail: string) => {
  const response = await createCheckoutSessionApi(mpPayerEmail)
  return response
}

export const manageSubscriptionEndpointAction = async (userId: string) => {
  const response = await manageUserSubscriptionApi(userId)
  return response
}

export const refreshSubscriptionAction = async (userId: string) => {
  const response = await refreshSubscriptionApi(userId)
  return response
}

export const linkSubscriptionEmailAction = async (userId: string, mpPayerEmail: string) => {
  const response = await associateSubscriptionPayerEmailApi(userId, mpPayerEmail)
  return response
}