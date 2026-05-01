import { create } from 'zustand';
import { EstablishmentFormatted } from '@/commons/models/establishment';

interface EstablishmentStore {
  establishments: EstablishmentFormatted[];
  activeEstablishment: EstablishmentFormatted | null;
  setEstablishments: (establishments: EstablishmentFormatted[]) => void;
  setActiveEstablishment: (establishment: EstablishmentFormatted | null) => void;
  clearStore: () => void;
}

export const useEstablishmentStore = create<EstablishmentStore>()(
  (set) => ({
    establishments: [],
    activeEstablishment: null,

    setEstablishments: (establishments) => set({ establishments }),
    setActiveEstablishment: (establishment) => set({ activeEstablishment: establishment }),

    clearStore: () => {
      set({ establishments: [], activeEstablishment: null })
    },
  })
);
