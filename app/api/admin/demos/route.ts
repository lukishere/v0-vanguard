import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin/permissions"
import type { Demo } from "@/lib/demos/types"
import { updateDemo, getDemoUpdates } from "@/app/actions/demos"

async function ensureAdmin(userId: string | null) {
  if (!userId) {
    return false
  }

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  return isAdmin(user)
}

// GET: Retrieve demo overrides (for future use)
export async function GET() {
  const { userId } = await auth()

  if (!(await ensureAdmin(userId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const updatesMap = await getDemoUpdates()
  const updates = updatesMap instanceof Map ? Object.fromEntries(updatesMap) : {}
  return NextResponse.json({ updates })
}

// POST: Create a new demo
export async function POST(request: Request) {
  const { userId } = await auth()

  if (!(await ensureAdmin(userId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: { action: string; payload: Partial<Demo> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  if (body.action !== "create" || !body.payload) {
    return NextResponse.json({ message: "Invalid action or payload" }, { status: 400 })
  }

  const { id, name, summary, description } = body.payload

  if (!id || !name || !summary || !description) {
    return NextResponse.json(
      { message: "Required fields: id, name, summary, description" },
      { status: 400 }
    )
  }

  // Store the new demo as an override
  const result = await updateDemo(id, body.payload as Partial<Demo>)

  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 500 })
  }

  console.log(`[Admin API] Demo created: ${id}`)

  return NextResponse.json({
    message: "Demo created successfully",
    demo: body.payload
  })
}

// PATCH: Update an existing demo
export async function PATCH(request: Request) {
  const { userId } = await auth()

  if (!(await ensureAdmin(userId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: { action: string; payload: Partial<Demo> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  if (body.action !== "update" || !body.payload?.id) {
    return NextResponse.json({ message: "Invalid action or missing demo ID" }, { status: 400 })
  }

  const { id } = body.payload

  // Update the demo
  const result = await updateDemo(id, body.payload as Partial<Demo>)

  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 500 })
  }

  console.log(`[Admin API] Demo updated: ${id}`)

  return NextResponse.json({
    message: "Demo updated successfully",
    demo: result.updates
  })
}

// DELETE: Delete a demo
export async function DELETE(request: Request) {
  const { userId } = await auth()

  if (!(await ensureAdmin(userId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: { demoId: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  if (!body.demoId) {
    return NextResponse.json({ message: "Missing demoId" }, { status: 400 })
  }

  // Note: This doesn't delete the base demo, just clears overrides
  // To actually delete, use the deleteDemo action instead
  console.log(`[Admin API] Demo delete requested: ${body.demoId}`)

  return NextResponse.json({
    message: "Demo management via API - use delete button in UI"
  })
}
