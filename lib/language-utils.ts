// Language detection and multilingual support utilities

export interface LanguageInfo {
  code: string
  name: string
  supported: boolean
  accuracy: 'high' | 'medium' | 'low'
  minLength: number
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageInfo> = {
  en: { code: 'en', name: 'English', supported: true, accuracy: 'high', minLength: 50 },
  es: { code: 'es', name: 'Spanish', supported: true, accuracy: 'high', minLength: 50 },
  fr: { code: 'fr', name: 'French', supported: true, accuracy: 'high', minLength: 50 },
  de: { code: 'de', name: 'German', supported: true, accuracy: 'high', minLength: 50 },
  it: { code: 'it', name: 'Italian', supported: true, accuracy: 'medium', minLength: 50 },
  pt: { code: 'pt', name: 'Portuguese', supported: true, accuracy: 'medium', minLength: 50 },
  nl: { code: 'nl', name: 'Dutch', supported: true, accuracy: 'medium', minLength: 50 },
  zh: { code: 'zh', name: 'Chinese', supported: true, accuracy: 'medium', minLength: 30 },
  ja: { code: 'ja', name: 'Japanese', supported: true, accuracy: 'medium', minLength: 30 },
  ko: { code: 'ko', name: 'Korean', supported: true, accuracy: 'medium', minLength: 30 },
  ru: { code: 'ru', name: 'Russian', supported: true, accuracy: 'medium', minLength: 50 },
  ar: { code: 'ar', name: 'Arabic', supported: true, accuracy: 'low', minLength: 50 },
}

export function detectLanguage(text: string): LanguageInfo {
  // Simple language detection based on character patterns
  const cleanText = text.toLowerCase()
  
  // Chinese characters
  if (/[\u4e00-\u9fff]/.test(text)) {
    return SUPPORTED_LANGUAGES.zh
  }
  
  // Japanese characters (Hiragana/Katakana)
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    return SUPPORTED_LANGUAGES.ja
  }
  
  // Korean characters
  if (/[\uac00-\ud7af]/.test(text)) {
    return SUPPORTED_LANGUAGES.ko
  }
  
  // Arabic characters
  if (/[\u0600-\u06ff]/.test(text)) {
    return SUPPORTED_LANGUAGES.ar
  }
  
  // Cyrillic (Russian)
  if (/[\u0400-\u04ff]/.test(text)) {
    return SUPPORTED_LANGUAGES.ru
  }
  
  // European languages - simple keyword detection
  const spanishWords = ['el', 'la', 'de', 'que', 'y', 'es', 'en', 'un', 'te', 'lo']
  const frenchWords = ['le', 'de', 'et', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que']
  const germanWords = ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich']
  const italianWords = ['di', 'che', 'e', 'il', 'un', 'a', 'è', 'per', 'una', 'in']
  const portugueseWords = ['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para']
  const dutchWords = ['de', 'het', 'een', 'en', 'van', 'te', 'dat', 'die', 'in', 'op']
  
  const words = cleanText.split(/\s+/).slice(0, 20) // Check first 20 words
  
  const spanishScore = words.filter(w => spanishWords.includes(w)).length
  const frenchScore = words.filter(w => frenchWords.includes(w)).length
  const germanScore = words.filter(w => germanWords.includes(w)).length
  const italianScore = words.filter(w => italianWords.includes(w)).length
  const portugueseScore = words.filter(w => portugueseWords.includes(w)).length
  const dutchScore = words.filter(w => dutchWords.includes(w)).length
  
  const scores = [
    { lang: 'es', score: spanishScore },
    { lang: 'fr', score: frenchScore },
    { lang: 'de', score: germanScore },
    { lang: 'it', score: italianScore },
    { lang: 'pt', score: portugueseScore },
    { lang: 'nl', score: dutchScore },
  ]
  
  const bestMatch = scores.reduce((best, current) => 
    current.score > best.score ? current : best
  )
  
  if (bestMatch.score >= 2) {
    return SUPPORTED_LANGUAGES[bestMatch.lang]
  }
  
  // Default to English
  return SUPPORTED_LANGUAGES.en
}

export function getLanguageAccuracyWarning(language: LanguageInfo): string | null {
  switch (language.accuracy) {
    case 'medium':
      return `Detection accuracy may be lower for ${language.name} text. For best results, use English content.`
    case 'low':
      return `Limited support for ${language.name}. Detection accuracy may be significantly lower. Consider translating to English for better results.`
    default:
      return null
  }
}

export function getMinimumTextLength(language: LanguageInfo): number {
  return language.minLength
}

export const AUDIO_LANGUAGE_SUPPORT = {
  high: ['English'],
  medium: ['Spanish', 'French', 'German'],
  low: ['Other languages (limited support)']
}

export const IMAGE_VIDEO_LANGUAGES = {
  supported: 'All languages (visual analysis is language-independent)',
  note: 'Image and video detection works regardless of text content language'
}