import { Profile } from "@/commons/models/user"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formatCaseName } from "@/commons/utils/format"

interface ProfileStore {
  profile: Profile | null
  luluzinha: string | null
  setProfile: (user: Profile | null) => void
  clearStore: () => void
}

const PROFILE_KEY = 'luluzinha:auth:profile';

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      luluzinha: null,

      // Salva o usuário (Zustand + LocalStorage)
      setProfile: (userData) =>
        set({
          profile: userData,
          luluzinha: userData ? formatCaseName(userData.name) : null,
        }),

      // Limpa tudo
      clearStore: () => set({ profile: null, luluzinha: null }),
    }),
    {
      name: PROFILE_KEY, // Nome da chave no localStorage
    }
  )
)