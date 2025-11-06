"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useEffect, useState } from "react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Ensure hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  // Show loading state during hydration
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="flex items-center gap-1 text-vanguard-blue border-vanguard-blue font-medium opacity-50">
        <Globe className="h-4 w-4" />
        <span>EN</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-vanguard-blue border-vanguard-blue hover:bg-vanguard-blue hover:text-white transition-all duration-300 font-medium"
    >
      <Globe className="h-4 w-4" />
      <span>{language.toUpperCase()}</span>
    </Button>
  )
}
