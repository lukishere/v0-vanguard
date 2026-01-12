/**
 * Script para verificar que KV está configurado correctamente
 *
 * Uso: pnpm tsx scripts/test-kv.ts
 */

import { getKvClient } from "@/lib/kv"

async function testKV() {
  console.log("🧪 Testing KV connection...\n")

  // Verificar variables de entorno
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    console.error("❌ KV client not initialized")
    console.error("\n   Missing environment variables:")
    if (!url) console.error("   - KV_REST_API_URL (or UPSTASH_REDIS_REST_URL)")
    if (!token) console.error("   - KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_TOKEN)")
    console.error("\n   Make sure they are set in .env.local")
    process.exit(1)
  }

  console.log("✅ Environment variables found")
  console.log(`   URL: ${url.substring(0, 40)}...`)
  console.log(`   Token: ${token.substring(0, 20)}...\n`)

  const kv = getKvClient()

  if (!kv) {
    console.error("❌ Failed to initialize KV client")
    console.error("   Check your environment variables and try again")
    process.exit(1)
  }

  try {
    console.log("🔌 Testing connection...")
    const pingResult = await kv.ping()
    console.log(`✅ KV connection successful! (ping: ${pingResult})\n`)

    console.log("📖 Reading 'news:all' from KV...")
    const data = await kv.get("news:all")

    if (data) {
      const count = Object.keys(data as any).length
      console.log(`✅ Found ${count} items in KV\n`)

      // Mostrar resumen
      const items = data as Record<string, any>
      const events = Object.values(items).filter((item: any) => item.type === "evento")
      const activeEvents = events.filter((item: any) => item.isActive)
      const news = Object.values(items).filter((item: any) => item.type === "noticia")

      console.log("📊 Summary:")
      console.log(`   - Total items: ${count}`)
      console.log(`   - Eventos: ${events.length} (${activeEvents.length} activos)`)
      console.log(`   - Noticias: ${news.length}`)

      if (activeEvents.length > 0) {
        console.log("\n📅 Active events:")
        activeEvents.forEach((event: any) => {
          console.log(`   - ${event.title} (${event.eventDate || 'No date'})`)
        })
      }
    } else {
      console.log("ℹ️  KV is empty (no events/news yet)")
      console.log("   Run migration script or create events from /admin/noticias")
    }

    console.log("\n✅ KV test completed successfully!")

  } catch (error) {
    console.error("\n❌ KV test failed!")
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
      if (error.stack) {
        console.error("\n   Stack trace:")
        console.error(error.stack)
      }
    } else {
      console.error("   Unknown error:", error)
    }
    process.exit(1)
  }
}

testKV()
