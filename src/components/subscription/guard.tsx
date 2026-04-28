"use client"

import { useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { manageSubscriptionEndpointAction, refreshSubscriptionAction } from "@/actions/subscription"
import { useProfileStore } from "@/store/use-profile"
import { useSubscriptionStore } from "@/store/use-subscription"
import { isSubscriptionActive } from "@/commons/lib/http/security"

export function SubscriptionGuard() {
  const userId = useProfileStore((state) => state.profile?.id)
  const setSubscription = useSubscriptionStore((state) => state.setSubscription)
  const router = useRouter()
  const pathname = usePathname()

  const ensureSubscription = useCallback(async (uid: string) => {
    try {
      let response = await manageSubscriptionEndpointAction(uid)

      if (response?.data && !isSubscriptionActive(response.data)) {
        const refreshResponse = await refreshSubscriptionAction(uid)
        if (refreshResponse?.data) {
          response = refreshResponse
        }
      }

      if (response?.data) {
        setSubscription(response.data)

        const isActive = isSubscriptionActive(response.data)

        if (pathname === '/assinatura' && isActive) {
          router.replace('/painel')
        }
      }
    } catch (error) {
      console.error("Failed to ensure subscription", error)
    }
  }, [setSubscription, router, pathname])

  useEffect(() => {
    if (!userId) return

    const store = useSubscriptionStore.getState()
    const current = store.subscription

    if (current) {
      const isActive = store.isActive()
      if (isActive && pathname === '/assinatura') {
        router.replace('/painel')
        return
      }

      if (!isActive && pathname === '/assinatura') {
        ensureSubscription(userId)
      }
      return
    }

    ensureSubscription(userId)
  }, [ensureSubscription, userId, pathname, router])

  return null
}