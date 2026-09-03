'use server'

import {
  createCheckoutSessionApi,
  manageUserSubscriptionApi,
  associateSubscriptionPayerEmailApi,
  refreshSubscriptionApi,
  getUserSubscriptionDetailsApi,
  cancelSubscriptionApi,
  syncSubscriptionStatusApi,
  getEstablishmentInvoicesApi
} from "@/back/account/service/subscription.api"
import { listActivePlansApi, getPlanConfigBySlugApi } from "@/back/configuration/service/plan.api"

export const getSubscriptionEndpointAction = async (mpPayerEmail: string, planSlug: string) => {
  const response = await createCheckoutSessionApi(mpPayerEmail, planSlug)
  return response
}

export const getActivePlansAction = async () => {
  const response = await listActivePlansApi()
  return {
    status: response.status,
    message: response.message,
    data: response.data || [],
    error: response.error
  }
}

export const getPlanConfigBySlugAction = async (slug: string) => {
  const response = await getPlanConfigBySlugApi(slug)
  return {
    status: response.status,
    message: response.message,
    data: response.data,
    error: response.error
  }
}


export const manageSubscriptionEndpointAction = async () => {
  const response = await manageUserSubscriptionApi()
  return response
}

export const refreshSubscriptionAction = async () => {
  const response = await refreshSubscriptionApi()
  return response
}

export const linkSubscriptionEmailAction = async (userId: string, mpPayerEmail: string) => {
  const response = await associateSubscriptionPayerEmailApi(userId, mpPayerEmail)
  return response
}

export const getUserSubscriptionAction = async () => {
  const response = await getUserSubscriptionDetailsApi()
  return {
    status: response.status,
    message: response.message,
    data: response.data,
    error: response.error
  }
}

export const cancelSubscriptionAction = async () => {
  const response = await cancelSubscriptionApi()
  return {
    status: response.status,
    message: response.message,
    data: response.data,
    error: response.error
  }
}

export const syncSubscriptionStatusAction = async () => {
  const response = await syncSubscriptionStatusApi()
  return {
    status: response.status,
    message: response.message,
    data: response.data,
    error: response.error
  }
}

export const getInvoicesAction = async () => {
  const response = await getEstablishmentInvoicesApi()
  return {
    status: response.status,
    message: response.message,
    data: response.data,
    error: response.error
  }
}