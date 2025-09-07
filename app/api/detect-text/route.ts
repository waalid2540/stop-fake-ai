import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Skip auth for now to test detection
    const { text } = await request.json()

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: 'Text must be at least 10 characters' },
        { status: 400 }
      )
    }

    let result;

    // Better detection logic
    const textLower = text.toLowerCase()
    
    // Strong AI indicators
    const strongAIPatterns = [
      /as an ai/i,
      /i'm an ai/i,
      /as a language model/i,
      /i cannot provide/i,
      /i don't have access to/i,
      /as an artificial intelligence/i,
      /i'm not able to/i,
      /i cannot assist/i
    ]
    
    // Weak AI indicators (more common in AI text)
    const weakAIPatterns = [
      /it's important to note that/i,
      /however, it's worth noting/i,
      /in conclusion/i,
      /furthermore/i,
      /moreover/i,
      /nevertheless/i,
      /it should be noted/i,
      /it's worth mentioning/i
    ]
    
    // Human indicators
    const humanPatterns = [
      /\bi\s+think\b/i,
      /\bmy\s+opinion\b/i,
      /personally/i,
      /yesterday/i,
      /tomorrow/i,
      /\blol\b/i,
      /\bomg\b/i,
      /\bwtf\b/i,
      /\byeah\b/i,
      /\bnah\b/i,
      /\bawesome\b/i,
      /\bcool\b/i,
      /\bwow\b/i
    ]
    
    // Simple language detection
    const somaliWords = ['waa', 'iyo', 'oo', 'ah', 'ka', 'ku', 'la', 'si', 'uu', 'ay', 'aan', 'waxa', 'markii', 'hadii']
    const arabicPattern = /[\u0600-\u06FF]/
    const somaliPattern = new RegExp(somaliWords.join('|'), 'i')
    
    let detectedLanguage = 'English'
    if (arabicPattern.test(text)) {
      detectedLanguage = 'Arabic'
    } else if (somaliPattern.test(text)) {
      detectedLanguage = 'Somali'
    }
    
    // Calculate scores
    let aiScore = 0
    let humanScore = 0
    
    // Check strong AI patterns
    strongAIPatterns.forEach(pattern => {
      if (pattern.test(text)) aiScore += 40
    })
    
    // Check weak AI patterns
    weakAIPatterns.forEach(pattern => {
      if (pattern.test(text)) aiScore += 10
    })
    
    // Check human patterns
    humanPatterns.forEach(pattern => {
      if (pattern.test(text)) humanScore += 20
    })
    
    // Sentence structure analysis
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length
    
    // AI tends to write longer, more structured sentences
    if (avgLength > 20) aiScore += 10
    if (avgLength < 10) humanScore += 10
    
    // Repetitive structure (AI tends to be more repetitive)
    const words = text.split(/\s+/)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()))
    const repetitionRatio = words.length / uniqueWords.size
    
    if (repetitionRatio > 2) aiScore += 10
    if (repetitionRatio < 1.5) humanScore += 5
    
    // Calculate final confidence
    const totalScore = aiScore + humanScore
    let finalScore = totalScore > 0 ? aiScore / totalScore : 0.3
    
    // For non-English languages, reduce confidence
    if (detectedLanguage !== 'English') {
      finalScore = finalScore * 0.7 // Reduce confidence by 30%
    }
    
    // Ensure score is reasonable (20-95%)
    finalScore = Math.max(0.2, Math.min(0.95, finalScore))
    
    result = {
      likelyAI: finalScore > 0.5,
      score: finalScore,
      language: {
        detected: detectedLanguage,
        code: detectedLanguage === 'Somali' ? 'so' : detectedLanguage === 'Arabic' ? 'ar' : 'en',
        accuracy: detectedLanguage === 'English' ? 'high' : 'medium',
        warning: detectedLanguage !== 'English' ? 'Detection accuracy may be lower for non-English text' : null
      },
      details: {
        method: 'enhanced_pattern',
        sentences: sentences.length,
        averageWordsPerSentence: Math.round(avgLength),
        aiScore: aiScore,
        humanScore: humanScore,
        repetitionRatio: Math.round(repetitionRatio * 100) / 100,
        strongAIPatternFound: strongAIPatterns.some(pattern => pattern.test(text)),
        humanPatternFound: humanPatterns.some(pattern => pattern.test(text))
      }
    }


    // Skip increment for testing

    return NextResponse.json(result)
  } catch (error) {
    console.error('Text detection error:', error)
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}