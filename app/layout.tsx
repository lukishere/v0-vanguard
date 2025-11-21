import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";
import { CookieBanner } from "@/components/cookie-banner";
import { CookieSettings } from "@/components/cookie-settings";
import { CursorTrail } from "@/components/cursor-trail";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HtmlWrapper } from "@/components/html-wrapper";
import ReactParticlesBackground from "@/components/react-particles-background";
import { CookieProvider } from "@/contexts/cookie-context";
import { DemoProvider } from "@/contexts/demo-context";
import { KnowledgeBaseProvider } from "@/contexts/knowledge-base-context";
import { LanguageProvider } from "@/contexts/language-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";
import "./globals.css";

// Force dynamic rendering for authentication and real-time features
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VANGUARD-IA - Innovation and creativity to transform your business",
  description:
    "Specialized consultancy in AI, IT, web branding, infrastructure, and security",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
              formButtonPrimary:
                "bg-vanguard-blue hover:bg-vanguard-blue/90 text-white transition-all",
              footerActionLink:
                "text-vanguard-blue hover:text-vanguard-blue/80",
              card: "shadow-lg border border-slate-100 rounded-3xl",
            },
          }}
        >
          <body className={inter.className}>
            <CookieProvider>
              <KnowledgeBaseProvider>
                <DemoProvider>
                  <ReactParticlesBackground />
                  <div
                    className="flex flex-col min-h-screen relative"
                    style={{ zIndex: 30 }}
                  >
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
  );
}
