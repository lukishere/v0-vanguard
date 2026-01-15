import { NextResponse } from "next/server"
import { getActiveNews } from "@/app/actions/news"

/**
 * Endpoint simple para verificar qué retorna /api/events
 */
export async function GET() {
  try {
    const allNews = await getActiveNews()
    const events = allNews.filter(item => item.type === "evento" && item.isActive)

    return NextResponse.json({
      success: true,
      total_news: allNews.length,
      events_count: events.length,
      events: events,
      message: `Found ${events.length} active events`
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      events: []
    }, { status: 500 })
  }
}
