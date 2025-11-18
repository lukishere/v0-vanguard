"use client"

import { useEffect, useState } from "react"
import type { Demo } from "@/lib/demos/types"
import { useDemo } from "@/contexts/demo-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MessageSquare, AlertCircle, Loader2 } from "lucide-react"
import { FeedbackModal } from "./feedback-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DemoModalProps {
  demo: Demo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DemoModal({ demo, open, onOpenChange }: DemoModalProps) {
  const { closeDemo, error: contextError } = useDemo()
  const [showFeedback, setShowFeedback] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  useEffect(() => {
    if (open && demo.interactiveUrl) {
      setIframeLoaded(false)
      setIframeError(false)
      console.log(`Demo modal opened: ${demo.name}`)
    }
  }, [open, demo.interactiveUrl])

  const handleClose = () => {
    closeDemo()
    onOpenChange(false)
    setShowFeedback(false)
    setIframeLoaded(false)
    setIframeError(false)
  }

  const handleIframeLoad = () => {
    setIframeLoaded(true)
    setIframeError(false)
  }

  const handleIframeError = () => {
    setIframeError(true)
    setIframeLoaded(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 bg-slate-900 border-white/10">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {demo.icon && <span className="text-3xl">{demo.icon}</span>}
                <DialogTitle className="text-2xl text-white">{demo.name}</DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFeedback(true)}
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feedback
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Error Alert */}
          {(contextError || iframeError) && (
            <div className="px-6 pt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {contextError || "Error al cargar la demo. Verifica tu conexión e intenta nuevamente."}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex-1 overflow-hidden relative">
            {demo.interactiveUrl ? (
              <>
                {/* Loading Overlay */}
                {!iframeLoaded && !iframeError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                      <p className="text-white/70">Cargando demo...</p>
                    </div>
                  </div>
                )}

                <iframe
                  src={demo.interactiveUrl}
                  className="w-full h-full border-0"
                  title={`Demo interactiva: ${demo.name}`}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  // Atributos de seguridad para iframe
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="clipboard-read; clipboard-write; camera; microphone; geolocation; autoplay; encrypted-media"
                  loading="lazy"
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white/70">
                <div className="text-center space-y-4">
                  <p className="text-lg">Demo no disponible</p>
                  <p className="text-sm">{demo.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tip Section */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/5">
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white mb-1">Tip de uso</p>
                <p className="text-xs text-white/70">
                  {demo.demoType === "bot"
                    ? "Prueba hacer preguntas sobre nuestros servicios o solicita información específica."
                    : demo.demoType === "dashboard"
                    ? "Explora las diferentes secciones y métricas disponibles en el panel."
                    : "Interactúa con la demo para entender mejor cómo funciona."}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showFeedback && (
        <FeedbackModal
          demo={demo}
          open={showFeedback}
          onOpenChange={setShowFeedback}
        />
      )}
    </>
  )
}
