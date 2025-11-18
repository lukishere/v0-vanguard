import { Realtime, InferRealtimeEvents } from "@upstash/realtime"
import { z } from "zod"

// Schema for dashboard realtime events
const dashboardSchema = {
  dashboard: z.object({
    metrics: z.array(z.object({
      title: z.string(),
      value: z.string(),
      helperText: z.string().optional(),
      change: z.object({
        value: z.number(),
        description: z.string().optional(),
      }).optional(),
      positive: z.boolean().optional(),
      icon: z.string(),
      target: z.number().optional(),
      status: z.enum(["normal", "warning", "critical", "excellent"]).optional(),
      actionRequired: z.boolean().optional(),
      actionLabel: z.string().optional(),
    })),
    timestamp: z.string(),
  }),
  // System status events
  system: z.object({
    status: z.enum(["online", "offline", "maintenance"]),
    message: z.string().optional(),
    timestamp: z.string(),
  }),
}

// Simplified realtime system to prevent infinite loops
class SimpleRealtime {
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  constructor() {
    console.log("SimpleRealtime initialized")
  }

  // Subscribe to an event
  subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event)
      if (eventListeners) {
        eventListeners.delete(callback)
        if (eventListeners.size === 0) {
          this.listeners.delete(event)
        }
      }
    }
  }

  // Emit an event
  emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in realtime listener for ${event}:`, error)
        }
      })
    }
  }

  dashboard = {
    update: {
      emit: (data: any) => {
        console.log("SimpleRealtime emit dashboard update:", data)
        this.emit('dashboard-update', data)
        return Promise.resolve()
      }
    }
  }

  system = {
    status: {
      emit: (data: any) => {
        console.log("SimpleRealtime emit system status:", data)
        this.emit('system-status', data)
        return Promise.resolve()
      }
    }
  }
}

export const realtime = new SimpleRealtime()

// Type inference for type safety
export type RealtimeEvents = {
  dashboard: {
    update: z.infer<typeof dashboardSchema.dashboard>
  }
  system: {
    status: z.infer<typeof dashboardSchema.system>
  }
}
