import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getClientPublicMetadata } from "@/lib/admin/clerk-metadata"

export async function GET() {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const metadata = await getClientPublicMetadata(userId)

  return NextResponse.json({
    demoAccess: metadata.demoAccess,
    role: metadata.role,
    customContent: metadata.customContent ?? null,
  })
}




