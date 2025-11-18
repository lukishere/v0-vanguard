import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin/permissions"
import {
  getClientPublicMetadata,
  getClientMetadataFromUser,
  upsertClientDemoAccess,
  removeClientDemoAccess,
} from "@/lib/admin/clerk-metadata"
import type { ClientDemoAccess } from "@/lib/demos/types"

type AssignPayload = {
  action: "assign"
  clientId: string
  demoId: string
  durationDays: number
}

type RevokePayload = {
  action: "revoke"
  clientId: string
  demoId: string
}

type RequestBody = AssignPayload | RevokePayload

async function ensureAdmin(userId: string | null) {
  if (!userId) {
    return false
  }

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  return isAdmin(user)
}

function createDemoAccess(demoId: string, durationDays: number): ClientDemoAccess {
  const now = new Date()
  const expires = new Date(now)
  expires.setDate(expires.getDate() + durationDays)

  return {
    demoId,
    assignedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    daysRemaining: durationDays,
    usageDays: 0,
    totalDays: durationDays,
    sessionsCount: 0,
  }
}

export async function GET() {
  const { userId } = await auth()

  if (!(await ensureAdmin(userId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const clerk = await clerkClient()
  const users = await clerk.users.getUserList({ limit: 200, orderBy: "-created_at" })

  // Filtrar usuarios: mostrar todos EXCEPTO admins
  // Usuarios sin rol asignado se consideran clientes por defecto
  const clients = users.data
    .map((user) => {
      const metadata = getClientMetadataFromUser(user)
      return {
        id: user.id,
        name: user.fullName ?? user.username ?? user.emailAddresses.at(0)?.emailAddress ?? "Usuario",
        email: user.emailAddresses.at(0)?.emailAddress ?? null,
        metadata,
        lastActiveAt: user.lastActiveAt,
      }
    })
    .filter((entry) => entry.metadata.role !== "admin")

  return NextResponse.json({ clients })
}

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!(await ensureAdmin(userId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  if (body.action === "assign") {
    if (
      !body.clientId ||
      !body.demoId ||
      !Number.isFinite(body.durationDays) ||
      body.durationDays <= 0
    ) {
      return NextResponse.json({ message: "Invalid assign payload" }, { status: 400 })
    }

    const normalizedDuration = Math.floor(body.durationDays)

    const access = createDemoAccess(body.demoId, normalizedDuration)
    const updated = await upsertClientDemoAccess(body.clientId, access)

    return NextResponse.json({ metadata: updated })
  }

  return NextResponse.json({ message: "Action not supported via POST" }, { status: 400 })
}

export async function DELETE(request: Request) {
  const { userId } = await auth()

  if (!(await ensureAdmin(userId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  if (body.action !== "revoke" || !body.clientId || !body.demoId) {
    return NextResponse.json({ message: "Invalid revoke payload" }, { status: 400 })
  }

  const updated = await removeClientDemoAccess(body.clientId, body.demoId)
  return NextResponse.json({ metadata: updated })
}
