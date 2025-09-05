import { getStripeJs } from './stripe'

export async function createCheckoutSession(priceId: string) {
  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ priceId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create checkout session')
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