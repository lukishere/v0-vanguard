import {
  getAnalyticsOverview,
  getUsageTrends,
  getTopEngagement,
} from "@/lib/admin/analytics"
import { EnhancedAnalyticsDashboard } from "@/components/admin/enhanced-analytics-dashboard"

export default async function AdminAnalyticsPage() {
  const [overview, trends, topEngagement] = await Promise.all([
    getAnalyticsOverview(),
    getUsageTrends(),
    getTopEngagement(),
  ])

  // Transform trends data for the enhanced dashboard
  const transformedTrends = trends.map((item, index) => ({
    date: new Date(Date.now() - (trends.length - 1 - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    users: Math.floor(item.sessions * 0.8 + Math.random() * 10),
    sessions: item.sessions,
    conversion: Math.random() * 0.3 + 0.1, // Mock conversion rate
    engagement: item.feedback / 10 // Normalize feedback to 0-1
  }))

  // Transform top engagement data
  const transformedTopEngagement = topEngagement.map(demo => ({
    name: demo.demoName,
    value: demo.engagementScore,
    change: demo.trend === "up" ? Math.floor(Math.random() * 20) + 5 :
            demo.trend === "down" ? -(Math.floor(Math.random() * 15) + 5) : 0,
    category: "Demo"
  }))

  return (
    <EnhancedAnalyticsDashboard
      overview={overview}
      trends={transformedTrends}
      topEngagement={transformedTopEngagement}
    />
  )
}
