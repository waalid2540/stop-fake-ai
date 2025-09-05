import { getStripeJs } from './stripe'

export async function createCheckoutSession(priceId: string) {
  console.log('Creating checkout session with price ID:', priceId)
  const token = localStorage.getItem('token')
  console.log('Auth token exists:', !!token)
  
  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ priceId }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Checkout error:', error)
    throw new Error(error.error || error.message || 'Failed to create checkout session')
  }

  const { sessionId } = await response.json()
  const stripe = await getStripeJs()
  
  if (!stripe) {
    throw new Error('Stripe.js failed to load')
  }

  const { error } = await stripe.redirectToCheckout({ sessionId })
  
  if (error) {
    throw error
  }
}

export async function createPortalSession() {
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create portal session')
  }

  const { url } = await response.json()
  window.location.href = url
}