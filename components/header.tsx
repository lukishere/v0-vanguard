"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

export function Header() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "shadow-sm py-3" : "border-b border-gray-100 py-4"
      }`}
    >
      <div className="vanguard-container">
        <div className="flex justify-between items-center">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-gray-700 hover:text-vanguard-blue transition-all duration-300 relative hover:-translate-y-0.5 ${
                  pathname === item.href ? "text-vanguard-blue font-medium" : ""
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-vanguard-red"></span>
                )}
              </Link>
            ))}
            <LanguageSwitcher />
            <Button
              asChild
              className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Link href="/contact?quote=true">{t("cta.getQuote")}</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="transition-all duration-300 hover:-translate-y-0.5"
            >
              {isMenuOpen ? <X className="h-6 w-6 animate-fade-in" /> : <Menu className="h-6 w-6 animate-fade-in" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 animate-slide-in-right">
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-gray-700 hover:text-vanguard-blue transition-all duration-300 hover:-translate-y-0.5 ${
                    pathname === item.href ? "text-vanguard-blue font-medium" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                asChild
                className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white w-full transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/contact?quote=true" onClick={() => setIsMenuOpen(false)}>
                  {t("cta.getQuote")}
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
