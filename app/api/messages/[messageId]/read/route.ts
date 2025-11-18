import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { markMessageAsRead } from "@/app/actions/messages"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { userId } = await auth()
    const { messageId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const result = await markMessageAsRead(messageId)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error al marcar mensaje como leído:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
