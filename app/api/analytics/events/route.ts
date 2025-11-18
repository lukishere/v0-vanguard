import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.info("Analytics event received", data)
  } catch (error) {
    console.error("Failed to parse analytics event", error)
  }

  return NextResponse.json({ success: true }, { status: 200 })
}


