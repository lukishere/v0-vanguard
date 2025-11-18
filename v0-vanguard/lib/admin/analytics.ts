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
  trend: "up" | "down" | "steady"
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
      demoId: "vanguard-copilot",
      demoName: "Vanguard Copilot",
      sessions: 128,
      engagementScore: 92,
      trend: "up",
    },
    {
      demoId: "insights360",
      demoName: "Insights 360",
      sessions: 96,
      engagementScore: 88,
      trend: "steady",
    },
    {
      demoId: "guardian-ai",
      demoName: "Guardian AI",
      sessions: 64,
      engagementScore: 75,
      trend: "up",
    },
    {
      demoId: "data-pipeline-pro",
      demoName: "Data Pipeline Pro",
      sessions: 41,
      engagementScore: 68,
      trend: "down",
    },
  ]
}


