// Simple database utilities without ORM
// This can be extended to work with any database (PostgreSQL, MySQL, SQLite, etc.)

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

// Example database connection function
export async function connectToDatabase(config: DatabaseConfig) {
  // This is a placeholder - you would implement actual database connection here
  // For example, with PostgreSQL:
  // const { Pool } = require('pg')
  // const pool = new Pool(config)
  // return pool
  
  console.log('Database connection configured:', {
    host: config.host,
    port: config.port,
    database: config.database
  })
  
  return {
    query: async (sql: string, params?: any[]) => {
      // Placeholder for actual database query
      console.log('Executing query:', sql, params)
      return { rows: [], rowCount: 0 }
    },
    close: async () => {
      console.log('Database connection closed')
    }
  }
}

// Example query functions for rankings
export class RankingsDatabase {
  private db: any

  constructor(database: any) {
    this.db = database
  }

  async getSoftwareEngineeringRankings(limit?: number, sortBy?: string, order?: string) {
    const limitClause = limit ? `LIMIT ${limit}` : ''
    const orderBy = sortBy ? `ORDER BY ${sortBy} ${order || 'DESC'}` : 'ORDER BY rating DESC'
    
    const query = `
      SELECT 
        c.id as college_id,
        c.name as college_name,
        r.rating,
        r.votes,
        r.average_salary,
        r.employment_rate
      FROM colleges c
      JOIN profession_rankings r ON c.id = r.college_id
      JOIN professions p ON r.profession_id = p.id
      WHERE p.name = 'Software Engineering'
      ${orderBy}
      ${limitClause}
    `
    
    return await this.db.query(query)
  }

  async updateRanking(collegeId: string, profession: string, data: any) {
    const query = `
      UPDATE profession_rankings 
      SET rating = $1, votes = $2, average_salary = $3, employment_rate = $4
      WHERE college_id = $5 AND profession_id = (SELECT id FROM professions WHERE name = $6)
    `
    
    const params = [
      data.rating,
      data.votes,
      data.averageSalary,
      data.employmentRate,
      collegeId,
      profession
    ]
    
    return await this.db.query(query, params)
  }

  async addRanking(collegeId: string, profession: string, data: any) {
    const query = `
      INSERT INTO profession_rankings (college_id, profession_id, rating, votes, average_salary, employment_rate)
      VALUES ($1, (SELECT id FROM professions WHERE name = $2), $3, $4, $5, $6)
    `
    
    const params = [
      collegeId,
      profession,
      data.rating,
      data.votes,
      data.averageSalary,
      data.employmentRate
    ]
    
    return await this.db.query(query, params)
  }
}

// Example SQL schema for reference
export const DATABASE_SCHEMA = `
-- Colleges table
CREATE TABLE colleges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('public', 'private')),
  size VARCHAR(20) NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  tuition INTEGER NOT NULL,
  acceptance_rate DECIMAL(5,2) NOT NULL,
  average_gpa DECIMAL(3,2) NOT NULL,
  average_sat INTEGER NOT NULL,
  image VARCHAR(255),
  description TEXT,
  overall_rating DECIMAL(3,2),
  total_votes INTEGER DEFAULT 0,
  first_choice_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professions table
CREATE TABLE professions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profession rankings table
CREATE TABLE profession_rankings (
  id SERIAL PRIMARY KEY,
  college_id VARCHAR(50) REFERENCES colleges(id) ON DELETE CASCADE,
  profession_id INTEGER REFERENCES professions(id) ON DELETE CASCADE,
  rating DECIMAL(3,2) NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  average_salary INTEGER NOT NULL,
  employment_rate INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(college_id, profession_id)
);

-- User rankings table
CREATE TABLE user_rankings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  college_id VARCHAR(50) REFERENCES colleges(id) ON DELETE CASCADE,
  profession_id INTEGER REFERENCES professions(id) ON DELETE CASCADE,
  academics INTEGER NOT NULL CHECK (academics >= 1 AND academics <= 5),
  campus_life INTEGER NOT NULL CHECK (campus_life >= 1 AND campus_life <= 5),
  career_services INTEGER NOT NULL CHECK (career_services >= 1 AND career_services <= 5),
  facilities INTEGER NOT NULL CHECK (facilities >= 1 AND facilities <= 5),
  value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
  overall DECIMAL(3,2) NOT NULL,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_profession_rankings_profession ON profession_rankings(profession_id);
CREATE INDEX idx_profession_rankings_rating ON profession_rankings(rating DESC);
CREATE INDEX idx_user_rankings_user ON user_rankings(user_id);
CREATE INDEX idx_user_rankings_college ON user_rankings(college_id);
`
