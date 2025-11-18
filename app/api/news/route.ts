import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getAllNews, getActiveNews, createNews } from "@/app/actions/news"
import { isAdmin } from "@/lib/admin/permissions"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await currentUser()
    const userIsAdmin = isAdmin(user)

    // Si es admin, devolver todas las noticias; si es cliente, solo las activas
    const news = userIsAdmin ? await getAllNews() : await getActiveNews()

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error al obtener noticias:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await currentUser()
    const userIsAdmin = isAdmin(user)

    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { type, title, content, author, isActive, eventDate, eventLocation, eventLink, eventImage, eventSummary, eventDetails, showInShowcase } = body

    if (!type || !title || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await createNews({
      type,
      title,
      content,
      author,
      isActive,
      eventDate,
      eventLocation,
      eventLink,
      eventImage,
      eventSummary,
      eventDetails,
      showInShowcase
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, newsId: result.newsId })
  } catch (error) {
    console.error("Error al crear noticia/evento:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
