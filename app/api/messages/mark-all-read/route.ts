import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { markAllAsRead } from "@/app/actions/messages"

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const result = await markAllAsRead(userId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        count: result.count
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error al marcar todos como leídos:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
