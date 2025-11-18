export interface AnalyticsOverview {
  totalClients: number
  activeClients: number
  demosAssigned: number
  avgSessionsPerClient: number
  conversionRate: number
  avgFeedbackScore: number
}

export interface UsageTrend {
  label: string
  sessions: number
  feedback: number
  meetings: number
}

export interface TopEngagement {
  demoId: string
  demoName: string
  sessions: number
  engagementScore: number
  trend: "up" | "down" | "stable"
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  // TODO: Integrar con base de datos/telemetría real
  return {
    totalClients: 24,
    activeClients: 18,
    demosAssigned: 32,
    avgSessionsPerClient: 4.6,
    conversionRate: 0.37,
    avgFeedbackScore: 4.7,
  }
}

export async function getUsageTrends(): Promise<UsageTrend[]> {
  return [
    { label: "Semana 1", sessions: 52, feedback: 14, meetings: 8 },
    { label: "Semana 2", sessions: 60, feedback: 18, meetings: 10 },
    { label: "Semana 3", sessions: 55, feedback: 16, meetings: 9 },
    { label: "Semana 4", sessions: 68, feedback: 22, meetings: 12 },
  ]
}

export async function getTopEngagement(): Promise<TopEngagement[]> {
  return [
    {
      demoId: "demo-1",
      demoName: "Vanguard Copilot",
      sessions: 45,
      engagementScore: 87,
      trend: "up",
    },
    {
      demoId: "demo-2",
      demoName: "Insight 360",
      sessions: 38,
      engagementScore: 82,
      trend: "up",
    },
    {
      demoId: "demo-3",
      demoName: "Automation Hub",
      sessions: 32,
      engagementScore: 75,
      trend: "stable",
    },
    {
      demoId: "demo-4",
      demoName: "Contract Flow",
      sessions: 28,
      engagementScore: 68,
      trend: "down",
    },
  ]
}
