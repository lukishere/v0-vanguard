"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type CookiePreferences,
  getCookiePreferences,
  saveCookiePreferences,
  hasConsent,
  getDefaultPreferences,
  clearCookiePreferences,
} from "@/lib/cookies"

interface CookieContextType {
  preferences: CookiePreferences
  hasConsent: boolean
  showBanner: boolean
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  acceptAll: () => void
  rejectAll: () => void
  savePreferences: (preferences: CookiePreferences) => void
  updatePreference: (category: keyof CookiePreferences, value: boolean) => void
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

export function CookieProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<CookiePreferences>(getDefaultPreferences())
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user has already given consent
    const consent = hasConsent()
    const savedPreferences = getCookiePreferences()

    if (savedPreferences) {
      setPreferences(savedPreferences)
    }

    // Show banner if no consent has been given
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    }
    saveCookiePreferences(allAccepted)
    setPreferences(allAccepted)
    setShowBanner(false)
    setShowSettings(false)
  }

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    }
    saveCookiePreferences(onlyNecessary)
    setPreferences(onlyNecessary)
    setShowBanner(false)
    setShowSettings(false)
  }

  const savePreferences = (newPreferences: CookiePreferences) => {
    saveCookiePreferences(newPreferences)
    setPreferences(newPreferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  const updatePreference = (category: keyof CookiePreferences, value: boolean) => {
    const updated = { ...preferences, [category]: value }
    setPreferences(updated)
  }

  return (
    <CookieContext.Provider
      value={{
        preferences,
        hasConsent: mounted ? hasConsent() : false,
        showBanner: mounted ? showBanner : false,
        showSettings,
        setShowSettings,
        acceptAll,
        rejectAll,
        savePreferences,
        updatePreference,
      }}
    >
      {children}
    </CookieContext.Provider>
  )
}

export function useCookies() {
  const context = useContext(CookieContext)
  if (context === undefined) {
    throw new Error("useCookies must be used within a CookieProvider")
  }
  return context
}
