"use client"

import { SignIn } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface ClientSignInProps {
  fallbackRedirectUrl?: string
  appearance?: {
    elements?: Record<string, string>
  }
}

export function ClientSignIn({
  fallbackRedirectUrl = "/dashboard",
  appearance,
}: ClientSignInProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-white/50">Cargando...</div>
        </div>
      </div>
    )
  }

  return (
    <SignIn
      fallbackRedirectUrl={fallbackRedirectUrl}
      redirectUrl="/dashboard"
      appearance={appearance}
    />
  )
}
