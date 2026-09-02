'use client'

import { useEffect, useCallback } from "react"
import { getActiveEstablishmentsAction } from "@/actions/establishment"
import { useEstablishmentStore } from "@/store/use-establishment"

export function EstablishmentHydrator() {
  const setEstablishments = useEstablishmentStore((state) => state.setEstablishments)
  const setActiveEstablishment = useEstablishmentStore((state) => state.setActiveEstablishment)
  const activeEstablishment = useEstablishmentStore((state) => state.activeEstablishment)

  const hydrate = useCallback(async () => {
    try {
      const { establishments, activeEstablishment: active } = await getActiveEstablishmentsAction()
      setEstablishments(establishments)
      setActiveEstablishment(active)
    } catch (error) {
      console.error("Failed to hydrate establishment", error)
    }
  }, [setEstablishments, setActiveEstablishment])

  useEffect(() => {
    if (!activeEstablishment) {
      hydrate()
    }
  }, [hydrate, activeEstablishment])

  return null
}
