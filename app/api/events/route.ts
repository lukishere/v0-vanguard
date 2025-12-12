import { NextResponse } from "next/server"
import { getActiveNews } from "@/app/actions/news"

export async function GET() {
  try {
    // Get all active news items (public endpoint, no auth required)
    const allNews = await getActiveNews()

    // Filter only events
    const events = allNews.filter(item => item.type === "evento" && item.isActive)

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error al obtener eventos:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

