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

export const getSubscriptionEndpointAction = async (mpPayerEmail: string) => {
  const response = await createCheckoutSessionApi(mpPayerEmail)
  return response
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