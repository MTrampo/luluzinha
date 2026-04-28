import { create } from 'zustand'
import { SubscriptionPayloadCookie } from '@/commons/models/subscription'
import { isSubscriptionActive } from '@/commons/lib/http/security'

interface SubscriptionStore {
	subscription: SubscriptionPayloadCookie | null
	dismissed: boolean
	setSubscription: (s: SubscriptionPayloadCookie | null) => void
	clear: () => void
	dismiss: () => void
	isActive: () => boolean
	isExpired: () => boolean
}

export const useSubscriptionStore = create<SubscriptionStore>()((set, get) => ({
	subscription: null,
	dismissed: false,

	setSubscription: (s) => set({ subscription: s, dismissed: false }),

	clear: () => set({ subscription: null, dismissed: false }),

	dismiss: () => set({ dismissed: true }),

	isActive: () => {
		const sub = get().subscription
		if (!sub) return false
		return isSubscriptionActive(sub)
	},

	isExpired: () => {
		const sub = get().subscription
		if (!sub) return false
		return !isSubscriptionActive(sub)
	},
}))