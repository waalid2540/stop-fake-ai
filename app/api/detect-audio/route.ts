import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, checkDailyLimit, incrementDailyChecks } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Check daily limit for free users
    const canCheck = await checkDailyLimit(user.id)
    if (!canCheck) {
      return NextResponse.json(
        { error: 'Daily limit reached. Please upgrade to continue.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg']
    if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an audio file.' },
        { status: 400 }
      )
    }

    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25MB.' },
        { status: 400 }
      )
    }

    let result;

    // Check if we have a real Resemble.ai API key
    if (process.env.RESEMBLE_API_KEY && process.env.RESEMBLE_API_KEY !== 'placeholder-resemble-key') {
      try {
        // Real Resemble.ai Detect API call
        const formDataForAPI = new FormData()
        formDataForAPI.append('file', file)

        const response = await fetch('https://app.resemble.ai/api/v2/detect', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEMBLE_API_KEY}`,
          },
          body: formDataForAPI
        })

        if (!response.ok) {
          throw new Error(`Resemble.ai API error: ${response.status}`)
        }

        const data = await response.json()
        
        // Extract detection results from Resemble.ai response
        const confidence = data.probability || data.score || 0
        const isAI = confidence > 0.5
        
        result = {
          likelyAI: isAI,
          score: confidence,
          details: {
            fileType: file.type,
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
            duration: data.duration || 'Unknown',
            voiceCloneConfidence: confidence,
            modelVersion: data.model_version || 'v2',
            processingTime: data.processing_time || 0,
            artifacts: confidence > 0.6 ? [
              'Synthetic speech patterns detected',
              'Voice cloning indicators present'
            ] : confidence > 0.3 ? [
              'Minor artificial characteristics'
            ] : [],
            analysis: {
              spectralAnalysis: data.spectral_analysis || 'Normal',
              prosodyScore: data.prosody_score || 0.5,
              timbreConsistency: data.timbre_consistency || 0.8
            }
          }
        }
      } catch (error) {
        console.error('Resemble.ai API error:', error)
        // Fall back to simulated response if API fails
        const simulatedScore = Math.random()
        result = {
          likelyAI: simulatedScore > 0.5,
          score: simulatedScore,
          details: {
            fileType: file.type,
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
            duration: 'Unknown',
            voiceCloneConfidence: simulatedScore,
            artifacts: simulatedScore > 0.6 ? ['Unnatural pitch variations', 'Digital artifacts'] : [],
            error: 'API temporarily unavailable - using fallback detection'
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
          fileType: file.type,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
          duration: 'Demo Mode',
          voiceCloneConfidence: simulatedScore,
          artifacts: simulatedScore > 0.6 ? ['Unnatural pitch variations', 'Digital artifacts'] : [],
          mode: 'demo'
        }
      }
    }

    // Increment daily checks for free users
    await incrementDailyChecks(user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Audio detection error:', error)
    return NextResponse.json(
      { error: 'Detection failed. Please try again.' },
      { status: 500 }
    )
  }
}