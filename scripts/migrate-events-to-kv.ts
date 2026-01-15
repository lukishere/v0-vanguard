/**
 * Script para migrar eventos/noticias desde filesystem local a Vercel KV
 *
 * Uso:
 * 1. Asegúrate de tener las variables de entorno configuradas en .env.local:
 *    - KV_REST_API_URL
 *    - KV_REST_API_TOKEN
 *
 * 2. Ejecuta: pnpm tsx scripts/migrate-events-to-kv.ts
 */

import { Redis } from "@upstash/redis"
import fs from "fs/promises"
import path from "path"

// Load environment variables from .env.local
async function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env.local")
    const envContent = await fs.readFile(envPath, "utf-8")
    const envLines = envContent.split("\n")

    for (const line of envLines) {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=")
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim()
          process.env[key.trim()] = value
        }
      }
    }
  } catch (error) {
    // .env.local may not exist, that's ok
  }
}

const DATA_DIR = path.join(process.cwd(), ".data")
const NEWS_FILE = path.join(DATA_DIR, "news.json")
const KV_NEWS_KEY = "news:all"

async function migrateEvents() {
  try {
    // Load environment variables first
    await loadEnvFile()

    console.log("🚀 Starting migration to KV...\n")

    // 1. Leer datos locales
    let localData: Record<string, any> = {}
    try {
      const fileContent = await fs.readFile(NEWS_FILE, "utf-8")
      localData = JSON.parse(fileContent)
      const itemCount = Object.keys(localData).length
      console.log(`📦 Found ${itemCount} items in local file (${NEWS_FILE})`)

      // Mostrar resumen
      const events = Object.values(localData).filter((item: any) => item.type === "evento")
      const news = Object.values(localData).filter((item: any) => item.type === "noticia")
      const activeEvents = events.filter((item: any) => item.isActive)

      console.log(`   - Eventos: ${events.length} (${activeEvents.length} activos)`)
      console.log(`   - Noticias: ${news.length}\n`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(`⚠️  No local news.json found at ${NEWS_FILE}`)
        console.log("   Starting with empty KV storage\n")
      } else {
        throw error
      }
    }

    // 2. Verificar variables de entorno
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      console.error("❌ Missing environment variables!")
      console.error("   Required: KV_REST_API_URL (or UPSTASH_REDIS_REST_URL)")
      console.error("   Required: KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_TOKEN)")
      console.error("\n   Make sure they are set in .env.local")
      process.exit(1)
    }

    console.log("✅ Environment variables found")
    console.log(`   URL: ${url.substring(0, 30)}...\n`)

    // 3. Conectar a KV
    console.log("🔌 Connecting to KV...")
    // Create Redis client directly with the variables we found
    // This works with both KV_REST_API_URL and UPSTASH_REDIS_REST_URL naming conventions
    const redis = new Redis({
      url: url,
      token: token,
    })

    // 4. Verificar conexión
    await redis.ping()
    console.log("✅ Connected to KV successfully\n")

    // 5. Verificar datos existentes en KV
    const existingData = await redis.get<Record<string, any>>(KV_NEWS_KEY)
    if (existingData && Object.keys(existingData).length > 0) {
      const existingCount = Object.keys(existingData).length
      console.log(`⚠️  KV already contains ${existingCount} items`)
      console.log("   This migration will REPLACE existing data in KV")
      console.log("   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n")
      await new Promise(resolve => setTimeout(resolve, 3000))
    }

    // 6. Guardar en KV
    if (Object.keys(localData).length > 0) {
      console.log("💾 Saving data to KV...")
      await redis.set(KV_NEWS_KEY, localData)
      console.log(`✅ Migrated ${Object.keys(localData).length} items to KV\n`)
    } else {
      // Inicializar con objeto vacío
      console.log("💾 Initializing empty KV storage...")
      await redis.set(KV_NEWS_KEY, {})
      console.log("✅ Initialized empty KV storage\n")
    }

    // 7. Verificar
    console.log("🔍 Verifying migration...")
    const saved = await redis.get<Record<string, any>>(KV_NEWS_KEY)
    const savedCount = saved ? Object.keys(saved).length : 0
    console.log(`✅ Verified: ${savedCount} items in KV`)

    // 8. Mostrar resumen final
    if (saved) {
      const events = Object.values(saved).filter(
        (item: any) => item.type === "evento" && item.isActive
      )
      const allEvents = Object.values(saved).filter(
        (item: any) => item.type === "evento"
      )
      const news = Object.values(saved).filter(
        (item: any) => item.type === "noticia"
      )

      console.log("\n📊 Summary:")
      console.log(`   - Total items: ${savedCount}`)
      console.log(`   - Eventos: ${allEvents.length} (${events.length} activos)`)
      console.log(`   - Noticias: ${news.length}`)
    }

    console.log("\n🎉 Migration completed successfully!")
    console.log("\n📝 Next steps:")
    console.log("   1. Verify in Vercel Dashboard → Storage → Your KV database")
    console.log("   2. Check that key 'news:all' exists")
    console.log("   3. Test in production: /events should show your events")
    console.log("   4. Create new events from /admin/noticias to test KV writes\n")

  } catch (error) {
    console.error("\n❌ Migration failed!")
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

migrateEvents()
