export type ActivityType =
  | "demo-requested"        // Solicitar acceso a demo disponible
  | "access-additional"     // Solicitar acceso adicional a demo
  | "waitlist-joined"       // Apuntarse a demo en desarrollo
  | "demo-liked"            // Dar like a demo
  | "demo-unliked"          // Quitar like
  | "demo-opened"           // Abrir demo activa
  | "meeting-requested"     // Solicitar reunión/sesión de servicio
  | "chat-opened"           // Abrir chat/consulta
  | "chat-sales"            // Chat con ventas
  | "message-sent"          // Enviar mensaje
  | "service-contracted"    // Solicitar contratación
  | "demo-extended"         // Solicitar extensión
  | "dashboard-activity"    // Actividad general en el dashboard

export interface ClientActivity {
  id: string
  clientId: string
  type: ActivityType
  description: string
  timestamp: string
  metadata?: {
    demoId?: string
    demoName?: string
    requestId?: string
    [key: string]: any
  }
}

// Labels para diferentes tipos de actividad
export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  "demo-requested": "Solicitó acceso a demo",
  "access-additional": "Solicitó acceso adicional",
  "waitlist-joined": "Se apuntó a demo en desarrollo",
  "demo-liked": "Mostró interés en demo",
  "demo-unliked": "Quitó interés de demo",
  "demo-opened": "Abrió demo",
  "meeting-requested": "Solicitó sesión de servicio de producto",
  "chat-opened": "Abrió chat de consultas",
  "chat-sales": "Inició chat con ventas",
  "message-sent": "Envió mensaje",
  "service-contracted": "Solicitó contratación de servicio",
  "demo-extended": "Solicitó extensión de demo",
  "dashboard-activity": "Actividad en el dashboard",
}
