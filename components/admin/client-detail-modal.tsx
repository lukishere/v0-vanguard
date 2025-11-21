"use client"

import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ClientAccessManager } from "@/components/admin/client-access-manager"
import { SendMessageButton } from "@/components/admin/send-message-button"
import { ClientActivityButton } from "@/components/admin/client-activity-button"
import type { Demo } from "@/lib/demos/types"

interface Client {
  id: string
  name: string
  email: string | null
  metadata: any
  lastActive: string | null
}

interface ClientDetailModalProps {
  client: Client
  demos: Demo[]
  isOpen: boolean
  onClose: () => void
}

export function ClientDetailModal({ client, demos, isOpen, onClose }: ClientDetailModalProps) {
  const isOnline = client.lastActive
    ? (Date.now() - new Date(client.lastActive).getTime()) < 30 * 60 * 1000 // 30 minutos
    : false

  const assignedDemos = client.metadata.demoAccess.map((access: any) => {
    const demo = demos.find((item) => item.id === access.demoId)
    return {
      id: access.demoId,
      name: demo?.name ?? access.demoId,
      expiresAt: access.expiresAt,
      daysRemaining: access.daysRemaining,
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-vanguard-blue/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-vanguard-blue">
                {client.name ? client.name.split(' ')[0]?.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span>{client.name}</span>
                {isOnline && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-sm px-2 py-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse" />
                    Online
                  </Badge>
                )}
              </div>
              <p className="text-sm text-white/70 mt-1">{client.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Info básica */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Última actividad</label>
              <p className="text-sm text-white">
                {client.lastActive
                  ? formatDistanceToNow(new Date(client.lastActive), { locale: es, addSuffix: true })
                  : "Sin registros"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Demos asignadas</label>
              <p className="text-sm text-white">{assignedDemos.length}</p>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex gap-3">
            <ClientActivityButton clientId={client.id} clientName={client.name} />
            <SendMessageButton clientId={client.id} clientName={client.name} />
          </div>

          {/* Gestión de accesos */}
          <ClientAccessManager
            clientId={client.id}
            clientName={client.name}
            demoAccess={client.metadata.demoAccess}
            availableDemos={demos}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
