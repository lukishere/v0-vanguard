import { getAllServiceRequests } from "@/app/actions/service-requests"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Clock, User, Mail, Calendar, MessageSquare, Phone } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = "force-dynamic"

export default async function AdminServiciosPage() {
  const requests = await getAllServiceRequests()

  const contractRequests = requests.filter(r => r.type === "contract")
  const extensionRequests = requests.filter(r => r.type === "extend")

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-vanguard-blue to-blue-300 bg-clip-text text-transparent">
            Solicitudes de Servicio
          </h1>
          <p className="text-white/70">
            Gestiona las solicitudes de contratación y extensión de demos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Rocket className="h-5 w-5 text-vanguard-blue" />
                Contrataciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-vanguard-blue">{contractRequests.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" />
                Extensiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-amber-400">{extensionRequests.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Total Solicitudes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{requests.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Solicitudes de Contratación */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-vanguard-blue" />
            <h2 className="text-2xl font-bold">Solicitudes de Contratación</h2>
            <Badge variant="secondary" className="ml-auto">{contractRequests.length}</Badge>
          </div>

          {contractRequests.length === 0 ? (
            <Card className="bg-slate-800/50 border-white/10">
              <CardContent className="py-12 text-center text-white/50">
                No hay solicitudes de contratación pendientes
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {contractRequests.map((request) => (
                <Card key={request.id} className="bg-slate-800/50 border-white/10 hover:border-vanguard-blue/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-white flex items-center gap-2">
                          <User className="h-5 w-5 text-vanguard-blue" />
                          {request.clientName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-white/70">
                          <Mail className="h-4 w-4" />
                          {request.clientEmail}
                        </CardDescription>
                      </div>
                      <Badge className="bg-vanguard-blue text-white">
                        <Rocket className="h-3 w-3 mr-1" />
                        Contratación
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-white/70 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-white/50 mb-1">Mensaje del cliente:</p>
                          <p className="text-white whitespace-pre-wrap">{request.message}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(request.requestedAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                    </div>

                    {/* Información de contacto extraída */}
                    {request.message && (request.message.includes("Email") || request.message.includes("Teléfono")) && (
                      <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
                        <div className="flex items-center gap-2 text-sm text-blue-300">
                          {request.message && request.message.includes("Email") && <Mail className="h-4 w-4" />}
                          {request.message && request.message.includes("Teléfono") && <Phone className="h-4 w-4" />}
                          <span className="font-medium">
                            {request.message ? (request.message.split("Preferencia de contacto: ")[1] || "Contactar por email") : "Contactar por email"}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Solicitudes de Extensión */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-amber-400" />
            <h2 className="text-2xl font-bold">Solicitudes de Extensión</h2>
            <Badge variant="secondary" className="ml-auto">{extensionRequests.length}</Badge>
          </div>

          {extensionRequests.length === 0 ? (
            <Card className="bg-slate-800/50 border-white/10">
              <CardContent className="py-12 text-center text-white/50">
                No hay solicitudes de extensión pendientes
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {extensionRequests.map((request) => (
                <Card key={request.id} className="bg-slate-800/50 border-white/10 hover:border-amber-400/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-white flex items-center gap-2">
                          <User className="h-5 w-5 text-amber-400" />
                          {request.clientName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-white/70">
                          <Mail className="h-4 w-4" />
                          {request.clientEmail}
                        </CardDescription>
                      </div>
                      <Badge className="bg-amber-500 text-white">
                        <Clock className="h-3 w-3 mr-1" />
                        Extensión
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Demo Info */}
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
                      <p className="text-sm text-amber-200/70 mb-1">Demo:</p>
                      <p className="font-semibold text-amber-100 mb-2">{request.demoName}</p>
                      {request.currentExpiration && (
                        <p className="text-xs text-amber-200/50">
                          Expira: {format(new Date(request.currentExpiration), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                      )}
                    </div>

                    {/* Razón */}
                    {request.message && request.message !== "Solicitud de extensión de demo" && (
                      <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-white/70 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-white/50 mb-1">Razón:</p>
                            <p className="text-white whitespace-pre-wrap">{request.message}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(request.requestedAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
