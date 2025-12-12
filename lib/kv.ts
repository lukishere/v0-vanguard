import { Redis } from "@upstash/redis"

/**
 * Initialize Redis client with fallback handling
 * Returns null if Redis is not configured (for development/fallback scenarios)
 *
 * Uses @upstash/redis which automatically reads from environment variables:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 *
 * Also supports legacy Vercel KV variable names for backward compatibility:
 * - KV_REST_API_URL → UPSTASH_REDIS_REST_URL
 * - KV_REST_API_TOKEN → UPSTASH_REDIS_REST_TOKEN
 */
export function getKvClient() {
  try {
    // Get URL and token from either Upstash or Vercel KV variable names
    const url =
      process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL

    const token =
      process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

    // Check if at least URL and token are set
    if (!url || !token) {
      return null
    }

    // Map Vercel KV variables to Upstash format for Redis.fromEnv()
    // This allows using Redis.fromEnv() which is cleaner
    if (process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
      process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL
    }
    if (process.env.KV_REST_API_TOKEN && !process.env.UPSTASH_REDIS_REST_TOKEN) {
      process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN
    }

    // Redis.fromEnv() automatically reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
    return Redis.fromEnv()
  } catch (error) {
    console.warn("⚠️ [KV] Failed to initialize Redis client:", error)
    return null
  }
}

/**
 * Check if KV is available
 */
export function isKvAvailable(): boolean {
  return getKvClient() !== null
}
