import { Pool } from 'pg'

// Singleton connection pool for better performance at scale
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const pool = getPool()
  const result = await pool.query(text, params)
  return result
}

// Graceful shutdown
export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}