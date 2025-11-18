import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { callGemini } from "@/lib/chatbot/providers"
import { rateLimit } from "@/lib/api/rate-limit"

type GeminiRequestBody = {
  message: string
  context?: Array<{ role: "user" | "assistant"; content: string }>
  language?: "es" | "en"
}

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { message: "Gemini API key is not configured" },
      { status: 500 }
    )
  }

  const rate = rateLimit(`gemini:${userId}`)
  if (!rate.success) {
    return NextResponse.json(
      { message: "Rate limit exceeded. Intenta nuevamente más tarde." },
      { status: 429, headers: { "Retry-After": Math.ceil((rate.resetAt - Date.now()) / 1000).toString() } }
    )
  }

  let body: GeminiRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  if (!body.message || body.message.trim().length === 0) {
    return NextResponse.json({ message: "Message is required" }, { status: 400 })
  }

  try {
    const completion = await callGemini({
      message: body.message,
      context: body.context,
      language: body.language,
    })

    return NextResponse.json({
      reply: completion.reply,
      metadata: {
        model: completion.model,
        language: body.language ?? "es",
      },
    })
  } catch (error) {
    console.error("Gemini API error", error)
    return NextResponse.json(
      { message: "Failed to contact Gemini API" },
      { status: 500 }
    )
  }
}
