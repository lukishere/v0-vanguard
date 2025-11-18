import { Clock, Check, X, User, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPendingRequests, getAllRequests } from "@/app/actions/demo-requests"
import { ApproveRequestButton } from "@/components/admin/approve-request-button"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default async function AdminRequestsPage() {
  const pendingRequests = await getPendingRequests()
  const allRequests = await getAllRequests()
  const processedRequests = allRequests.filter(r => r.status !== "pending")

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold text-white">Solicitudes de Demos</h2>
        <p className="text-sm text-white/60">
          Gestiona las solicitudes de acceso a demos de los clientes.
        </p>
      </header>

      {/* Pendientes */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">
            Pendientes <Badge variant="secondary" className="ml-2 bg-amber-500/20 text-amber-300">{pendingRequests.length}</Badge>
          </h3>
        </div>

        {pendingRequests.length === 0 ? (
          <Card className="border-white/10 bg-white/5 text-white">
            <CardContent className="py-8 text-center text-white/60">
              No hay solicitudes pendientes.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-white/10 bg-slate-900/40 text-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                        <User className="h-4 w-4 text-vanguard-300" />
                        {request.clientName || request.clientId}
                      </CardTitle>
                      <p className="text-sm text-white/70">
                        Solicita acceso a: <strong className="text-white">{request.demoName}</strong>
                      </p>
                      <p className="text-xs text-white/50">
                        Hace {formatDistanceToNow(new Date(request.requestedAt), { locale: es })}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-300">
                      Pendiente
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.message && (
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="flex items-start gap-2 text-sm text-white/70">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-vanguard-300" />
                        <p>{request.message}</p>
                      </div>
                    </div>
                  )}

                  <ApproveRequestButton request={request} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Historial */}
      {processedRequests.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Historial
          </h3>

          <div className="space-y-3">
            {processedRequests.slice(0, 10).map((request) => (
              <Card key={request.id} className="border-white/10 bg-white/5 text-white">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {request.clientName || request.clientId} → {request.demoName}
                      </p>
                      <p className="text-xs text-white/50">
                        {formatDistanceToNow(new Date(request.processedAt || request.requestedAt), { locale: es })}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        request.status === "approved"
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : "border-rose-500/40 bg-rose-500/10 text-rose-300"
                      }
                    >
                      {request.status === "approved" ? (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          Aprobada
                        </>
                      ) : (
                        <>
                          <X className="mr-1 h-3 w-3" />
                          Rechazada
                        </>
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
