export type DemoStatus = "active" | "in-development" | "available" | "expired"
export type RequestStatus = "pending" | "approved" | "rejected" | "reviewing"
export type DemoType = "bot" | "dashboard" | "api" | "guided"
export type ActivityType = "demo-opened" | "feedback-sent" | "meeting-requested" | "demo-expired" | "demo-requested"

export interface Demo {
  id: string
  name: string
  summary: string
  description: string
  status: DemoStatus
  tags: string[]
  icon?: string
  
  // Acceso y tiempo
  assignedAt?: string
  expiresAt?: string
  daysRemaining?: number
  usageDays?: number
  totalDays?: number
  
  // Interactividad
  interactiveUrl?: string
  demoType: DemoType
  
  // Métricas
  sessionsCount?: number
  lastUsedAt?: string
  feedbackCount?: number
  
  // Progreso (para demos en desarrollo)
  progress?: number
  milestones?: Array<{
    label: string
    completed: boolean
    date?: string
  }>
  estimatedDelivery?: string
  
  // Información adicional
  nextStep?: string
  cta?: string
}

export interface ClientDemoAccess {
  demoId: string
  assignedAt: string
  expiresAt: string
  daysRemaining: number
  usageDays: number
  totalDays: number
  sessionsCount: number
  lastUsedAt?: string
}

export interface Feedback {
  id: string
  demoId: string
  rating: number
  comment: string
  suggestions?: string
  createdAt: string
  respondedAt?: string
  adminResponse?: string
}

export interface MeetingRequest {
  id: string
  demoId?: string
  type: "demo" | "consultation" | "implementation"
  preferredDate: string
  preferredTime: string
  notes?: string
  status: RequestStatus
  createdAt: string
  scheduledAt?: string
  adminNote?: string
}

export interface ClientActivity {
  id: string
  type: ActivityType
  demoId?: string
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface DemoRequest {
  id: string
  demoId: string
  userId: string
  status: RequestStatus
  createdAt: string
  adminNote?: string
}

