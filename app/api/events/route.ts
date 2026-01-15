import { NextResponse } from "next/server"
import { getActiveEvents } from "@/lib/content/events"

/**
 * API endpoint para obtener eventos
 *
 * Carga eventos de manera estática desde lib/content/events.ts
 * Cuando los eventos sean más recurrentes, se migrará a un sistema dinámico.
 */
export async function GET() {
  try {
    // Cargar eventos estáticos
    const events = getActiveEvents()

    // Log para debugging
    console.log(`[Events API] Loaded ${events.length} static events`)

    return NextResponse.json(events)
  } catch (error) {
    // En caso de error, retornar array vacío para evitar que la página crashee
    console.error("❌ [Events API] Error al obtener eventos:", error)
    if (error instanceof Error) {
      console.error("   Error message:", error.message)
      console.error("   Stack:", error.stack)
    }

    // Return empty array instead of error to allow page to render
    return NextResponse.json([])
  }
}
