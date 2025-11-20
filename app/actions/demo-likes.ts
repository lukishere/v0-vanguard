"use server"

import { auth } from "@clerk/nextjs/server"
import fs from "fs/promises"
import path from "path"

export interface DemoLike {
  demoId: string
  clientId: string
  likedAt: string
}

export interface DemoLikeStats {
  demoId: string
  totalLikes: number
  likedByCurrentUser: boolean
}

const DATA_DIR = path.join(process.cwd(), ".data")
const LIKES_FILE = path.join(DATA_DIR, "demo-likes.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Ignorar si ya existe
  }
}

async function loadLikes(): Promise<DemoLike[]> {
  try {
    const data = await fs.readFile(LIKES_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveLikes(likes: DemoLike[]) {
  await ensureDataDir()
  await fs.writeFile(LIKES_FILE, JSON.stringify(likes, null, 2), "utf-8")
}

// Dar like a una demo
export async function toggleDemoLike(demoId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const likes = await loadLikes()
    const existingLikeIndex = likes.findIndex(
      like => like.demoId === demoId && like.clientId === userId
    )

    if (existingLikeIndex >= 0) {
      // Ya tiene like, removerlo (unlike)
      likes.splice(existingLikeIndex, 1)
      await saveLikes(likes)

      console.log("👎 [Likes] Unlike registrado:", {
        demoId,
        clientId: userId,
      })

      return { success: true, liked: false }
    } else {
      // No tiene like, agregarlo
      const newLike: DemoLike = {
        demoId,
        clientId: userId,
        likedAt: new Date().toISOString(),
      }

      likes.push(newLike)
      await saveLikes(likes)

      console.log("👍 [Likes] Like registrado:", {
        demoId,
        clientId: userId,
      })

      return { success: true, liked: true }
    }
  } catch (error) {
    console.error("Error al toggle like:", error)
    return { success: false, error: "Error al procesar el like" }
  }
}

// Obtener estadísticas de likes para una demo
export async function getDemoLikeStats(demoId: string): Promise<DemoLikeStats> {
  const { userId } = await auth()
  const likes = await loadLikes()
  const demoLikes = likes.filter(like => like.demoId === demoId)

  return {
    demoId,
    totalLikes: demoLikes.length,
    likedByCurrentUser: userId ? demoLikes.some(like => like.clientId === userId) : false,
  }
}

// Obtener todas las estadísticas de likes (para admin)
export async function getAllDemoLikes(): Promise<Record<string, number>> {
  const likes = await loadLikes()
  const stats: Record<string, number> = {}

  likes.forEach(like => {
    stats[like.demoId] = (stats[like.demoId] || 0) + 1
  })

  return stats
}

// Obtener demos más populares
export async function getMostLikedDemos(limit: number = 10) {
  const stats = await getAllDemoLikes()
  const sorted = Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)

  return sorted.map(([demoId, likes]) => ({ demoId, likes }))
}
