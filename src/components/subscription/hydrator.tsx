'use client'

import { useEffect, useCallback, useState } from "react"
import { manageSubscriptionEndpointAction, refreshSubscriptionAction } from "@/actions/subscription"
import { useProfileStore } from "@/store/use-profile"
import { isSubscriptionActive } from "@/commons/lib/http/security"
import { ExpiredDialog } from "../dialogs/subscription/expired"
import { SubscriptionPayloadCookie } from "@/commons/models/subscription"

export function SubscriptionHydrator() {
  const luluzinha = useProfileStore((state) => state.luluzinha)
  const [subscription, setSubscription] = useState<SubscriptionPayloadCookie | null>(null)
  const [dismissed, setDismissed] = useState(false)

  const hydrateSubscription = useCallback(async () => {
    try {
      const response = await manageSubscriptionEndpointAction()
      if (response?.data) {
        setSubscription(response.data)

        if (!isSubscriptionActive(response.data)) {
          const refreshResponse = await refreshSubscriptionAction()
          if (refreshResponse?.data) {
            setSubscription(refreshResponse.data)
          }
        }
      }
    } catch (error) {
      console.error("Failed to hydrate subscription", error)
    }
  }, [])

  useEffect(() => {
    hydrateSubscription()
  }, [hydrateSubscription])

  const isExpired = subscription ? !isSubscriptionActive(subscription) : false
  const open = !!subscription && isExpired && !dismissed

  if (!open) return null

  return <ExpiredDialog name={luluzinha} open={open} onDismiss={() => setDismissed(true)} />
}
