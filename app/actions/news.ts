"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import fs from "fs/promises"
import path from "path"
import { getKvClient, isKvAvailable } from "@/lib/kv"

export interface NewsItem {
  id: string
  type: "noticia" | "evento"
  title: string
  content: string
  author: string
  publishedAt: { seconds: number; nanoseconds: number }
  isActive: boolean
  createdAt: { seconds: number; nanoseconds: number }
  updatedAt: { seconds: number; nanoseconds: number }

  // Campos específicos para eventos
  eventDate?: string
  eventLocation?: string
  eventLink?: string
  eventImage?: string
  eventSummary?: string
  eventDetails?: string
  showInShowcase?: boolean
}

const DATA_DIR = path.join(process.cwd(), ".data")
const NEWS_FILE = path.join(DATA_DIR, "news.json")
const KV_NEWS_KEY = "news:all"

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Ignorar si ya existe
  }
}

/**
 * Load news from KV (production) or filesystem (development fallback)
 */
async function loadNews(): Promise<Map<string, NewsItem>> {
  const kv = getKvClient()

  // Try KV first (production)
  if (kv) {
    try {
      console.log("[News] Attempting to load from KV...")
      const data = await kv.get<Record<string, NewsItem>>(KV_NEWS_KEY)
      if (data) {
        const count = Object.keys(data).length
        console.log(`[News] ✅ Loaded ${count} items from KV`)
        return new Map(Object.entries(data))
      }
      console.log("[News] ⚠️ KV key 'news:all' exists but is empty")
      return new Map()
    } catch (error) {
      console.error("⚠️ [News] Error loading from KV:", error)
      if (error instanceof Error) {
        console.error("   Error message:", error.message)
      }
      // Fall through to filesystem fallback
    }
  } else {
    console.log("[News] ⚠️ KV client not initialized - using filesystem fallback")
  }

  // Fallback to filesystem (development)
  try {
    console.log("[News] Attempting to load from filesystem...")
    const data = await fs.readFile(NEWS_FILE, "utf-8")
    const obj = JSON.parse(data)
    const count = Object.keys(obj).length
    console.log(`[News] ✅ Loaded ${count} items from filesystem`)
    return new Map(Object.entries(obj))
  } catch (error) {
    // File doesn't exist or can't be read - return empty Map
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ [News] Could not load news file:", error instanceof Error ? error.message : String(error))
    } else {
      console.warn("⚠️ [News] Filesystem not available in production")
    }
    return new Map()
  }
}

/**
 * Save news to KV (production) or filesystem (development fallback)
 */
async function saveNews(news: Map<string, NewsItem>) {
  const kv = getKvClient()
  const obj = Object.fromEntries(news)

  // Try KV first (production)
  if (kv) {
    try {
      await kv.set(KV_NEWS_KEY, obj)
      return
    } catch (error) {
      console.error("⚠️ [News] Error saving to KV:", error)
      // Fall through to filesystem fallback
    }
  }

  // Fallback to filesystem (development)
  await ensureDataDir()
  await fs.writeFile(NEWS_FILE, JSON.stringify(obj, null, 2), "utf-8")
}

function createTimestamp() {
  const now = Date.now()
  return {
    seconds: Math.floor(now / 1000),
    nanoseconds: (now % 1000) * 1000000
  }
}

export async function createNews(
  data: {
    type: "noticia" | "evento"
    title: string
    content: string
    author: string
    isActive?: boolean
    eventDate?: string
    eventLocation?: string
    eventLink?: string
    eventImage?: string
    eventSummary?: string
    eventDetails?: string
    showInShowcase?: boolean
  }
) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const news = await loadNews()
    const newsId = `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = createTimestamp()

    const newsItem: NewsItem = {
      id: newsId,
      type: data.type,
      title: data.title,
      content: data.content,
      author: data.author,
      publishedAt: timestamp,
      isActive: data.isActive ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...(data.type === "evento" && {
        eventDate: data.eventDate,
        eventLocation: data.eventLocation,
        eventLink: data.eventLink,
        eventImage: data.eventImage,
        eventSummary: data.eventSummary,
        eventDetails: data.eventDetails,
        showInShowcase: data.showInShowcase ?? false,
      })
    }

    news.set(newsId, newsItem)
    await saveNews(news)

    console.log(`📰 [News] ${data.type === "evento" ? "Evento" : "Noticia"} creada:`, {
      newsId,
      title: data.title,
      author: data.author,
      isActive: data.isActive,
    })

    revalidatePath("/admin/noticias")
    revalidatePath("/dashboard")
    revalidatePath("/events")

    return { success: true, newsId }
  } catch (error) {
    console.error("Error al crear noticia/evento:", error)
    return { success: false, error: "Error al crear la noticia/evento" }
  }
}

export async function updateNews(
  newsId: string,
  data: {
    title: string
    content: string
    author: string
    isActive: boolean
    eventDate?: string
    eventLocation?: string
    eventLink?: string
    eventImage?: string
    eventSummary?: string
    eventDetails?: string
    showInShowcase?: boolean
  }
) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const news = await loadNews()
    const newsItem = news.get(newsId)

    if (!newsItem) {
      return { success: false, error: "Noticia no encontrada" }
    }

    const updatedItem: NewsItem = {
      ...newsItem,
      title: data.title,
      content: data.content,
      author: data.author,
      isActive: data.isActive,
      updatedAt: createTimestamp(),
      ...(newsItem.type === "evento" && {
        eventDate: data.eventDate,
        eventLocation: data.eventLocation,
        eventLink: data.eventLink,
        eventImage: data.eventImage,
        eventSummary: data.eventSummary,
        eventDetails: data.eventDetails,
        showInShowcase: data.showInShowcase,
      })
    }

    news.set(newsId, updatedItem)
    await saveNews(news)

    console.log("✓ [News] Noticia/Evento actualizada:", newsId)

    revalidatePath("/admin/noticias")
    revalidatePath("/dashboard")
    revalidatePath("/events")

    return { success: true }
  } catch (error) {
    console.error("Error al actualizar noticia/evento:", error)
    return { success: false, error: "Error al actualizar la noticia/evento" }
  }
}

export async function deleteNews(newsId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const news = await loadNews()
    const deleted = news.delete(newsId)

    if (!deleted) {
      return { success: false, error: "Noticia no encontrada" }
    }

    await saveNews(news)

    console.log("🗑️ [News] Noticia/Evento eliminada:", newsId)

    revalidatePath("/admin/noticias")
    revalidatePath("/dashboard")
    revalidatePath("/events")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar noticia/evento:", error)
    return { success: false, error: "Error al eliminar noticia/evento" }
  }
}

export async function getAllNews(): Promise<NewsItem[]> {
  const news = await loadNews()
  return Array.from(news.values())
    .sort((a, b) => b.publishedAt.seconds - a.publishedAt.seconds)
}

export async function getActiveNews(): Promise<NewsItem[]> {
  const news = await getAllNews()
  return news.filter(item => item.isActive)
}
