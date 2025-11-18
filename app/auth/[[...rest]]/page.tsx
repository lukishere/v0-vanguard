"use client"

import { SignIn, SignUp } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "signin"
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === "signup" ? (
          <SignUp
            routing="path"
            path="/auth"
            redirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                card: "shadow-none bg-transparent border-0",
                headerTitle: "text-white",
                headerSubtitle: "text-white/70",
                socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 text-white",
                formFieldInput:
                  "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-vanguard-blue focus:ring-vanguard-blue/40",
                formFieldLabel: "text-white/70",
                footerActionLink: "text-vanguard-blue hover:text-vanguard-blue/80",
                footer: "text-white/60",
              },
            }}
          />
        ) : (
          <SignIn
            routing="path"
            path="/auth"
            redirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                card: "shadow-none bg-transparent border-0",
                headerTitle: "text-white",
                headerSubtitle: "text-white/70",
                socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 text-white",
                formFieldInput:
                  "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-vanguard-blue focus:ring-vanguard-blue/40",
                formFieldLabel: "text-white/70",
                footerActionLink: "text-vanguard-blue hover:text-vanguard-blue/80",
                footer: "text-white/60",
              },
            }}
          />
        )}
      </div>
    </div>
  )
}
