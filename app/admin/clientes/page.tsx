import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientTableWrapper } from "@/components/admin/client-table-wrapper"

// Force dynamic rendering since this page uses server-side authentication
export const dynamic = 'force-dynamic'

export default function AdminClientsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Gestión de clientes</h2>
        <p className="text-sm text-white/60">
          Asigna o revoca acceso a demos, revisa su actividad reciente y controla la experiencia del portal de clientes.
        </p>
      </header>

      <Card className="border-gray-200 bg-white/80 text-gray-900 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users className="h-5 w-5 text-vanguard-blue" />
            Clientes activos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ClientTableWrapper />
        </CardContent>
      </Card>
    </div>
  )
}
