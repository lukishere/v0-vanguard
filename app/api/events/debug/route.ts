import { NextResponse } from "next/server"
import { getKvClient } from "@/lib/kv"
import { getActiveNews, getAllNews } from "@/app/actions/news"

/**
 * Endpoint temporal de diagnóstico para verificar el estado de KV y eventos
 * DELETE este archivo después de resolver el problema
 */
export async function GET() {
  const debug: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }

  try {
    // 1. Verificar variables de entorno
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

    debug.env_vars = {
      KV_REST_API_URL: kvUrl ? `${kvUrl.substring(0, 30)}...` : "NOT SET",
      KV_REST_API_TOKEN: kvToken ? `${kvToken.substring(0, 20)}...` : "NOT SET",
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? "SET" : "NOT SET",
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? "SET" : "NOT SET",
    }

    // 2. Verificar cliente KV
    const kv = getKvClient()
    debug.kv_client = kv ? "INITIALIZED" : "NOT INITIALIZED"

    if (kv) {
      try {
        // 3. Probar conexión
        const pingResult = await kv.ping()
        debug.kv_connection = {
          status: "CONNECTED",
          ping: pingResult,
        }

        // 4. Verificar datos en KV
        const kvData = await kv.get("news:all")
        if (kvData) {
          const dataObj = kvData as Record<string, any>
          const count = Object.keys(dataObj).length
          const events = Object.values(dataObj).filter((item: any) => item.type === "evento")
          const activeEvents = events.filter((item: any) => item.isActive)

          debug.kv_data = {
            status: "FOUND",
            total_items: count,
            total_events: events.length,
            active_events: activeEvents.length,
            event_ids: activeEvents.map((e: any) => e.id),
          }
        } else {
          debug.kv_data = {
            status: "EMPTY",
            message: "Key 'news:all' exists but is null/empty",
          }
        }
      } catch (kvError) {
        debug.kv_connection = {
          status: "ERROR",
          error: kvError instanceof Error ? kvError.message : String(kvError),
        }
      }
    }

    // 5. Probar getActiveNews
    try {
      const allNews = await getAllNews()
      const activeNews = await getActiveNews()
      const events = activeNews.filter((item) => item.type === "evento" && item.isActive)

      debug.api_functions = {
        getAllNews: {
          count: allNews.length,
          events: allNews.filter((item) => item.type === "evento").length,
        },
        getActiveNews: {
          count: activeNews.length,
          events: events.length,
          event_titles: events.map((e) => e.title),
        },
      }
    } catch (apiError) {
      debug.api_functions = {
        error: apiError instanceof Error ? apiError.message : String(apiError),
        stack: apiError instanceof Error ? apiError.stack : undefined,
      }
    }

    debug.status = "SUCCESS"
    return NextResponse.json(debug, { status: 200 })
  } catch (error) {
    debug.status = "ERROR"
    debug.error = error instanceof Error ? error.message : String(error)
    debug.stack = error instanceof Error ? error.stack : undefined
    return NextResponse.json(debug, { status: 500 })
  }
}
