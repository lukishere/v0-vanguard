"use client"

import { logActivity } from "@/app/actions/client-activities"
import { requestDemoExtension, requestServiceContract } from "@/app/actions/service-requests"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Demo } from "@/lib/demos/types"
import { shouldShowConversionBanner } from "@/lib/demos/utils"
import { AlertCircle, Clock, Mail, Phone, Rocket, Send } from "lucide-react"
import { useEffect, useState } from "react"

interface ConversionBannerProps {
  daysRemaining: number | null
  demoId?: string
  demoName?: string
  expirationDate?: string
  expiringDemos?: Demo[]
}

export function ConversionBanner({ daysRemaining, demoId, demoName, expirationDate, expiringDemos = [] }: ConversionBannerProps) {
  if (!shouldShowConversionBanner(daysRemaining)) return null

  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false)
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false)
  const [contractMessage, setContractMessage] = useState("")
  const [contactPreference, setContactPreference] = useState("email")
  const [extensionReason, setExtensionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDemoForContract, setSelectedDemoForContract] = useState<string>(demoId || "")
  const [selectedDemoForExtend, setSelectedDemoForExtend] = useState<string>(demoId || "")
  const { toast } = useToast()

  const isCritical = daysRemaining !== null && daysRemaining <= 3

  // Inicializar selecciones cuando se abren los dialogs
  useEffect(() => {
    if (isContractDialogOpen && expiringDemos.length > 0) {
      setSelectedDemoForContract(expiringDemos[0].id)
    }
  }, [isContractDialogOpen, expiringDemos])

  useEffect(() => {
    if (isExtendDialogOpen && expiringDemos.length > 0) {
      setSelectedDemoForExtend(expiringDemos[0].id)
    }
  }, [isExtendDialogOpen, expiringDemos])

  const handleContractRequest = async () => {
    if (!contractMessage.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor describe qué te interesa del servicio",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await requestServiceContract(contractMessage, contactPreference, selectedDemoForContract || undefined)

      if (result.success) {
        // Registrar actividad
        await logActivity(
          "service-contracted",
          "Solicitó contratación de servicio completo",
          { requestId: result.requestId }
        )

        toast({
          title: "¡Solicitud enviada!",
          description: "Nuestro equipo de ventas te contactará pronto.",
        })
        setIsContractDialogOpen(false)
        setContractMessage("")
        setContactPreference("email")
      } else{
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar la solicitud",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExtendRequest = async () => {
    const selectedDemo = expiringDemos.find(d => d.id === selectedDemoForExtend)

    if (!selectedDemo) {
      toast({
        title: "Error",
        description: "Demo seleccionada no encontrada",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await requestDemoExtension(selectedDemo.id, selectedDemo.name, selectedDemo.expiresAt || "", extensionReason || undefined)

      if (result.success) {
        // Registrar actividad
        await logActivity(
          "demo-extended",
          `Solicitó extensión de "${demoName}"`,
          { demoId, demoName, requestId: result.requestId }
        )

        toast({
          title: "¡Solicitud enviada!",
          description: "Un administrador revisará tu solicitud de extensión.",
        })
        setIsExtendDialogOpen(false)
        setExtensionReason("")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar la solicitud",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`rounded-3xl border p-6 shadow-2xl backdrop-blur ${
      isCritical
        ? "border-red-500/60 bg-gradient-to-r from-red-500/30 via-red-500/20 to-red-500/30"
        : "border-amber-500/60 bg-gradient-to-r from-amber-500/30 via-amber-500/20 to-amber-500/30"
    }`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 rounded-full ${
            isCritical ? "bg-red-500/20" : "bg-amber-500/20"
          }`}>
            <AlertCircle className={`h-6 w-6 ${
              isCritical ? "text-red-400" : "text-amber-400"
            }`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-semibold mb-2 ${
              isCritical ? "text-red-100" : "text-amber-100"
            }`}>
              {isCritical
                ? "¡Tu demo expira pronto!"
                : `Tu demo expira en ${daysRemaining} días`}
            </h3>
            <p className={`text-sm ${
              isCritical ? "text-red-200/80" : "text-amber-200/80"
            }`}>
              {isCritical
                ? "No pierdas acceso a todas las funcionalidades. Contrata el servicio completo o amplía tu demo ahora."
                : "¿Listo para llevar esto a producción? Contrata el servicio completo o amplía tu demo para seguir explorando."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button
            onClick={() => setIsContractDialogOpen(true)}
            className="bg-white text-slate-900 hover:bg-white/90 font-medium"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Contratar Servicio
          </Button>
          <Button
            onClick={() => setIsExtendDialogOpen(true)}
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 font-medium"
          >
            <Clock className="mr-2 h-4 w-4" />
            Ampliar Demo
          </Button>
        </div>
      </div>

      {/* Dialog Contratar Servicio */}
      <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="bg-white border-2 border-vanguard-blue/30 text-slate-900 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-slate-900">
              <div className="p-2 rounded-lg bg-vanguard-blue/10">
                <Rocket className="h-5 w-5 text-vanguard-blue" />
              </div>
              Contratar Servicio Completo
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Cuéntanos qué te interesa y nuestro equipo de ventas te contactará para diseñar la solución perfecta para ti.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {expiringDemos.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="contract-demo-select" className="text-slate-700 font-medium">
                  Seleccionar Demo *
                </Label>
                <Select value={selectedDemoForContract} onValueChange={setSelectedDemoForContract}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una demo" />
                  </SelectTrigger>
                  <SelectContent>
                    {expiringDemos.map((demo) => (
                      <SelectItem key={demo.id} value={demo.id}>
                        {demo.name} ({demo.daysRemaining} día{demo.daysRemaining !== 1 ? 's' : ''})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-700 font-medium">
                ¿Qué funcionalidades te interesan? *
              </Label>
              <Textarea
                id="message"
                placeholder="Ej: Me interesa implementar el chatbot IA en mi empresa..."
                value={contractMessage}
                onChange={(e) => setContractMessage(e.target.value)}
                className="min-h-[100px] bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-vanguard-blue focus:ring-vanguard-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="text-slate-700 font-medium">
                ¿Cómo prefieres que te contactemos?
              </Label>
              <Select value={contactPreference} onValueChange={setContactPreference}>
                <SelectTrigger className="bg-slate-50 border-slate-300 text-slate-900 focus:border-vanguard-blue focus:ring-vanguard-blue">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-vanguard-blue" />
                      <span className="text-slate-900">Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-vanguard-blue" />
                      <span className="text-slate-900">Teléfono</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="both">
                    <span className="text-slate-900">Ambos</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-xs text-red-700 font-medium">
                ⚡ Respuesta en menos de 24 horas
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsContractDialogOpen(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleContractRequest}
              disabled={isSubmitting || !contractMessage.trim()}
              className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white"
            >
              {isSubmitting ? "Enviando..." : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Ampliar Demo */}
      <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
        <DialogContent className="bg-white border-2 border-amber-400/30 text-slate-900 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-slate-900">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              Ampliar Período de Demo
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Solicita más tiempo para evaluar la demo. Un administrador revisará tu solicitud.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {expiringDemos.length > 1 ? (
              <div className="space-y-2">
                <Label htmlFor="extend-demo-select" className="text-slate-700 font-medium">
                  Seleccionar Demo a Extender *
                </Label>
                <Select value={selectedDemoForExtend} onValueChange={setSelectedDemoForExtend}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una demo" />
                  </SelectTrigger>
                  <SelectContent>
                    {expiringDemos.map((demo) => (
                      <SelectItem key={demo.id} value={demo.id}>
                        {demo.name} ({demo.daysRemaining} día{demo.daysRemaining !== 1 ? 's' : ''})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(() => {
                  const selectedDemo = expiringDemos.find(d => d.id === selectedDemoForExtend)
                  return selectedDemo && selectedDemo.daysRemaining !== null ? (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            selectedDemo.daysRemaining <= 3 ? 'bg-red-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.max(5, Math.min(100, (selectedDemo.daysRemaining / 7) * 100))}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 whitespace-nowrap">
                        {selectedDemo.daysRemaining} día{selectedDemo.daysRemaining !== 1 ? 's' : ''} restantes
                      </span>
                    </div>
                  ) : null
                })()}
              </div>
            ) : (
              demoName && (
                <div className="rounded-lg border-2 border-vanguard-blue/20 bg-vanguard-blue/5 p-4">
                  <p className="text-sm text-slate-600 mb-1">Demo a extender:</p>
                  <p className="font-semibold text-slate-900">{demoName}</p>
                  {daysRemaining !== null && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            daysRemaining <= 3 ? 'bg-red-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, (daysRemaining / 14) * 100)}%` }}
                        />
                      </div>
                      <p className={`text-xs font-medium ${
                        daysRemaining <= 3 ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}
                      </p>
                    </div>
                  )}
                </div>
              )
            )}

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-slate-700 font-medium">
                Razón de extensión (opcional)
              </Label>
              <Textarea
                id="reason"
                placeholder="Ej: Necesito más tiempo para evaluar con mi equipo..."
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                className="min-h-[80px] bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            {daysRemaining !== null && daysRemaining <= 3 && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-xs text-red-700 font-medium">
                  ⚠️ Tu demo expira pronto. Revisaremos tu solicitud prioritariamente.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExtendDialogOpen(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExtendRequest}
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isSubmitting ? "Enviando..." : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Solicitar Extensión
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
