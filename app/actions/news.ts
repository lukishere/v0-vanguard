"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import fs from "fs/promises"
import path from "path"

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

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Ignorar si ya existe
  }
}

async function loadNews(): Promise<Map<string, NewsItem>> {
  try {
    const data = await fs.readFile(NEWS_FILE, "utf-8")
    const obj = JSON.parse(data)
    return new Map(Object.entries(obj))
  } catch (error) {
    return new Map()
  }
}

async function saveNews(news: Map<string, NewsItem>) {
  await ensureDataDir()
  const obj = Object.fromEntries(news)
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
