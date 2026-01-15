"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showButtonFallback, setShowButtonFallback] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Track client-side mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fallback: Si Clerk no carga después de 3 segundos, mostrar botón de todos modos
  useEffect(() => {
    if (isMounted && !isLoaded) {
      const timeout = setTimeout(() => {
        console.warn("[Header] Clerk no cargó después de 3 segundos, mostrando botón de fallback");
        setShowButtonFallback(true);
      }, 3000);

      // Si Clerk carga antes del timeout, cancelar el fallback
      if (isLoaded) {
        clearTimeout(timeout);
        setShowButtonFallback(false);
      }

      return () => clearTimeout(timeout);
    } else if (isLoaded) {
      setShowButtonFallback(false);
    }
  }, [isMounted, isLoaded]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about/", label: t("nav.about") },
    { href: "/services/", label: t("nav.services") },
    { href: "/events/", label: t("nav.events") },
    { href: "/contact/", label: t("nav.contact") },
  ];

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
            {/* Authentication Status & CTA */}
            {!isMounted || (!isLoaded && !showButtonFallback) ? (
              <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-md" />
            ) : !isSignedIn || showButtonFallback ? (
              <Button
                asChild
                className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Link href="/clientes/">{t("cta.getQuote")}</Link>
              </Button>
            ) : (
              <Button
                asChild
                className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Link href="/dashboard/">PORTAL</Link>
              </Button>
            )}
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
              {isMenuOpen ? (
                <X className="h-6 w-6 animate-fade-in" />
              ) : (
                <Menu className="h-6 w-6 animate-fade-in" />
              )}
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
                    pathname === item.href
                      ? "text-vanguard-blue font-medium"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.label}
                </Link>
              ))}
              {/* Authentication Status & CTA - Mobile */}
              {!isMounted || (!isLoaded && !showButtonFallback) ? (
                <div className="h-10 w-full bg-gray-100 animate-pulse rounded-md" />
              ) : !isSignedIn || showButtonFallback ? (
                <Button
                  asChild
                  className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white w-full transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Link href="/clientes/" onClick={() => setIsMenuOpen(false)}>
                    {t("cta.getQuote")}
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white w-full transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Link href="/dashboard/" onClick={() => setIsMenuOpen(false)}>
                    PORTAL
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
