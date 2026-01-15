import { NextResponse } from "next/server"
import { getActiveNews } from "@/app/actions/news"

export async function GET() {
  try {
    // Get all active news items (public endpoint, no auth required)
    const allNews = await getActiveNews()

    // Filter only events
    const events = allNews.filter(item => item.type === "evento" && item.isActive)

    // Log for debugging
    console.log(`[Events API] Loaded ${allNews.length} active news items, ${events.length} active events`)

    return NextResponse.json(events)
  } catch (error) {
    // In production (Vercel), filesystem may be read-only or ephemeral
    // Return empty array instead of error to prevent page crashes
    console.error("❌ [Events API] Error al obtener eventos:", error)
    if (error instanceof Error) {
      console.error("   Error message:", error.message)
      console.error("   Stack:", error.stack)
    }
    console.warn("⚠️ [Events API] Filesystem may not be available in production. Returning empty array.")

    // Return empty array instead of error to allow page to render
    return NextResponse.json([])
  }
}
