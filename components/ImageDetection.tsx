'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, AlertCircle, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react'

export default function ImageDetection() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    likelyAI: boolean
    score: number
  } | null>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setResult(null)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/detect-image', {
        method: 'POST',
        body: formData,
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image or Video
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {preview ? (
                <div className="space-y-4">
                  {file?.type.startsWith('image/') ? (
                    <Image
                      src={preview}
                      alt="Preview"
                      width={256}
                      height={256}
                      className="max-h-64 mx-auto rounded-lg object-contain"
                    />
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8">
                      <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Video: {file?.name}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Click to change file</p>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF, MP4, AVI up to 50MB
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !file}
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
                    <h3 className="text-xl font-bold text-red-700">AI Generated Media Detected</h3>
                    <p className="text-red-600">This media appears to be AI-generated</p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="text-xl font-bold text-green-700">Authentic Media</h3>
                    <p className="text-green-600">This media appears to be authentic</p>
                  </div>
                </>
              )}
            </div>
          </div>
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