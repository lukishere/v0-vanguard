"use client"

import type { MeetingMilestone } from "@/app/actions/meeting-milestones"
import { DashboardLogoutButton } from "@/components/dashboard-logout-button"
import { ActionButtons } from "@/components/dashboard/action-buttons"
import { ChatbotWidget } from "@/components/dashboard/chatbot-widget"
import { ClientMilestones } from "@/components/dashboard/client-milestones"
import { ConversionBanner } from "@/components/dashboard/conversion-banner"
import { DemoTabs } from "@/components/dashboard/demo-tabs"
import { MessagesPanel } from "@/components/dashboard/messages-panel"
import { OnboardingModal } from "@/components/dashboard/onboarding-modal"
import DecryptedText from "@/components/DecryptedText"
import { useActivityTracker } from "@/hooks/use-activity-tracker"
import type { Demo } from "@/lib/demos/types"
import { shouldShowConversionBanner } from "@/lib/demos/utils"
import { useUser } from "@clerk/nextjs"
import { Bot } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardData {
  firstName: string
  activeDemos: Demo[]
  availableDemos: Demo[]
  inDevelopmentDemos: Demo[]
  activities: any[]
  meetingMilestones: MeetingMilestone[]
  minDaysRemaining: number | null
  criticalDemo: Demo | null
  expiringDemos: Demo[]
}

interface ClientDashboardWrapperProps {
  initialData: DashboardData
}

export function ClientDashboardWrapper({ initialData }: ClientDashboardWrapperProps) {
  const { user } = useUser()
  const { updateActivity } = useActivityTracker()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)

  const { firstName, activeDemos, availableDemos, inDevelopmentDemos, activities, meetingMilestones, minDaysRemaining, criticalDemo, expiringDemos } = initialData

  // Check if user needs to complete onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setIsCheckingOnboarding(false)
        return
      }

      try {
        // Check if onboarding is already completed in metadata
        const metadata = user.publicMetadata as any
        const onboardingCompleted = metadata?.onboardingCompleted || false

        if (!onboardingCompleted) {
          console.log("🎯 [Onboarding] Usuario necesita completar perfil empresarial")
          setShowOnboarding(true)
        } else {
          console.log("✅ [Onboarding] Usuario ya completó el perfil empresarial")
        }
      } catch (error) {
        console.error("❌ [Onboarding] Error verificando estado:", error)
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    checkOnboarding()
  }, [user])

  const handleOnboardingComplete = async () => {
    console.log("✅ [Onboarding] Perfil completado, recargando metadata...")
    setShowOnboarding(false)
    
    // Recargar el usuario para obtener metadata actualizada
    if (user) {
      await user.reload()
    }
  }

  return (
    <>
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete}
      />

      {/* Main Dashboard */}
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
      <div className="relative z-10 py-16">
        <div className="vanguard-container space-y-14">
          {/* Header */}
          <header className="space-y-4">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Hola, {firstName}. <DecryptedText
                  text="Bienvenido a PORTAL"
                  className="text-white"
                  encryptedClassName="text-white"
                  animateOn="both"
                  revealDirection="start"
                  speed={150}
                  maxIterations={25}
                  sequential={true}
                /> <Bot className="inline-block w-8 h-8 ml-2 text-blue-400" />
              </h1>
              <p className="max-w-3xl text-lg text-white/70">
                Visualiza el estado de tus demos, comparte feedback y coordina sesiones con nuestro equipo.
                Coordina con nosotros para llevar tu proyecto al siguiente nivel.
              </p>
              <div className="flex items-center gap-3">
                <MessagesPanel />
                <DashboardLogoutButton />
              </div>
            </div>
          </header>

          {/* Conversion Banner */}
          {shouldShowConversionBanner(minDaysRemaining) && (
            <ConversionBanner
              daysRemaining={minDaysRemaining}
              demoId={criticalDemo?.id}
              demoName={criticalDemo?.name}
              expirationDate={criticalDemo?.expiresAt}
              expiringDemos={expiringDemos}
            />
          )}

          {/* Main Content - Tabs */}
          <DemoTabs
            activeDemos={activeDemos}
            inDevelopmentDemos={inDevelopmentDemos}
            availableDemos={availableDemos}
            activities={activities}
          />

          {/* Próximos Hitos */}
          <ClientMilestones milestones={meetingMilestones} />

          {/* Help Section */}
          <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-vanguard-blue/20 via-white/5 to-vanguard-red/30 p-8 shadow-2xl backdrop-blur">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">¿Necesitas ayuda o tienes preguntas?</h2>
                <p className="text-sm text-white/70">
                  Estamos aquí para ayudarte. Agenda una reunión, solicita acceso adicional o comparte tu feedback.
                  Tu opinión es fundamental para mejorar nuestros servicios.
                </p>
              </div>
              <ActionButtons />
            </div>
          </section>

          {/* Chatbot Widget Flotante */}
          <ChatbotWidget />
        </div>
      </div>
    </div>
    </>
  )
}
