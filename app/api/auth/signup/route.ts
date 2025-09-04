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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Initialize database tables if needed
    await stopFakeAIDB.initializeTables()

    // Create user
    const result = await stopFakeAIDB.createUser(email, password)

    return NextResponse.json({
      message: 'Account created successfully',
      user: result.user,
      token: result.token
    })

  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}