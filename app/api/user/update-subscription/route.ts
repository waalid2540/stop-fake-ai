import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // Create database connection
    const { Pool } = require('pg')
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
    
    const client = await pool.connect()
    try {
      // Manually update to yearly subscription
      await client.query(
        `UPDATE sfa_users 
         SET subscription_tier = 'yearly',
             daily_checks = 0
         WHERE id = $1`,
        [user.id]
      )

      return NextResponse.json({
        success: true,
        message: 'Subscription updated to yearly',
        subscription_tier: 'yearly'
      })
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error: any) {
    console.error('Subscription update error:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}