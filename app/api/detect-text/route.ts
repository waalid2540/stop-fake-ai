import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, checkDailyLimit, incrementDailyChecks } from '@/lib/auth'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit'
import { apiClient, classifyAPIError } from '@/lib/api-client'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Rate limiting check
    const rateLimitResult = checkRateLimit(`text-${user.id}`, 60000, 10) // 10 requests per minute per user
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please wait before making another request.',
          resetTime: rateLimitResult.resetTime 
        },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      )
    }
    
    // Check daily limit for free users
    const canCheck = await checkDailyLimit(user.id)
    if (!canCheck) {
      return NextResponse.json(
        { error: 'Daily limit reached. Please upgrade to continue.' },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      )
    }

    const { text } = await request.json()

    if (!text || text.length < 100) {
      return NextResponse.json(
        { error: 'Text must be at least 100 characters' },
        { status: 400 }
      )
    }

    let result;

    // Check if we have a real GPTZero API key
    if (process.env.GPTZERO_API_KEY && process.env.GPTZERO_API_KEY !== 'placeholder-gptzero-key') {
      try {
        // Real GPTZero API call using enhanced client
        const data = await apiClient.detectTextWithGPTZero(text, process.env.GPTZERO_API_KEY)
        
        result = {
          likelyAI: data.documents[0].completely_generated_prob > 0.5,
          score: data.documents[0].completely_generated_prob,
          details: {
            sentences: data.documents[0].sentences.length,
            averagePerplexity: data.documents[0].average_generated_prob,
            burstiness: data.documents[0].overall_burstiness,
            paragraphs: data.documents[0].paragraphs?.length || 0,
            classification: data.documents[0].classification
          }
        }
      } catch (error) {
        console.error('GPTZero API error:', error)
        const classifiedError = classifyAPIError(error)
        
        // Don't fallback for non-retriable errors (like invalid API key)
        if (!classifiedError.retryable) {
          return NextResponse.json(
            { error: classifiedError.message },
            { 
              status: classifiedError.statusCode || 500,
              headers: rateLimitHeaders
            }
          )
        }
        
        // Fall back to simulated response for retriable errors
        const simulatedScore = Math.random()
        result = {
          likelyAI: simulatedScore > 0.5,
          score: simulatedScore,
          details: {
            sentences: text.split('.').length - 1,
            averagePerplexity: simulatedScore * 100,
            burstiness: simulatedScore * 50,
            error: 'API temporarily unavailable - using fallback detection',
            fallback: true
          }
        }
      }
    } else {
      // Simulated response for demo/development
      const simulatedScore = Math.random()
      result = {
        likelyAI: simulatedScore > 0.5,
        score: simulatedScore,
        details: {
          sentences: text.split('.').length - 1,
          averagePerplexity: simulatedScore * 100,
          burstiness: simulatedScore * 50,
          mode: 'demo'
        }
      }
    }

    // Increment daily checks for free users
    await incrementDailyChecks(user.id)

    return NextResponse.json(result, {
      headers: rateLimitHeaders
    })
  } catch (error) {
    console.error('Text detection error:', error)
    const classifiedError = classifyAPIError(error)
    
    return NextResponse.json(
      { 
        error: classifiedError.message,
        code: classifiedError.code,
        retryable: classifiedError.retryable
      },
      { status: classifiedError.statusCode || 500 }
    )
  }
}