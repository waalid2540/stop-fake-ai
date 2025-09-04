// Centralized API client with error handling, retries, and logging

interface APIClientConfig {
  maxRetries?: number
  retryDelay?: number
  timeout?: number
}

class APIClient {
  private config: Required<APIClientConfig>

  constructor(config: APIClientConfig = {}) {
    this.config = {
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      timeout: config.timeout ?? 30000
    }
  }

  async request(url: string, options: RequestInit, retryCount = 0): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)

      // Handle timeout and network errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.config.timeout}ms`)
        }
        
        // Retry on network errors
        if (retryCount < this.config.maxRetries && this.isRetriableError(error)) {
          console.warn(`API request failed (attempt ${retryCount + 1}/${this.config.maxRetries}):`, error.message)
          await this.delay(this.config.retryDelay * Math.pow(2, retryCount)) // Exponential backoff
          return this.request(url, options, retryCount + 1)
        }
      }

      throw error
    }
  }

  private isRetriableError(error: Error): boolean {
    const retriableMessages = [
      'fetch failed',
      'network error',
      'connection reset',
      'timeout'
    ]
    
    return retriableMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // GPTZero API wrapper
  async detectTextWithGPTZero(text: string, apiKey: string) {
    const response = await this.request('https://api.gptzero.me/v2/predict/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({ document: text })
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`GPTZero API error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  // Hive API wrapper
  async detectMediaWithHive(file: File, apiKey: string) {
    const formData = new FormData()
    formData.append('media', file)

    const response = await this.request('https://api.thehive.ai/api/v2/task/sync', {
      method: 'POST',
      headers: {
        'authorization': `token ${apiKey}`,
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Hive API error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  // Resemble.ai API wrapper
  async detectAudioWithResemble(file: File, apiKey: string) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.request('https://app.resemble.ai/api/v2/detect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Resemble.ai API error (${response.status}): ${errorText}`)
    }

    return response.json()
  }
}

export const apiClient = new APIClient({
  maxRetries: 2,
  retryDelay: 1000,
  timeout: 45000 // 45 seconds for file uploads
})

// Error classification for better user messaging
export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function classifyAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('timeout')) {
      return new APIError(
        'Request timed out. Please try again.',
        'TIMEOUT',
        408,
        true
      )
    }

    if (message.includes('network') || message.includes('fetch failed')) {
      return new APIError(
        'Network error. Please check your connection and try again.',
        'NETWORK_ERROR',
        0,
        true
      )
    }

    if (message.includes('401') || message.includes('unauthorized')) {
      return new APIError(
        'API key is invalid or expired.',
        'UNAUTHORIZED',
        401,
        false
      )
    }

    if (message.includes('429') || message.includes('rate limit')) {
      return new APIError(
        'Rate limit exceeded. Please try again later.',
        'RATE_LIMIT',
        429,
        true
      )
    }

    if (message.includes('500') || message.includes('internal server error')) {
      return new APIError(
        'Service temporarily unavailable. Please try again.',
        'SERVER_ERROR',
        500,
        true
      )
    }
  }

  return new APIError(
    'An unexpected error occurred. Please try again.',
    'UNKNOWN_ERROR',
    0,
    true
  )
}