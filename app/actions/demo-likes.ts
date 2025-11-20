"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"

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

// Toggle like usando Clerk metadata
export async function toggleDemoLike(demoId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const metadata = (user.publicMetadata || {}) as any
    const likedDemos = (metadata.likedDemos || []) as string[]

    const isLiked = likedDemos.includes(demoId)
    const updatedLikes = isLiked
      ? likedDemos.filter((id: string) => id !== demoId)
      : [...likedDemos, demoId]

    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        likedDemos: updatedLikes,
      },
    })

    console.log(isLiked ? "👎 [Likes] Unlike registrado:" : "👍 [Likes] Like registrado:", {
      demoId,
      clientId: userId,
    })

    return { success: true, liked: !isLiked }
  } catch (error) {
    console.error("Error al toggle like:", error)
    return { success: false, error: "Error al procesar el like" }
  }
}

// Obtener estadísticas de likes para una demo
export async function getDemoLikeStats(demoId: string): Promise<DemoLikeStats> {
  const { userId } = await auth()

  try {
    const clerk = await clerkClient()

    // Get current user's like status
    let likedByCurrentUser = false
    if (userId) {
      const user = await clerk.users.getUser(userId)
      const metadata = (user.publicMetadata || {}) as any
      const likedDemos = (metadata.likedDemos || []) as string[]
      likedByCurrentUser = likedDemos.includes(demoId)
    }

    // Count total likes for this demo across all users
    const users = await clerk.users.getUserList({ limit: 500 })
    let totalLikes = 0

    for (const user of users.data) {
      const metadata = (user.publicMetadata || {}) as any
      const likedDemos = (metadata.likedDemos || []) as string[]
      if (likedDemos.includes(demoId)) {
        totalLikes++
      }
    }

    return {
      demoId,
      totalLikes,
      likedByCurrentUser,
    }
  } catch (error) {
    console.error("Error getting demo like stats:", error)
    return {
      demoId,
      totalLikes: 0,
      likedByCurrentUser: false,
    }
  }
}

// Obtener todas las estadísticas de likes (para admin)
export async function getAllDemoLikes(): Promise<Record<string, number>> {
  try {
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({ limit: 500 })
    const stats: Record<string, number> = {}

    for (const user of users.data) {
      const metadata = (user.publicMetadata || {}) as any
      const likedDemos = (metadata.likedDemos || []) as string[]

      for (const demoId of likedDemos) {
        stats[demoId] = (stats[demoId] || 0) + 1
      }
    }

    return stats
  } catch (error) {
    console.error("Error getting all demo likes:", error)
    return {}
  }
}

// Obtener demos más populares
export async function getMostLikedDemos(limit: number = 10) {
  const stats = await getAllDemoLikes()
  const sorted = Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)

  return sorted.map(([demoId, likes]) => ({ demoId, likes }))
}
