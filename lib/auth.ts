// PostgreSQL-based authentication system
import { NextRequest } from 'next/server'
import { stopFakeAIDB } from './universal-db'

export async function getUser() {
  try {
    // For server-side usage, this will be called from API routes with proper token
    // For development, return a mock user
    if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
      return {
        id: 'dev-user-123',
        email: 'demo@stopfakeai.com',
        user_metadata: { full_name: 'Demo User' }
      } as any
    }
    return null // Will be handled by requireAuth
  } catch (error) {
    return null
  }
}

export async function requireAuth(request?: NextRequest | Request) {
  try {
    // Try to get token from Authorization header
    let token: string | null = null
    
    if (request) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
      }
    }

    if (!token) {
      throw new Error('No authentication token provided')
    }

    // Verify token and get user data
    const auth = await stopFakeAIDB.verifyToken(token)
    return {
      id: auth.userId.toString(),
      email: auth.email,
      subscription_tier: auth.user.subscriptionTier,
      daily_checks: auth.user.dailyChecks,
      stripe_customer_id: auth.user.stripeCustomerId
    }
  } catch (error) {
    // For development without DATABASE_URL, return mock user
    if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
      return {
        id: 'dev-user-123',
        email: 'demo@stopfakeai.com',
        subscription_tier: 'free',
        daily_checks: 0
      } as any
    }
    throw new Error('Authentication failed')
  }
}

export async function getUserSubscription(userId: string) {
  try {
    // Convert string ID to number for PostgreSQL
    const numericUserId = parseInt(userId)
    const auth = await stopFakeAIDB.verifyToken(userId) // This will need to be called with proper token
    
    return {
      subscription_tier: auth.user.subscriptionTier as 'free' | 'yearly' | 'pro',
      daily_checks: auth.user.dailyChecks,
      last_check_reset: auth.user.lastCheckReset
    }
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

export async function checkDailyLimit(userId: string | number): Promise<boolean> {
  try {
    const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId
    return await stopFakeAIDB.checkDailyLimit(numericUserId)
  } catch (error) {
    // Allow unlimited checks in development
    if (process.env.NODE_ENV === 'development') {
      return true
    }
    return false
  }
}

export async function incrementDailyChecks(userId: string | number) {
  try {
    const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId
    await stopFakeAIDB.incrementDailyChecks(numericUserId)
  } catch (error) {
    // Silently fail in development
    if (process.env.NODE_ENV !== 'development') {
      console.error('Failed to increment daily checks:', error)
    }
  }
}

// For backward compatibility with existing code
export { stopFakeAIDB as supabase }

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      sfa_users: {
        Row: {
          id: number
          email: string
          subscription_tier: 'free' | 'yearly' | 'pro'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          daily_checks: number
          last_check_reset: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sfa_users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sfa_users']['Insert']>
      }
    }
  }
}