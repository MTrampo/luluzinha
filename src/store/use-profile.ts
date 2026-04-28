import { Profile } from "@/commons/models/user"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formatCaseName } from "@/commons/utils/format"

interface ProfileStore {
  profile: Profile | null
  luluzinha: string
  setProfile: (user: Profile | null) => void
  clearStore: () => void
}

const PROFILE_KEY = 'luluzinha:auth:profile';
const DEFAULT_NAME = "Luluzinha"

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      luluzinha: DEFAULT_NAME,

      // Salva o usuário (Zustand + LocalStorage)
      setProfile: (userData) =>
        set({
          profile: userData,
          luluzinha: userData ? formatCaseName(userData.name) : DEFAULT_NAME,
        }),

      // Limpa tudo
      clearStore: () => set({ profile: null, luluzinha: DEFAULT_NAME }),
    }),
    {
      name: PROFILE_KEY, // Nome da chave no localStorage
    }
  )
)