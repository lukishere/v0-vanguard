import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { updateNews, deleteNews } from "@/app/actions/news"
import { isAdmin } from "@/lib/admin/permissions"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    const { userId } = await auth()
    const { newsId } = await params

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
    const { title, content, author, isActive, eventDate, eventLocation, eventLink, eventImage, eventSummary, eventDetails, showInShowcase } = body

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await updateNews(params.newsId, {
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar noticia:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { newsId: string } }
) {
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

    const result = await deleteNews(params.newsId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar noticia:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
