import { Pool, PoolClient } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Universal Database Connection for All Your SaaS Projects
class UniversalDB {
  private pool: Pool
  private prefix: string

  constructor(projectPrefix: string = 'sfa') {
    this.prefix = projectPrefix
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
  }

  // Initialize tables for this SaaS project
  async initializeTables() {
    const client = await this.pool.connect()
    
    try {
      // Users table for this project
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${this.prefix}_users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'yearly', 'pro')),
          stripe_customer_id VARCHAR(255),
          stripe_subscription_id VARCHAR(255),
          daily_checks INTEGER DEFAULT 0,
          last_check_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // Payments table for this project
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${this.prefix}_payments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES ${this.prefix}_users(id) ON DELETE CASCADE,
          stripe_payment_id VARCHAR(255),
          stripe_session_id VARCHAR(255),
          amount DECIMAL(10,2),
          currency VARCHAR(10) DEFAULT 'usd',
          status VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // AI Detections table for this project
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${this.prefix}_detections (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES ${this.prefix}_users(id) ON DELETE CASCADE,
          content_type VARCHAR(50) CHECK (content_type IN ('text', 'image', 'audio')),
          result JSONB,
          confidence_score DECIMAL(5,4),
          language_detected VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // Usage tracking table
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${this.prefix}_usage (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES ${this.prefix}_users(id) ON DELETE CASCADE,
          endpoint VARCHAR(100),
          date DATE DEFAULT CURRENT_DATE,
          count INTEGER DEFAULT 1,
          UNIQUE(user_id, endpoint, date)
        )
      `)

      console.log(`✅ Tables initialized for ${this.prefix} project`)
    } finally {
      client.release()
    }
  }

  // User Authentication Methods
  async createUser(email: string, password: string) {
    const client = await this.pool.connect()
    
    try {
      // Check if user exists
      const existingUser = await client.query(
        `SELECT id FROM ${this.prefix}_users WHERE email = $1`,
        [email]
      )
      
      if (existingUser.rows.length > 0) {
        throw new Error('User already exists')
      }

      // Hash password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      // Create user
      const result = await client.query(
        `INSERT INTO ${this.prefix}_users (email, password_hash) 
         VALUES ($1, $2) 
         RETURNING id, email, subscription_tier, created_at`,
        [email, passwordHash]
      )

      const user = result.rows[0]
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          project: this.prefix 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      return { 
        user: {
          id: user.id,
          email: user.email,
          subscriptionTier: user.subscription_tier,
          createdAt: user.created_at
        }, 
        token 
      }
    } finally {
      client.release()
    }
  }

  async authenticateUser(email: string, password: string) {
    const client = await this.pool.connect()
    
    try {
      // Get user with password hash
      const result = await client.query(
        `SELECT id, email, password_hash, subscription_tier, stripe_customer_id, 
                daily_checks, last_check_reset 
         FROM ${this.prefix}_users 
         WHERE email = $1`,
        [email]
      )

      if (result.rows.length === 0) {
        throw new Error('User not found')
      }

      const user = result.rows[0]

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash)
      if (!isValid) {
        throw new Error('Invalid password')
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          project: this.prefix 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      return { 
        user: {
          id: user.id,
          email: user.email,
          subscriptionTier: user.subscription_tier,
          stripeCustomerId: user.stripe_customer_id,
          dailyChecks: user.daily_checks,
          lastCheckReset: user.last_check_reset
        }, 
        token 
      }
    } finally {
      client.release()
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      
      if (decoded.project !== this.prefix) {
        throw new Error('Invalid token for this project')
      }

      // Get fresh user data
      const client = await this.pool.connect()
      try {
        const result = await client.query(
          `SELECT id, email, subscription_tier, stripe_customer_id, 
                  daily_checks, last_check_reset 
           FROM ${this.prefix}_users 
           WHERE id = $1`,
          [decoded.userId]
        )

        if (result.rows.length === 0) {
          throw new Error('User not found')
        }

        return {
          userId: decoded.userId,
          email: decoded.email,
          user: {
            id: result.rows[0].id,
            email: result.rows[0].email,
            subscriptionTier: result.rows[0].subscription_tier,
            stripeCustomerId: result.rows[0].stripe_customer_id,
            dailyChecks: result.rows[0].daily_checks,
            lastCheckReset: result.rows[0].last_check_reset
          }
        }
      } finally {
        client.release()
      }
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  // Usage Tracking
  async trackUsage(userId: number, endpoint: string) {
    const client = await this.pool.connect()
    
    try {
      await client.query(
        `INSERT INTO ${this.prefix}_usage (user_id, endpoint) 
         VALUES ($1, $2)
         ON CONFLICT (user_id, endpoint, date) 
         DO UPDATE SET count = ${this.prefix}_usage.count + 1`,
        [userId, endpoint]
      )
    } finally {
      client.release()
    }
  }

  // Daily Limits
  async checkDailyLimit(userId: number): Promise<boolean> {
    const client = await this.pool.connect()
    
    try {
      const result = await client.query(
        `SELECT subscription_tier, daily_checks, last_check_reset 
         FROM ${this.prefix}_users 
         WHERE id = $1`,
        [userId]
      )

      if (result.rows.length === 0) return false

      const user = result.rows[0]
      
      // Reset daily checks if it's a new day
      const lastReset = new Date(user.last_check_reset)
      const now = new Date()
      
      if (now.toDateString() !== lastReset.toDateString()) {
        await client.query(
          `UPDATE ${this.prefix}_users 
           SET daily_checks = 0, last_check_reset = NOW() 
           WHERE id = $1`,
          [userId]
        )
        return true // Reset, so they can continue
      }

      // Check limits based on subscription
      if (user.subscription_tier === 'free' && user.daily_checks >= 3) {
        return false
      }

      return true // Paid users have unlimited
    } finally {
      client.release()
    }
  }

  async incrementDailyChecks(userId: number) {
    const client = await this.pool.connect()
    
    try {
      await client.query(
        `UPDATE ${this.prefix}_users 
         SET daily_checks = daily_checks + 1 
         WHERE id = $1`,
        [userId]
      )
    } finally {
      client.release()
    }
  }

  // Payment Methods
  async updateSubscription(userId: number, subscriptionTier: string, stripeCustomerId?: string, stripeSubscriptionId?: string) {
    const client = await this.pool.connect()
    
    try {
      await client.query(
        `UPDATE ${this.prefix}_users 
         SET subscription_tier = $1, stripe_customer_id = $2, stripe_subscription_id = $3
         WHERE id = $4`,
        [subscriptionTier, stripeCustomerId, stripeSubscriptionId, userId]
      )
    } finally {
      client.release()
    }
  }

  async recordPayment(userId: number, stripePaymentId: string, amount: number, status: string) {
    const client = await this.pool.connect()
    
    try {
      await client.query(
        `INSERT INTO ${this.prefix}_payments (user_id, stripe_payment_id, amount, status) 
         VALUES ($1, $2, $3, $4)`,
        [userId, stripePaymentId, amount, status]
      )
    } finally {
      client.release()
    }
  }

  // Detection Methods
  async recordDetection(userId: number, contentType: string, result: any, confidenceScore: number, languageDetected?: string) {
    const client = await this.pool.connect()
    
    try {
      await client.query(
        `INSERT INTO ${this.prefix}_detections (user_id, content_type, result, confidence_score, language_detected) 
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, contentType, JSON.stringify(result), confidenceScore, languageDetected]
      )
    } finally {
      client.release()
    }
  }

  async close() {
    await this.pool.end()
  }
}

// Export instances for different projects
export const stopFakeAIDB = new UniversalDB('sfa') // Stop Fake AI
export const universalDB = UniversalDB // Class for other projects

// Export helper functions
export async function requireAuth(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No token provided')
  }

  const token = authHeader.split(' ')[1]
  return await stopFakeAIDB.verifyToken(token)
}

export default UniversalDB