import { create } from 'zustand'
import { SubscriptionPayloadCookie } from '@/commons/models/subscription'
import { MercadoPagoStatusEnum } from '@/commons/enums/subscription'

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
		if (sub.status !== MercadoPagoStatusEnum.Authorized) return false
		if (!sub.currentPeriodEnd) return true

		return new Date(sub.currentPeriodEnd).getTime() > Date.now()
	},

	isExpired: () => {
		const sub = get().subscription
		if (!sub) return false

		const status = sub.status as MercadoPagoStatusEnum

		if (
			status === MercadoPagoStatusEnum.Cancelled ||
			status === MercadoPagoStatusEnum.Paused ||
			status === MercadoPagoStatusEnum.Rejected
		) {
			return true
		}

		if (status === MercadoPagoStatusEnum.Authorized && sub.currentPeriodEnd) {
			return new Date(sub.currentPeriodEnd).getTime() <= Date.now()
		}

		return false
	},
}))