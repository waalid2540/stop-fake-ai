import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/auth'
import { stopFakeAIDB } from '@/lib/universal-db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      // Update user subscription in database
      await stopFakeAIDB.updateUserSubscription(
        user.id,
        'active',
        session.subscription as string
      )

      // Also update the subscription tier
      await stopFakeAIDB.updateSubscription(
        user.id,
        'yearly',
        session.customer as string,
        session.subscription as string
      )

      return NextResponse.json({ 
        success: true,
        message: 'Subscription activated successfully'
      })
    }

    return NextResponse.json({ 
      success: false,
      message: 'Payment not completed'
    })
  } catch (error: any) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}