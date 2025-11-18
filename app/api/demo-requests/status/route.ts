import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getClientRequests } from "@/app/actions/demo-requests"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const demoId = searchParams.get("demoId")

    if (!demoId) {
      return NextResponse.json(
        { error: "demoId is required" },
        { status: 400 }
      )
    }

    // Obtener todas las solicitudes del cliente
    const clientRequests = await getClientRequests(userId)

    // Buscar solicitud para esta demo específica
    const demoRequest = clientRequests.find(req => req.demoId === demoId)

    if (!demoRequest) {
      return NextResponse.json({ status: "none" })
    }

    return NextResponse.json({
      status: demoRequest.status,
      requestId: demoRequest.id,
      requestedAt: demoRequest.requestedAt,
      processedAt: demoRequest.processedAt,
    })
  } catch (error) {
    console.error("Error al verificar estado de solicitud:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
