'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function TextDetection() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    likelyAI: boolean
    score: number
    language?: {
      detected: string
      code: string
      accuracy: 'high' | 'medium' | 'low'
      warning?: string
    }
  } | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/detect-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Detection failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Enter text to analyze
          </label>
          <textarea
            id="text"
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Paste your text here to check if it's AI-generated..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Minimum 50 characters (varies by language). Supports 12+ languages including English, Spanish, French, German, Chinese, Japanese, and more.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading || text.length < 50}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Detect AI Content'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div
          className={`rounded-lg p-6 ${result.likelyAI ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {result.likelyAI ? (
                <>
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <h3 className="text-xl font-bold text-red-700">AI Generated Content Detected</h3>
                    <p className="text-red-600">This text appears to be AI-generated</p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="text-xl font-bold text-green-700">Human Written Content</h3>
                    <p className="text-green-600">This text appears to be human-written</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Language Information */}
          {result.language && (
            <div className="mb-4 bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-medium">Detected Language</span>
                <span className="text-lg font-semibold">{result.language.detected}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Detection Accuracy</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  result.language.accuracy === 'high' ? 'bg-green-100 text-green-800' :
                  result.language.accuracy === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {result.language.accuracy.toUpperCase()}
                </span>
              </div>
              {result.language.warning && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">{result.language.warning}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 bg-white rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Confidence Score</span>
              <span className="text-2xl font-bold">{(result.score * 100).toFixed(1)}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  result.likelyAI ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${result.score * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}