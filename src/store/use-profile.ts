import { Profile } from "@/commons/models/user"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileStore {
  profile: Profile | null
  setProfile: (user: Profile | null) => void
  clearStore: () => void
}

const PROFILE_KEY = 'luluzinha:auth:profile';

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,

      // Salva o usuário (Zustand + LocalStorage)
      setProfile: (userData) => set({ profile: userData }),

      // Limpa tudo
      clearStore: () => set({ profile: null }),
    }),
    {
      name: PROFILE_KEY, // Nome da chave no localStorage
    }
  )
)