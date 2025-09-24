import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { DB } from './types'

// Database configuration
const pool = new Pool({
  database: process.env.DATABASE_NAME || 'college_rankings',
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'rosali',
  password: process.env.DATABASE_PASSWORD || '',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})


const dialect = new PostgresDialect({
  pool,
})

// Create Kysely database instance
export const db = new Kysely<DB>({
  dialect,
})
