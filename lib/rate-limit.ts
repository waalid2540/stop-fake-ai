// Simple in-memory rate limiting for API calls
// In production, you'd want to use Redis or a proper rate limiting service

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  identifier: string, 
  windowMs: number = 60000, // 1 minute
  maxRequests: number = 10
): { allowed: boolean; resetTime?: number; remaining?: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimitMap.delete(identifier)
  }

  const currentEntry = rateLimitMap.get(identifier)

  if (!currentEntry) {
    // First request in window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return { 
      allowed: true, 
      remaining: maxRequests - 1,
      resetTime: now + windowMs 
    }
  }

  if (currentEntry.count >= maxRequests) {
    // Rate limit exceeded
    return { 
      allowed: false, 
      resetTime: currentEntry.resetTime,
      remaining: 0
    }
  }

  // Increment count
  currentEntry.count++
  rateLimitMap.set(identifier, currentEntry)

  return { 
    allowed: true, 
    remaining: maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime 
  }
}

export function getRateLimitHeaders(result: ReturnType<typeof checkRateLimit>) {
  return {
    'X-RateLimit-Limit': '10',
    'X-RateLimit-Remaining': result.remaining?.toString() || '0',
    'X-RateLimit-Reset': result.resetTime ? Math.ceil(result.resetTime / 1000).toString() : '0'
  }
}