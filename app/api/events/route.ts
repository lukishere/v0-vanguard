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
    // In production (Vercel), filesystem may be read-only or ephemeral
    // Return empty array instead of error to prevent page crashes
    console.error("Error al obtener eventos:", error)
    console.warn("⚠️ [Events API] Filesystem may not be available in production. Returning empty array.")

    // Return empty array instead of error to allow page to render
    return NextResponse.json([])
  }
}
