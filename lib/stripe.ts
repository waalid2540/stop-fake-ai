import Stripe from 'stripe'

// TODO: Replace with your Stripe secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const getStripeJs = async () => {
  const { loadStripe } = await import('@stripe/stripe-js')
  // TODO: Replace with your Stripe publishable key
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    checks: 3,
    period: 'day',
  },
  yearly: {
    name: 'Yearly',
    price: 9.99,
    checks: 'unlimited',
    period: 'year',
    // TODO: Replace with your Stripe price ID for yearly plan
    stripePriceId: process.env.STRIPE_YEARLY_PRICE_ID!,
  },
  pro: {
    name: 'Pro',
    price: 99,
    checks: 'unlimited',
    period: 'year',
    features: ['Priority support', 'API access', 'Bulk detection'],
    // TODO: Replace with your Stripe price ID for pro plan
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID!,
  },
}