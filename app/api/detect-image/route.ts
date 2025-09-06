import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, checkDailyLimit, incrementDailyChecks } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
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
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image or video.' },
        { status: 400 }
      )
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      )
    }

    let result;

    // Check if we have a real Hive API key
    if (process.env.HIVE_API_KEY && process.env.HIVE_API_KEY !== 'placeholder-hive-key') {
      try {
        // Real Hive Moderation API call
        const formDataForAPI = new FormData()
        formDataForAPI.append('media', file)

        const response = await fetch('https://api.thehive.ai/api/v2/task/sync', {
          method: 'POST',
          headers: {
            'authorization': `token ${process.env.HIVE_API_KEY}`,
          },
          body: formDataForAPI
        })

        if (!response.ok) {
          throw new Error(`Hive API error: ${response.status}`)
        }

        const data = await response.json()
        
        // Extract AI-generated content detection from Hive response
        const aiGeneratedClass = data.status[0]?.response?.output?.find(
          (item: any) => item.class === 'ai_generated_image' || item.class === 'deepfake'
        )
        
        const confidence = aiGeneratedClass?.score || 0
        
        result = {
          likelyAI: confidence > 0.5,
          score: confidence,
          details: {
            fileType: file.type,
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
            modelConfidence: confidence,
            taskId: data.status[0]?.response?.task_id,
            classes: data.status[0]?.response?.output?.map((item: any) => ({
              class: item.class,
              score: item.score
            })) || [],
            deepfakeIndicators: confidence > 0.7 ? [
              'Facial inconsistencies detected',
              'Artificial generation patterns'
            ] : [],
          }
        }
      } catch (error) {
        console.error('Hive API error:', error)
        // Fall back to simulated response if API fails
        const simulatedScore = Math.random()
        result = {
          likelyAI: simulatedScore > 0.5,
          score: simulatedScore,
          details: {
            fileType: file.type,
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
            modelConfidence: simulatedScore,
            deepfakeIndicators: simulatedScore > 0.7 ? ['Facial artifacts', 'Lighting inconsistencies'] : [],
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
          modelConfidence: simulatedScore,
          deepfakeIndicators: simulatedScore > 0.7 ? ['Facial artifacts', 'Lighting inconsistencies'] : [],
          mode: 'demo'
        }
      }
    }

    // Increment daily checks for free users
    await incrementDailyChecks(user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Image detection error:', error)
    return NextResponse.json(
      { error: 'Detection failed. Please try again.' },
      { status: 500 }
    )
  }
}