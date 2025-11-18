'use client'

import { ClerkProvider } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface ClerkProviderWrapperProps {
  children: React.ReactNode
  appearance?: any
}

export function ClerkProviderWrapper({ children, appearance }: ClerkProviderWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // During SSR/static generation, return children without ClerkProvider
    return <>{children}</>
  }

  return (
    <ClerkProvider appearance={appearance}>
      {children}
    </ClerkProvider>
  )
}
