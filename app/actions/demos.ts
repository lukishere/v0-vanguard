"use server"

import { revalidatePath } from "next/cache"
import type { Demo } from "@/lib/demos/types"
import fs from "fs/promises"
import path from "path"

// Rutas de archivos para persistencia
const DATA_DIR = path.join(process.cwd(), ".data")
const DELETED_DEMOS_FILE = path.join(DATA_DIR, "deleted-demos.json")
const DEMO_UPDATES_FILE = path.join(DATA_DIR, "demo-updates.json")

// Asegurar que el directorio existe
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Ignorar si ya existe
  }
}

// Leer demos eliminadas desde el archivo
async function loadDeletedDemos(): Promise<Set<string>> {
  try {
    const data = await fs.readFile(DELETED_DEMOS_FILE, "utf-8")
    return new Set(JSON.parse(data))
  } catch (error) {
    // Si el archivo no existe, retornar Set vacío
    return new Set()
  }
}

// Guardar demos eliminadas al archivo
async function saveDeletedDemos(deletedDemos: Set<string>) {
  await ensureDataDir()
  await fs.writeFile(DELETED_DEMOS_FILE, JSON.stringify(Array.from(deletedDemos)), "utf-8")
}

// Leer actualizaciones de demos desde el archivo
async function loadDemoUpdates(): Promise<Map<string, Partial<Demo>>> {
  try {
    const data = await fs.readFile(DEMO_UPDATES_FILE, "utf-8")
    const entries = JSON.parse(data)
    return new Map(Object.entries(entries))
  } catch (error) {
    // Si el archivo no existe, retornar Map vacío
    return new Map()
  }
}

// Guardar actualizaciones de demos al archivo
async function saveDemoUpdates(updates: Map<string, Partial<Demo>>) {
  await ensureDataDir()
  const obj = Object.fromEntries(updates)
  await fs.writeFile(DEMO_UPDATES_FILE, JSON.stringify(obj, null, 2), "utf-8")
}

export async function deleteDemo(demoId: string) {
  try {
    // Cargar demos eliminadas
    const deletedDemos = await loadDeletedDemos()

    // Marcar demo como eliminada
    deletedDemos.add(demoId)

    // Guardar en archivo
    await saveDeletedDemos(deletedDemos)

    console.log(`[Demo Delete] Demo '${demoId}' eliminada. Total eliminadas:`, deletedDemos.size)

    // Revalidar la página de demos para reflejar el cambio
    revalidatePath("/admin/demos")
    revalidatePath("/dashboard")

    return { success: true, demoId }
  } catch (error) {
    console.error("Error al eliminar demo:", error)
    return { success: false, error: "No se pudo eliminar la demo" }
  }
}

export async function getDeletedDemos(): Promise<string[]> {
  const deletedDemos = await loadDeletedDemos()
  return Array.from(deletedDemos)
}

export async function restoreDemo(demoId: string) {
  try {
    const deletedDemos = await loadDeletedDemos()
    deletedDemos.delete(demoId)
    await saveDeletedDemos(deletedDemos)

    console.log(`[Demo Restore] Demo '${demoId}' restaurada.`)

    revalidatePath("/admin/demos")
    revalidatePath("/dashboard")

    return { success: true, demoId }
  } catch (error) {
    console.error("Error al restaurar demo:", error)
    return { success: false, error: "No se pudo restaurar la demo" }
  }
}

// Funciones para gestionar actualizaciones de demos
export async function updateDemo(demoId: string, updates: Partial<Demo>) {
  try {
    const demoUpdates = await loadDemoUpdates()
    const existingUpdates = demoUpdates.get(demoId) || {}
    const mergedUpdates = { ...existingUpdates, ...updates, id: demoId }

    demoUpdates.set(demoId, mergedUpdates)
    await saveDemoUpdates(demoUpdates)

    console.log(`[Demo Update] Demo '${demoId}' actualizada. Total updates:`, demoUpdates.size)

    revalidatePath("/admin/demos")
    revalidatePath("/dashboard")

    return { success: true, demoId, updates: mergedUpdates }
  } catch (error) {
    console.error("Error al actualizar demo:", error)
    return { success: false, error: "No se pudo actualizar la demo" }
  }
}

export async function getDemoUpdates(demoId?: string): Promise<Map<string, Partial<Demo>> | Partial<Demo> | undefined> {
  const demoUpdates = await loadDemoUpdates()
  if (demoId) {
    return demoUpdates.get(demoId)
  }
  return demoUpdates
}

export async function clearDemoUpdates(demoId: string) {
  try {
    const demoUpdates = await loadDemoUpdates()
    demoUpdates.delete(demoId)
    await saveDemoUpdates(demoUpdates)

    revalidatePath("/admin/demos")
    revalidatePath("/dashboard")

    return { success: true, demoId }
  } catch (error) {
    console.error("Error al limpiar updates de demo:", error)
    return { success: false, error: "No se pudieron limpiar los updates" }
  }
}
