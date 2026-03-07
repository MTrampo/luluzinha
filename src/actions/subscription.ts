'use server'

import { createCheckoutSessionApi } from "@/back/account/service/subscription.api"

export const getSubscriptionEndpointAction = async () => {
  const response = await createCheckoutSessionApi()
  return response
}