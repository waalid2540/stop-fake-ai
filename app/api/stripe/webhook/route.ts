import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stopFakeAIDB } from '@/lib/universal-db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          // Handle successful subscription
          const userId = session.metadata?.userId
          const customerEmail = session.customer_email
          
          if (userId) {
            // Update user subscription status in database
            await stopFakeAIDB.updateUserSubscription(
              parseInt(userId),
              'active',
              session.subscription as string
            )
            
            console.log(`Subscription activated for user ${userId}`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Find user by customer ID
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if (customer && !customer.deleted) {
          // Update subscription status based on subscription status
          const status = subscription.status === 'active' ? 'active' : 'inactive'
          
          // You might need to store customer ID in your database to make this lookup
          console.log(`Subscription ${subscription.status} for customer ${customer.email}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Handle subscription cancellation
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if (customer && !customer.deleted) {
          console.log(`Subscription cancelled for customer ${customer.email}`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Handle successful recurring payment
        console.log(`Payment succeeded for subscription ${invoice.subscription}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Handle failed payment
        console.log(`Payment failed for subscription ${invoice.subscription}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}