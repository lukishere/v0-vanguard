export function trackEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return

  const body = JSON.stringify({
    event,
    payload,
    timestamp: Date.now(),
  })

  try {
    if ("sendBeacon" in navigator) {
      navigator.sendBeacon("/api/analytics/events", body)
    } else {
      void fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      })
    }
  } catch (error) {
    console.error("Failed to track event", error)
  }
}


