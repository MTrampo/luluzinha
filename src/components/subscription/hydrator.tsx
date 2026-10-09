'use client'

import { useEffect, useCallback } from "react"
import { manageSubscriptionEndpointAction, refreshSubscriptionAction } from "@/actions/subscription"
import { useProfileStore } from "@/store/use-profile"
import { useSubscriptionStore } from "@/store/use-subscription"
import { isSubscriptionActive } from "@/commons/lib/http/security"
import { ExpiredDialog } from "../dialogs/subscription/expired"

export function SubscriptionHydrator() {
  const luluzinha = useProfileStore((state) => state.luluzinha)
  const subscription = useSubscriptionStore((state) => state.subscription)
  const setSubscription = useSubscriptionStore((state) => state.setSubscription)

  const hydrateSubscription = useCallback(async () => {
    try {
      let response = await manageSubscriptionEndpointAction()
      if (response?.data) {
        if (!isSubscriptionActive(response.data)) {
          const refreshResponse = await refreshSubscriptionAction()
          if (refreshResponse?.data) {
            response = refreshResponse
          }
        }
        setSubscription(response.data)
      }
    } catch (error) {
      console.error("Failed to hydrate subscription", error)
    }
  }, [setSubscription])

  useEffect(() => {
    hydrateSubscription()
  }, [hydrateSubscription])

  const isExpired = subscription ? !isSubscriptionActive(subscription) : false

  if (!subscription || !isExpired) return null

  return <ExpiredDialog name={luluzinha} open={isExpired} />
}
