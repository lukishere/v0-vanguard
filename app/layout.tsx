import type React from "react"
import type { Metadata } from "next"
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { CookieProvider } from "@/contexts/cookie-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorTrail } from "@/components/cursor-trail"
import ReactParticlesBackground from "@/components/react-particles-background"
import LiveChat from '@/components/chatbot'
import { KnowledgeBaseProvider } from '@/contexts/knowledge-base-context'
import { DemoProvider } from '@/contexts/demo-context'
import { CookieBanner } from "@/components/cookie-banner"
import { CookieSettings } from "@/components/cookie-settings"
import { Toaster } from "sonner"
import { HtmlWrapper } from "@/components/html-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VANGUARD-IA - Innovation and creativity to transform your business",
  description: "Specialized consultancy in AI, IT, web branding, infrastructure, and security",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LanguageProvider>
      <HtmlWrapper>
        <ClerkProviderWrapper
          appearance={{
            variables: {
              colorPrimary: "#1F3B6D",
              colorBackground: "#ffffff",
              fontFamily: inter.style.fontFamily,
              colorText: "#1F2933",
              colorInputBackground: "#F8FAFC",
              colorInputText: "#1F2933",
            },
            elements: {
              formButtonPrimary: "bg-vanguard-blue hover:bg-vanguard-blue/90 text-white transition-all",
              footerActionLink: "text-vanguard-blue hover:text-vanguard-blue/80",
              card: "shadow-lg border border-slate-100 rounded-3xl",
            },
          }}
        >
          <body className={inter.className}>
            <CookieProvider>
              <KnowledgeBaseProvider>
                <DemoProvider>
                  <ReactParticlesBackground />
                  <div className="flex flex-col min-h-screen relative" style={{ zIndex: 30 }}>
                    <Header />
                    <main className="flex-grow relative" style={{ zIndex: 31 }}>
                      {children}
                    </main>
                    <Footer />
                    <CursorTrail />
                    <CookieBanner />
                    <CookieSettings />
                    {/* <LiveChat /> */}
                  </div>
                  <Toaster position="top-right" richColors />
                </DemoProvider>
              </KnowledgeBaseProvider>
            </CookieProvider>
          </body>
        </ClerkProviderWrapper>
      </HtmlWrapper>
    </LanguageProvider>
  )
}
