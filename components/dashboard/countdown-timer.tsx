"use client"

import { Clock, AlertTriangle } from "lucide-react"
import { formatDaysRemaining, getExpirationStatus } from "@/lib/demos/utils"
import { Badge } from "@/components/ui/badge"

interface CountdownTimerProps {
  daysRemaining: number | null
  className?: string
}

export function CountdownTimer({ daysRemaining, className }: CountdownTimerProps) {
  if (daysRemaining === null) return null

  const status = getExpirationStatus(daysRemaining)
  
  const statusConfig = {
    safe: {
      bg: "bg-white/10",
      text: "text-white/80",
      icon: Clock,
    },
    warning: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      icon: AlertTriangle,
    },
    critical: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      icon: AlertTriangle,
    },
    expired: {
      bg: "bg-red-500/30",
      text: "text-red-500",
      icon: AlertTriangle,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge className={`${config.bg} ${config.text} border-0 px-4 py-2 rounded-full flex items-center gap-2 ${className}`}>
      <Icon className="h-4 w-4" />
      <span className="font-medium">
        {formatDaysRemaining(daysRemaining)}
      </span>
    </Badge>
  )
}

