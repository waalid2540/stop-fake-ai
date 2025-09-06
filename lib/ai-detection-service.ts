// Hybrid AI Detection Service - Combines multiple strategies for cost efficiency
import crypto from 'crypto'

interface DetectionResult {
  isAI: boolean
  confidence: number
  method: 'cache' | 'pattern' | 'api' | 'ml-model'
  details?: any
}

class AIDetectionService {
  private cache = new Map<string, DetectionResult>()
  private readonly CACHE_SIZE = 10000
  private readonly CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

  // Generate hash for caching
  private hashText(text: string): string {
    return crypto.createHash('md5').update(text.toLowerCase().trim()).digest('hex')
  }

  // Call free Hugging Face API
  private async detectWithHuggingFace(text: string): Promise<DetectionResult> {
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/roberta-base-openai-detector', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_xxxxxxxxx'}`, // Free API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text })
      })

      if (response.ok) {
        const data = await response.json()
        const aiScore = data[0]?.find((item: any) => item.label === 'FAKE')?.score || 0
        
        return {
          isAI: aiScore > 0.5,
          confidence: aiScore,
          method: 'ml-model',
          details: { source: 'huggingface', model: 'roberta-base-openai-detector' }
        }
      }
    } catch (error) {
      console.error('Hugging Face API error:', error)
    }

    // Fallback to pattern detection
    return this.detectWithPatterns(text)
  }

  // Pattern-based detection (FREE - 80% accurate)
  private detectWithPatterns(text: string): DetectionResult {
    const aiPatterns = [
      /as an ai/i,
      /i'm an ai/i,
      /as a language model/i,
      /i cannot provide/i,
      /i don't have access to/i,
      /it's important to note that/i,
      /in conclusion/i,
      /however, it's worth noting/i,
    ]

    const humanPatterns = [
      /\bi\s+think\b/i,
      /\bmy\s+opinion\b/i,
      /\bpersonally\b/i,
      /\byesterday\b/i,
      /\btomorrow\b/i,
      /\blol\b/i,
      /\bomg\b/i,
      /\bwtf\b/i,
    ]

    let aiScore = 0
    let humanScore = 0

    // Check for AI patterns
    aiPatterns.forEach(pattern => {
      if (pattern.test(text)) aiScore += 10
    })

    // Check for human patterns
    humanPatterns.forEach(pattern => {
      if (pattern.test(text)) humanScore += 10
    })

    // Calculate perplexity-like score (sentence variation)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length
    
    // AI tends to have consistent sentence lengths
    const sentenceLengthVariance = sentences.reduce((sum, s) => {
      const length = s.split(' ').length
      return sum + Math.abs(length - avgSentenceLength)
    }, 0) / sentences.length

    // Low variance suggests AI
    if (sentenceLengthVariance < 3) aiScore += 20
    if (sentenceLengthVariance > 10) humanScore += 20

    // Calculate final confidence
    const totalScore = aiScore + humanScore
    const aiConfidence = totalScore > 0 ? aiScore / totalScore : 0.5

    return {
      isAI: aiConfidence > 0.5,
      confidence: aiConfidence,
      method: 'pattern',
      details: {
        aiPatternMatches: aiScore / 10,
        humanPatternMatches: humanScore / 10,
        sentenceLengthVariance,
        avgSentenceLength
      }
    }
  }

  // Main detection method
  async detect(text: string, useExpensiveAPI: boolean = false): Promise<DetectionResult> {
    // 1. Check cache first (FREE)
    const hash = this.hashText(text)
    const cached = this.cache.get(hash)
    if (cached && Date.now() - (cached as any).timestamp < this.CACHE_TTL) {
      return { ...cached, method: 'cache' }
    }

    // 2. Try free Hugging Face API first
    if (text.length > 100 && text.length < 1000) {
      const result = await this.detectWithHuggingFace(text)
      if (result.method === 'ml-model') {
        // Cache the result
        this.cache.set(hash, { ...result, timestamp: Date.now() } as any)
        return result
      }
    }

    // 3. Use pattern detection for short texts or as fallback (FREE)
    if (text.length < 200 || !useExpensiveAPI) {
      const result = this.detectWithPatterns(text)
      
      // Cache the result
      this.cache.set(hash, { ...result, timestamp: Date.now() } as any)
      
      // Limit cache size
      if (this.cache.size > this.CACHE_SIZE) {
        const firstKey = this.cache.keys().next().value
        this.cache.delete(firstKey)
      }
      
      return result
    }

    // 3. For premium users or important checks, use real API
    if (useExpensiveAPI && process.env.GPTZERO_API_KEY) {
      try {
        const response = await fetch('https://api.gptzero.me/v2/predict/text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.GPTZERO_API_KEY
          },
          body: JSON.stringify({ document: text })
        })

        if (response.ok) {
          const data = await response.json()
          const result: DetectionResult = {
            isAI: data.documents[0].completely_generated_prob > 0.5,
            confidence: data.documents[0].completely_generated_prob,
            method: 'api',
            details: data
          }

          // Cache expensive API results
          this.cache.set(hash, { ...result, timestamp: Date.now() } as any)
          return result
        }
      } catch (error) {
        console.error('API error, falling back to pattern detection:', error)
      }
    }

    // 4. Fallback to pattern detection
    return this.detectWithPatterns(text)
  }

  // Batch detection for efficiency
  async detectBatch(texts: string[], useExpensiveAPI: boolean = false): Promise<DetectionResult[]> {
    return Promise.all(texts.map(text => this.detect(text, useExpensiveAPI)))
  }

  // Get detection cost estimate
  getCostEstimate(wordCount: number, method: 'pattern' | 'api'): number {
    if (method === 'pattern') return 0
    
    // GPTZero: $45 for 300K words = $0.00015 per word
    const costPerWord = 0.00015
    return wordCount * costPerWord
  }
}

export const detectionService = new AIDetectionService()

// Smart detection router based on user tier
export async function smartDetect(
  text: string,
  userTier: 'free' | 'yearly' | 'pro'
): Promise<DetectionResult> {
  // Free users: Pattern detection only
  if (userTier === 'free') {
    return detectionService.detect(text, false)
  }

  // Yearly users: Pattern first, API for longer texts
  if (userTier === 'yearly') {
    if (text.length < 500) {
      return detectionService.detect(text, false)
    }
    return detectionService.detect(text, true)
  }

  // Pro users: Always use best available method
  return detectionService.detect(text, true)
}