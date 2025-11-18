"use client"

import { useState, useEffect } from "react"
import type { Demo } from "@/lib/demos/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Clock, Package, PlayCircle, FileText, BookOpen, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { servicesContent } from "@/lib/content/services"
import { resourcesData } from "@/lib/content/resources"
import { logActivity } from "@/app/actions/client-activities"
import { requestMeetingMilestone } from "@/app/actions/meeting-milestones"

type RequestType =
  | "meeting"
  | "quote"
  | "contracts"
  | "access"
  | "success-cases"
  | "resources"
  | "sales-chat"

interface MeetingModalProps {
  demo?: Demo
  open: boolean
  onOpenChange: (open: boolean) => void
  requestType?: RequestType
}

export function MeetingModal({ demo, open, onOpenChange, requestType = "meeting" }: MeetingModalProps) {
  const [meetingType, setMeetingType] = useState<"demo" | "consultation" | "implementation">("demo")
  const [productType, setProductType] = useState<string>(demo?.name || "")
  const [preferredDate, setPreferredDate] = useState("")
  const [preferredTime, setPreferredTime] = useState("")
  const [notes, setNotes] = useState(demo ? `Consulta específica sobre la demo "${demo.name}"` : "")
  // Campos para solicitar acceso adicional
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  // Campos para chat con ventas
  const [subject, setSubject] = useState("")
  const [messageBody, setMessageBody] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Resetear valores cuando cambie la demo o se abra el modal
  useEffect(() => {
    if (open) {
      setMeetingType("demo")
      setProductType(demo?.name || "")
      setPreferredDate("")
      setPreferredTime("")
      setNotes(demo ? `Consulta específica sobre la demo "${demo.name}"` : "")
      setFirstName("")
      setLastName("")
      setEmail("")
      setSubject("")
      setMessageBody("")
    }
  }, [open, demo])

  // Obtener lista de servicios/productos desde la sección de servicios
  const services = servicesContent.es.services.map((service) => service.title)

  // Configuración según el tipo de solicitud
  const requestConfig = {
    meeting: {
      title: demo ? `Reunión - ${demo.name}` : "Reunión",
      description: demo ? `Demo: ${demo.name}` : "Solicita una reunión con nuestro equipo",
      showMeetingType: true,
      showProductType: true,
      priorityContent: null,
    },
    quote: {
      title: "Solicitar Cotización",
      description: "Obtén un presupuesto personalizado para tu proyecto",
      showMeetingType: true,
      showProductType: true,
      priorityContent: {
        title: "Cotización Personalizada",
        description: "Recibirás un presupuesto detallado adaptado a tus necesidades específicas, con opciones flexibles de pago y planes escalables.",
      },
    },
    contracts: {
      title: "Contratos Digitales",
      description: "Gestiona y firma tus contratos de forma segura y legal",
      showMeetingType: false,
      showProductType: false,
      priorityContent: {
        title: "Firma Digital con Signaturit",
        description: "Utilizamos Signaturit, plataforma avalada por el Reglamento eIDAS (Reglamento UE 910/2014), que garantiza la validez legal de las firmas electrónicas en toda la Unión Europea.",
        benefits: [
          "Validez legal reconocida en toda la UE según eIDAS",
          "Firma desde cualquier dispositivo, en cualquier momento",
          "Proceso rápido y sin necesidad de desplazamientos",
          "Trazabilidad completa del proceso de firma",
          "Almacenamiento seguro y accesible de documentos",
          "Cumplimiento con normativas de protección de datos",
        ],
      },
    },
    access: {
      title: "Solicitar Acceso Adicional",
      description: "Invita a miembros de tu equipo al portal",
      showMeetingType: false,
      showProductType: false,
      priorityContent: {
        title: "Acceso para tu Equipo",
        description: "Amplía el acceso al portal para que más miembros de tu organización puedan colaborar y probar nuestras soluciones.",
      },
    },
    "success-cases": {
      title: "Rendimientos",
      description: "ROI de productividad aplicado a nuestros servicios y productos",
      showMeetingType: false,
      showProductType: false,
      priorityContent: {
        roiData: [
          {
            service: "Soluciones CRM con IA",
            timeframe: "3-6 meses",
            roi: "340%",
            payback: "8-12 meses",
            metrics: [
              "Reducción del 65% en tiempo de gestión de clientes",
              "Aumento del 45% en tasa de conversión",
              "Mejora del 80% en precisión de predicciones de ventas",
              "Incremento del 55% en eficiencia del equipo comercial"
            ],
            caseStudy: "Empresa de retail con 200 empleados: Reducción de 1,200 horas mensuales en tareas administrativas, permitiendo al equipo enfocarse en ventas estratégicas."
          },
          {
            service: "Desarrollo de IA",
            timeframe: "4-8 meses",
            roi: "280%",
            payback: "10-15 meses",
            metrics: [
              "Automatización del 70% de procesos repetitivos",
              "Reducción del 50% en errores humanos",
              "Liberación de 1,200 horas/mes en tareas manuales",
              "Incremento del 35% en productividad del equipo"
            ],
            caseStudy: "Compañía logística: Automatización completa de gestión de rutas y entregas, mejorando tiempos de entrega en un 40% y reduciendo errores operativos."
          },
          {
            service: "Desarrollo y Branding Web",
            timeframe: "2-4 meses",
            roi: "420%",
            payback: "4-8 meses",
            metrics: [
              "Aumento del 180% en tráfico orgánico",
              "Mejora del 95% en tasa de conversión web",
              "Incremento del 250% en leads cualificados",
              "Reducción del 60% en tiempo de adquisición de clientes"
            ],
            caseStudy: "Startup tecnológica: Transformación completa de presencia digital, multiplicando la generación de leads cualificados y mejorando significativamente la conversión."
          },
          {
            service: "Consultoría de Infraestructura | Cloud",
            timeframe: "3-6 meses",
            roi: "310%",
            payback: "9-14 meses",
            metrics: [
              "Reducción del 55% en tiempo de gestión de infraestructura",
              "Mejora del 90% en tiempo de disponibilidad del sistema",
              "Optimización del 85% en rendimiento de aplicaciones",
              "Escalabilidad mejorada en un 200%"
            ],
            caseStudy: "Empresa manufacturera: Migración completa a cloud, mejorando disponibilidad del sistema y permitiendo escalabilidad instantánea según demanda."
          },
          {
            service: "Seguridad",
            timeframe: "2-5 meses",
            roi: "580%",
            payback: "3-7 meses",
            metrics: [
              "Prevención del 100% de brechas de seguridad",
              "Reducción del 95% en incidentes de seguridad",
              "Mejora del 100% en cumplimiento normativo GDPR/eIDAS",
              "Reducción del 80% en tiempo de respuesta a amenazas"
            ],
            caseStudy: "Empresa financiera: Implementación de seguridad integral, eliminando completamente incidentes de seguridad y garantizando cumplimiento total con regulaciones."
          }
        ]
      },
    },
    resources: {
      title: "Recursos y Tutoriales",
      description: "Accede a contenido educativo y guías prácticas",
      showMeetingType: false,
      showProductType: false,
      priorityContent: {
        title: "Centro de Recursos",
        description: "Biblioteca completa de tutoriales, guías, documentación técnica y mejores prácticas para maximizar el uso de nuestras soluciones.",
        resources: resourcesData,
      },
    },
    "sales-chat": {
      title: "Chat con Ventas",
      description: "Habla directamente con nuestro equipo de ventas",
      showMeetingType: false,
      showProductType: true,
      priorityContent: {
        title: "Atención Personalizada y Cotizaciones",
        description: "Nuestro equipo está disponible para resolver tus dudas, explicar funcionalidades y ayudarte a encontrar la mejor solución para tu negocio.",
      },
    },
  }

  const config = requestConfig[requestType]

  const handleSubmit = async () => {
    // Validación según el tipo de solicitud
    if (requestType === "access") {
      if (!firstName || !lastName || !email) {
        toast({
          title: "Completa todos los campos",
          description: "Ingresa nombre, apellido y correo electrónico.",
          variant: "destructive",
        })
        return
      }
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast({
          title: "Email inválido",
          description: "Por favor ingresa un correo electrónico válido.",
          variant: "destructive",
        })
        return
      }
    } else if (requestType === "sales-chat") {
      if (!subject || !productType || !messageBody) {
        toast({
          title: "Completa todos los campos",
          description: "Ingresa asunto, selecciona un tipo de servicio/producto y escribe tu mensaje.",
          variant: "destructive",
        })
        return
      }
    } else if (config.showMeetingType && config.showProductType) {
      if (!preferredDate || !preferredTime || !productType) {
        toast({
          title: "Completa todos los campos",
          description: "Selecciona una fecha, hora y tipo de servicio/producto.",
          variant: "destructive",
        })
        return
      }
    } else if (config.showMeetingType) {
      if (!preferredDate || !preferredTime) {
        toast({
          title: "Completa todos los campos",
          description: "Selecciona una fecha y hora preferida.",
          variant: "destructive",
        })
        return
      }
    }

    setIsSubmitting(true)
    try {
      // Para solicitudes de reunión, guardar como hito
      if (requestType === "meeting" && config.showMeetingType && productType) {
        const result = await requestMeetingMilestone(
          meetingType,
          productType,
          preferredDate,
          preferredTime,
          notes
        )

        if (!result.success) {
          throw new Error(result.error || "Error al solicitar la reunión")
        }
      }

      // También registrar como actividad para mantener compatibilidad
      if (requestType === "meeting" || requestType === "quote") {
        await logActivity(
          "meeting-requested",
          `Solicitó sesión de servicio de producto: ${productType || meetingType}`,
          { productType, meetingType, preferredDate, preferredTime }
        )
      } else if (requestType === "access") {
        await logActivity(
          "access-additional",
          `Solicitó acceso adicional para: ${firstName} ${lastName}`,
          { firstName, lastName, email }
        )
      } else if (requestType === "sales-chat") {
        await logActivity(
          "chat-sales",
          `Inició chat con ventas: ${subject}`,
          { subject, productType }
        )
      }

      const successMessages = {
        meeting: { title: "Reunión solicitada", description: "Tu petición ha sido registrada como hito. Te contactaremos pronto para confirmar la fecha y hora." },
        quote: { title: "Cotización solicitada", description: "Recibirás un presupuesto personalizado en las próximas 24 horas." },
        contracts: { title: "Solicitud recibida", description: "Te enviaremos acceso a los contratos digitales en breve." },
        access: { title: "Solicitud recibida", description: "Revisaremos tu solicitud y te notificaremos cuando se active el acceso adicional." },
        "success-cases": { title: "Información de Rendimientos", description: "Consulta los datos de ROI detallados arriba." },
        resources: { title: "Acceso concedido", description: "Redirigiendo al centro de recursos..." },
        "sales-chat": { title: "Chat iniciado", description: "Un representante de ventas se pondrá en contacto contigo." },
      }

      const message = successMessages[requestType] || successMessages.meeting
      toast({
        title: message.title,
        description: message.description,
      })

      setMeetingType("demo")
      setProductType("")
      setPreferredDate("")
      setPreferredTime("")
      setNotes("")
      setFirstName("")
      setLastName("")
      setEmail("")
      setSubject("")
      setMessageBody("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error en la solicitud:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar la solicitud. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">{config.title}</DialogTitle>
          <DialogDescription className="text-white/70">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[600px] overflow-y-auto pr-2">
          {/* Priority Content */}
          {config.priorityContent && (
            <>
              {config.priorityContent.title && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{config.priorityContent.title}</h3>
                  <p className="text-sm text-white/80">{config.priorityContent.description}</p>
                </div>
              )}
              {config.priorityContent.benefits && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">Beneficios:</h4>
                  <ul className="space-y-2">
                    {config.priorityContent.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-vanguard-blue mt-1">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {config.priorityContent.resources && (
                <div className="space-y-6">
                  {config.priorityContent.resources.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        {category.id === "videos" && <PlayCircle className="h-5 w-5 text-vanguard-blue" />}
                        {category.id === "documents" && <FileText className="h-5 w-5 text-vanguard-blue" />}
                        {category.id === "guides" && <BookOpen className="h-5 w-5 text-vanguard-blue" />}
                        <h4 className="text-base font-semibold text-white">{category.name}</h4>
                      </div>
                      <p className="text-sm text-white/60 mb-3">{category.description}</p>
                      <div className="space-y-2">
                        {category.resources.map((resource) => {
                          const IconComponent =
                            resource.type === "video" ? PlayCircle :
                            resource.type === "document" ? FileText :
                            BookOpen

                          return (
                            <a
                              key={resource.id}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-vanguard-blue/30 transition-all group"
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                <IconComponent className="h-5 w-5 text-vanguard-blue group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="text-sm font-semibold text-white group-hover:text-vanguard-blue transition-colors">
                                    {resource.title}
                                  </h5>
                                  <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-vanguard-blue flex-shrink-0 mt-0.5 transition-colors" />
                                </div>
                                <p className="text-xs text-white/70 mt-1 line-clamp-2">{resource.description}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                                  {resource.duration && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {resource.duration}
                                    </span>
                                  )}
                                  {resource.fileSize && (
                                    <span>{resource.fileSize}</span>
                                  )}
                                  {resource.category && (
                                    <span className="px-2 py-0.5 rounded-full bg-vanguard-blue/20 text-vanguard-blue text-xs">
                                      {resource.category === "getting-started" && "Inicio"}
                                      {resource.category === "advanced" && "Avanzado"}
                                      {resource.category === "troubleshooting" && "Solución"}
                                      {resource.category === "best-practices" && "Mejores Prácticas"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {config.priorityContent.roiData && (
                <div className="space-y-4">
                  {config.priorityContent.roiData.map((roi, index) => (
                    <div key={index} className="rounded-lg border border-vanguard-blue/20 bg-slate-800/50 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-white mb-2">{roi.service}</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-white/60">ROI Productividad:</span>
                              <span className="text-vanguard-blue ml-2 font-bold text-lg">{roi.roi}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Tiempo implementación:</span>
                              <span className="text-white ml-2">{roi.timeframe}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Período de recuperación:</span>
                              <span className="text-white ml-2">{roi.payback}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <h5 className="text-sm font-semibold text-white">Métricas de Productividad:</h5>
                        <ul className="space-y-1.5">
                          {roi.metrics.map((metric, mIndex) => (
                            <li key={mIndex} className="flex items-start gap-2 text-xs text-white/70">
                              <span className="text-vanguard-blue mt-1">•</span>
                              <span>{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-white/80 italic">
                          <span className="font-semibold text-white">Caso real:</span> {roi.caseStudy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Meeting Type */}
          {config.showMeetingType && (
          <div className="space-y-3">
            <Label className="text-white">Tipo de reunión</Label>
            <RadioGroup value={meetingType} onValueChange={(value) => setMeetingType(value as typeof meetingType)}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 bg-white/5">
                <RadioGroupItem value="demo" id="demo" className="border-white/30" />
                <Label htmlFor="demo" className="text-white cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">Demo guiada</div>
                    <div className="text-sm text-white/70">Exploración detallada de la demo</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 bg-white/5">
                <RadioGroupItem value="consultation" id="consultation" className="border-white/30" />
                <Label htmlFor="consultation" className="text-white cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">Consulta</div>
                    <div className="text-sm text-white/70">Resolver dudas y preguntas</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 bg-white/5">
                <RadioGroupItem value="implementation" id="implementation" className="border-white/30" />
                <Label htmlFor="implementation" className="text-white cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">Discutir implementación</div>
                    <div className="text-sm text-white/70">Planificar la integración</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          )}

          {/* Product Type Selection */}
          {config.showProductType && (
          <div className="space-y-2">
            <Label htmlFor="product-type" className="text-white flex items-center gap-2">
              <Package className="h-4 w-4" />
              Tipo de servicio/producto
            </Label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger
                id="product-type"
                className="bg-white/10 border-white/20 text-white"
              >
                <SelectValue placeholder="Selecciona un tipo de servicio/producto" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20 text-white">
                {services.map((service) => (
                  <SelectItem
                    key={service}
                    value={service}
                    className="focus:bg-white/10 focus:text-white"
                  >
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          )}

          {/* Date and Time */}
          {config.showMeetingType && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha preferida
              </Label>
              <Input
                id="date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hora preferida
              </Label>
              <Input
                id="time"
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
          )}

          {/* Access Request Fields - Solo para solicitar acceso adicional */}
          {requestType === "access" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    Nombre <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Nombre del nuevo usuario"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Apellido <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Apellido del nuevo usuario"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Correo electrónico <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="correo@ejemplo.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
          )}

          {/* Chat with Sales Fields - Solo para chat con ventas */}
          {requestType === "sales-chat" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">
                  Asunto <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="Ej: Consulta sobre integración de CRM"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="messageBody" className="text-white">
                  Cuerpo del mensaje <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="messageBody"
                  placeholder="Describe tu consulta o necesidad..."
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                />
              </div>
            </div>
          )}

          {/* Process Flow - Solo para contratos digitales */}
          {requestType === "contracts" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Proceso de Firma Digital</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-vanguard-blue flex items-center justify-center text-white text-sm font-semibold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Autenticación del cliente</h4>
                    <p className="text-sm text-white/70">Verifica que el usuario es quien dice ser (email, 2FA)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-vanguard-blue flex items-center justify-center text-white text-sm font-semibold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Presentación del documento</h4>
                    <p className="text-sm text-white/70">Muestra el contrato de manera clara, permitiendo revisión antes de firmar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-vanguard-blue flex items-center justify-center text-white text-sm font-semibold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Captura de firma</h4>
                    <p className="text-sm text-white/70">El cliente firma en el iframe usando método elegido (dibujo, tipeo, certificado digital)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-vanguard-blue flex items-center justify-center text-white text-sm font-semibold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Confirmación de consentimiento</h4>
                    <p className="text-sm text-white/70">Requiere que acepte los términos antes de la firma final</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-vanguard-blue flex items-center justify-center text-white text-sm font-semibold">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Entrega de documentos</h4>
                    <p className="text-sm text-white/70">Proporciona PDF firmado descargable y envío por email de confirmación</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes - Solo para otros tipos de solicitud (excepto sales-chat, contracts, success-cases y resources) */}
          {requestType !== "sales-chat" && requestType !== "contracts" && requestType !== "success-cases" && requestType !== "resources" && (
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">
                Notas adicionales (opcional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Comparte cualquier información relevante..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
              />
            </div>
          )}

          {/* Upcoming Meetings - Solo para tipos que requieren reunión */}
          {config.showMeetingType && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-3">
                Próximas reuniones
              </p>
              <div className="space-y-2 text-sm text-white/70">
                <p>No tienes reuniones agendadas actualmente.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            Cancelar
          </Button>
          {requestType === "contracts" ? (
            <Button
              asChild
              className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
            >
              <a
                href="https://www.signaturit.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Más información
              </a>
            </Button>
          ) : requestType === "success-cases" ? (
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
            >
              Cerrar
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (requestType === "access" && (!firstName || !lastName || !email)) ||
                (requestType === "sales-chat" && (!subject || !productType || !messageBody)) ||
                (config.showMeetingType && (!preferredDate || !preferredTime)) ||
                (config.showProductType && requestType !== "sales-chat" && !productType)
              }
              className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
            >
              {isSubmitting ? "Enviando..." : requestType === "quote" ? "Solicitar Cotización" : requestType === "access" ? "Solicitar Acceso" : requestType === "resources" ? "Acceder a Recursos" : requestType === "sales-chat" ? "Enviar mensaje" : "Solicitar Reunión"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
