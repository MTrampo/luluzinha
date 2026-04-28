'use client'

import { useEffect, useCallback } from "react"
import { manageSubscriptionEndpointAction, refreshSubscriptionAction } from "@/actions/subscription"
import { useProfileStore } from "@/store/use-profile"
import { useSubscriptionStore } from "@/store/use-subscription"
import { ExpiredDialog } from "../dialogs/subscription/expired"

export function SubscriptionHydrator() {
  const luluzinha = useProfileStore((state) => state.luluzinha)
  const userId = useProfileStore((state) => state.profile?.id)
  const setSubscription = useSubscriptionStore((state) => state.setSubscription)

  const hydrateSubscription = useCallback(async (uid: string) => {
    try {
      const response = await manageSubscriptionEndpointAction(uid)
      if (response?.data) {
        setSubscription(response.data)
      }
    } catch (error) {
      console.error("Failed to hydrate subscription", error)
    }
  }, [setSubscription])

  const refreshExpiredSubscription = useCallback(async (uid: string) => {
    try {
      const response = await refreshSubscriptionAction(uid)
      if (response?.data) {
        setSubscription(response.data)
      }
    } catch (error) {
      console.error("Failed to refresh subscription", error)
    }
  }, [setSubscription])

  useEffect(() => {
    if (!userId) return

    const store = useSubscriptionStore.getState()
    const current = store.subscription

    if (!current) {
      hydrateSubscription(userId)
      return
    }

    if (store.isExpired()) {
      refreshExpiredSubscription(userId)
    }
  }, [hydrateSubscription, refreshExpiredSubscription, userId])

  const open = useSubscriptionStore((state) => !!state.subscription && state.isExpired() && !state.dismissed)
  if (!open) return null

  return <ExpiredDialog name={luluzinha} open={open} />
}
