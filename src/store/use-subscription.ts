import { create } from 'zustand'
import type { SubscriptionPayloadCookie } from '@/commons/models/subscription'

interface SubscriptionStore {
  subscription: SubscriptionPayloadCookie | null
  setSubscription: (subscription: SubscriptionPayloadCookie | null) => void
  clearStore: () => void
}

export const useSubscriptionStore = create<SubscriptionStore>()((set) => ({
  subscription: null,
  setSubscription: (subscription) => set({ subscription }),
  clearStore: () => set({ subscription: null }),
}))
