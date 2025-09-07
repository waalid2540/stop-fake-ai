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
    
    // Improved language detection
    const somaliWords = ['waa', 'iyo', 'oo', 'ah', 'ka', 'ku', 'la', 'si', 'uu', 'ay', 'aan', 'waxa', 'markii', 'hadii']
    const arabicPattern = /[\u0600-\u06FF]/
    
    let detectedLanguage = 'English'
    
    // Check for Arabic script first (most reliable)
    if (arabicPattern.test(text)) {
      detectedLanguage = 'Arabic'
    } else {
      // For Somali detection, require at least 2 Somali words and calculate percentage
      const words = text.toLowerCase().split(/\s+/)
      const somaliMatches = words.filter((word: string) => somaliWords.includes(word)).length
      const somaliPercentage = somaliMatches / words.length
      
      // Only classify as Somali if we have strong indicators (at least 15% Somali words)
      if (somaliMatches >= 2 && somaliPercentage >= 0.15) {
        detectedLanguage = 'Somali'
      }
    }
    
    // Calculate scores
    let aiScore = 0
    let humanScore = 0
    
    // Check strong AI patterns (definitive indicators)
    strongAIPatterns.forEach(pattern => {
      if (pattern.test(text)) aiScore += 30
    })
    
    // Check weak AI patterns (common in AI text)
    weakAIPatterns.forEach(pattern => {
      if (pattern.test(text)) aiScore += 8
    })
    
    // Check human patterns (casual/personal language)
    humanPatterns.forEach(pattern => {
      if (pattern.test(text)) humanScore += 15
    })
    
    // Sentence structure analysis
    const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0)
    const avgLength = sentences.reduce((sum: number, s: string) => sum + s.split(' ').length, 0) / sentences.length
    
    // AI tends to write longer, more structured sentences
    if (avgLength > 20) aiScore += 10
    if (avgLength < 10) humanScore += 10
    
    // Repetitive structure (AI tends to be more repetitive)
    const words = text.split(/\s+/)
    const uniqueWords = new Set(words.map((w: string) => w.toLowerCase()))
    const repetitionRatio = words.length / uniqueWords.size
    
    if (repetitionRatio > 2) aiScore += 10
    if (repetitionRatio < 1.5) humanScore += 5
    
    // Calculate final confidence
    const totalScore = aiScore + humanScore
    let finalScore
    
    if (totalScore > 0) {
      finalScore = aiScore / totalScore
    } else {
      // No patterns matched - use neutral analysis
      // Base on text characteristics
      const hasComplexVocabulary = /\b(?:furthermore|moreover|consequently|nevertheless|accordingly|specifically|particularly)\b/i.test(text)
      const hasPersonalPronouns = /\b(?:i|my|me|myself)\b/i.test(text)
      const hasTypos = /\b(?:teh|recieve|seperate|definately|occured)\b/i.test(text)
      
      if (hasPersonalPronouns && !hasComplexVocabulary) {
        finalScore = 0.3 // Likely human
      } else if (hasComplexVocabulary && !hasPersonalPronouns) {
        finalScore = 0.7 // Likely AI
      } else {
        finalScore = 0.5 // Neutral
      }
    }
    
    // For non-English languages, adjust confidence
    if (detectedLanguage !== 'English') {
      finalScore = finalScore * 0.8 + 0.1 // Reduce confidence and add uncertainty
    }
    
    // Ensure score is reasonable (15-90%)
    finalScore = Math.max(0.15, Math.min(0.90, finalScore))
    
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