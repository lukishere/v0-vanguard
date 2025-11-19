'use client'

import { ClerkProvider } from "@clerk/nextjs"

interface ClerkProviderWrapperProps {
  children: React.ReactNode
  appearance?: any
}

export function ClerkProviderWrapper({ children, appearance }: ClerkProviderWrapperProps) {
  return (
    <ClerkProvider appearance={appearance}>
      {children}
    </ClerkProvider>
  )
}
