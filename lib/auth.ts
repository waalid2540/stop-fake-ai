import { createServerClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function getUser() {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    // Return a mock user for development when Supabase is not configured
    if (process.env.NODE_ENV === 'development') {
      return {
        id: 'dev-user-123',
        email: 'demo@stopfakeai.com',
        user_metadata: { full_name: 'Demo User' }
      } as any
    }
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function getUserSubscription(userId: string) {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('users')
      .select('subscription_tier, daily_checks, last_check_reset')
      .eq('id', userId)
      .single()
    
    return data
  } catch (error) {
    // Return mock subscription data for development
    if (process.env.NODE_ENV === 'development') {
      return {
        subscription_tier: 'free' as const,
        daily_checks: 0,
        last_check_reset: new Date().toISOString()
      }
    }
    return null
  }
}

export async function checkDailyLimit(userId: string): Promise<boolean> {
  try {
    const supabase = createServerClient()
    const subscription = await getUserSubscription(userId)
    
    if (!subscription) return false
    
    if (subscription.subscription_tier !== 'free') {
      return true // Unlimited for paid users
    }
    
    // Reset daily checks if it's a new day
    const lastReset = new Date(subscription.last_check_reset)
    const now = new Date()
    
    if (lastReset.toDateString() !== now.toDateString()) {
      await supabase
        .from('users')
        .update({ daily_checks: 0, last_check_reset: now.toISOString() })
        .eq('id', userId)
      
      return true
    }
    
    return subscription.daily_checks < 3
  } catch (error) {
    // Allow unlimited checks in development
    if (process.env.NODE_ENV === 'development') {
      return true
    }
    return false
  }
}

export async function incrementDailyChecks(userId: string) {
  try {
    const supabase = createServerClient()
    const subscription = await getUserSubscription(userId)
    
    if (subscription?.subscription_tier === 'free') {
      await supabase
        .from('users')
        .update({ daily_checks: subscription.daily_checks + 1 })
        .eq('id', userId)
    }
  } catch (error) {
    // Silently fail in development
    if (process.env.NODE_ENV !== 'development') {
      console.error('Failed to increment daily checks:', error)
    }
  }
}