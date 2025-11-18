import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getClientMessages, getUnreadCount } from "@/app/actions/messages"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const messages = await getClientMessages(userId)
    const unreadCount = await getUnreadCount(userId)

    return NextResponse.json({
      messages,
      unreadCount,
    })
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
