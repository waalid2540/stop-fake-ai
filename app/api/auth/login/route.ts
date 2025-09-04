import { NextRequest, NextResponse } from 'next/server'
import { stopFakeAIDB } from '@/lib/universal-db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Authenticate user
    const result = await stopFakeAIDB.authenticateUser(email, password)

    return NextResponse.json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    })

  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.message.includes('not found') || error.message.includes('Invalid password')) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to sign in. Please try again.' },
      { status: 500 }
    )
  }
}