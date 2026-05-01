"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { manageSubscriptionEndpointAction, refreshSubscriptionAction } from "@/actions/subscription"
import { isSubscriptionActive } from "@/commons/lib/http/security"

export function SubscriptionGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  const ensureSubscription = useCallback(async () => {
    try {
      let response = await manageSubscriptionEndpointAction()

      if (response?.data && !isSubscriptionActive(response.data)) {
        const refreshResponse = await refreshSubscriptionAction()
        if (refreshResponse?.data) {
          response = refreshResponse
        }
      }

      if (response?.data) {
        const isActive = isSubscriptionActive(response.data)

        if (pathname === '/assinatura' && isActive) {
          router.replace('/painel')
        }
      }
    } catch (error) {
      console.error("Failed to ensure subscription", error)
    } finally {
      setChecked(true)
    }
  }, [router, pathname])

  useEffect(() => {
    if (pathname === '/assinatura' && !checked) {
      ensureSubscription()
    }
  }, [ensureSubscription, pathname, checked])

  return null
}