import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorTrail } from "@/components/cursor-trail"
import ReactParticlesBackground from "@/components/react-particles-background"
import LiveChat from '@/components/chatbot'
import { KnowledgeBaseProvider } from '@/contexts/knowledge-base-context'

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <KnowledgeBaseProvider>
            <ReactParticlesBackground />
            <div className="flex flex-col min-h-screen relative">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <CursorTrail />
              {/* <LiveChat /> */}
            </div>
          </KnowledgeBaseProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
