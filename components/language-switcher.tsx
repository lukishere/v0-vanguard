"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useEffect, useState } from "react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Ensure hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setLanguage(language === "en" ? "es" : "en")
      setIsAnimating(false)
    }, 300)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="flex items-center gap-1 opacity-0">
        <Globe className="h-4 w-4" />
        <span>EN</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-gray-700 hover:text-vanguard-blue transition-all duration-300 relative overflow-hidden"
      disabled={isAnimating}
    >
      <Globe className="h-4 w-4 animate-pulse-subtle" />
      <span className={isAnimating ? "animate-fade-out" : "animate-fade-in"}>{language === "en" ? "ES" : "EN"}</span>
    </Button>
  )
}
