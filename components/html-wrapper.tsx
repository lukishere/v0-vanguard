"use client"

import { useLanguage } from "@/contexts/language-context"

export function HtmlWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  return (
    <html lang={language} suppressHydrationWarning>
      {children}
    </html>
  )
}

