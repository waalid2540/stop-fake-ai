import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { stopFakeAIDB } from '@/lib/universal-db'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // Get fresh user data from database
    // We need to create a new connection since pool is private
    const { Pool } = require('pg')
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
    const client = await pool.connect()
    try {
      const result = await client.query(
        `SELECT subscription_tier, daily_checks, last_check_reset, stripe_subscription_id
         FROM sfa_users 
         WHERE id = $1`,
        [user.id]
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const userData = result.rows[0]
      
      return NextResponse.json({
        subscription_tier: userData.subscription_tier,
        daily_checks: userData.daily_checks,
        last_check_reset: userData.last_check_reset,
        has_active_subscription: userData.subscription_tier !== 'free',
        stripe_subscription_id: userData.stripe_subscription_id
      })
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error: any) {
    console.error('User status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user status' },
      { status: 500 }
    )
  }
}