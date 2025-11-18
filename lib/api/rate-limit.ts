type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

const DEFAULT_LIMIT = 20
const DEFAULT_WINDOW_MS = 60 * 1000

export function rateLimit(
  key: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (bucket && bucket.resetAt > now) {
    if (bucket.count >= limit) {
      return { success: false, remaining: 0, resetAt: bucket.resetAt }
    }

    bucket.count += 1
    buckets.set(key, bucket)
    return {
      success: true,
      remaining: limit - bucket.count,
      resetAt: bucket.resetAt,
    }
  }

  const resetAt = now + windowMs
  buckets.set(key, { count: 1, resetAt })

  return {
    success: true,
    remaining: limit - 1,
    resetAt,
  }
}


