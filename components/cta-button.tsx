"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { ArrowRight, ExternalLink } from "lucide-react"
import { AuditModal } from "@/components/audit-modal"

type CTAType = "learn" | "contact" | "quote" | "external"

interface CTAButtonProps {
  type: CTAType
  className?: string
  href?: string
  text?: string
  isExternal?: boolean
}

export function CTAButton({ type, className = "", href, text, isExternal = false }: CTAButtonProps) {
  const { t } = useLanguage()
  const [modalOpen, setModalOpen] = useState(false)

  const ctaConfig = {
    learn: {
      text: text || t("cta.learnMore"),
      href: href || "/services",
      variant: "outline" as const,
    },
    contact: {
      text: text || t("cta.contactUs"),
      href: href || "/contact/",
      variant: "secondary" as const,
    },
    quote: {
      text: text || t("cta.getQuote"),
      href: href || "/contact/?quote=true",
      variant: "default" as const,
    },
    external: {
      text: text || t("cta.learnMore"),
      href: href || "#",
      variant: "outline" as const,
    },
  }

  const config = ctaConfig[type]
  const IconComponent = isExternal ? ExternalLink : ArrowRight

  const buttonContent = (
    <>
      <span className="relative z-10">{config.text}</span>
      <IconComponent className="h-4 w-4 ml-1 transform translate-x-0 opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      <span
        className={`absolute inset-0 w-0 ${
          type === "quote" ? "bg-vanguard-red" : "bg-vanguard-blue/10"
        } transition-all duration-300 group-hover:w-full -z-0`}
      ></span>
    </>
  )

  // For "learn" type, open modal instead of navigating
  if (type === "learn") {
    return (
      <>
        <Button
          variant={config.variant}
          onClick={() => setModalOpen(true)}
          className={`${className} group relative overflow-hidden transition-all duration-300 ${
            type === "quote" ? "bg-vanguard-blue hover:bg-vanguard-blue/90" : ""
          }`}
        >
          <span className="flex items-center gap-1">
            {buttonContent}
          </span>
        </Button>
        <AuditModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    )
  }

  return (
    <Button
      variant={config.variant}
      className={`${className} group relative overflow-hidden transition-all duration-300 ${
        type === "quote" ? "bg-vanguard-blue hover:bg-vanguard-blue/90" : ""
      }`}
    >
      {isExternal ? (
        <a href={config.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
          {buttonContent}
        </a>
      ) : (
        <Link href={config.href} className="flex items-center gap-1">
          {buttonContent}
        </Link>
      )}
    </Button>
  )
}
