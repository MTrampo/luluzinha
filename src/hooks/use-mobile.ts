import * as React from "react"

const MOBILE_BREAKPOINT = 768
const COMPACT_BREAKPOINT = 640

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = globalThis.window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(globalThis.window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(globalThis.window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsCompactMobile() {
  const [isCompact, setIsCompact] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = globalThis.window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsCompact(globalThis.window.innerWidth < COMPACT_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsCompact(globalThis.window.innerWidth < COMPACT_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isCompact
}
