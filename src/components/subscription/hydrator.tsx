'use client'

import { useEffect } from "react"
import { refreshSubscriptionAction } from "@/actions/subscription"
import { useProfileStore } from "@/store/use-profile"
import { useSubscriptionStore } from "@/store/use-subscription"

export function SubscriptionHydrator() {
  const userId = useProfileStore((state) => state.profile?.id)
  const setSubscription = useSubscriptionStore((state) => state.setSubscription)

  useEffect(() => {
    if (!userId) return

    refreshSubscriptionAction(userId).then((response) => {
      if (response.data) {
        setSubscription(response.data)
      }
    })
  }, [userId, setSubscription])

  return null
}
