import { kv } from "@vercel/kv"

/**
 * Initialize KV client with fallback handling
 * Returns null if KV is not configured (for development/fallback scenarios)
 */
export function getKvClient() {
  // Check if KV environment variables are set
  if (
    !process.env.KV_REST_API_URL ||
    !process.env.KV_REST_API_TOKEN ||
    !process.env.KV_REST_API_READ_ONLY_TOKEN
  ) {
    return null
  }

  try {
    return kv
  } catch (error) {
    console.warn("⚠️ [KV] Failed to initialize KV client:", error)
    return null
  }
}

/**
 * Check if KV is available
 */
export function isKvAvailable(): boolean {
  return getKvClient() !== null
}

