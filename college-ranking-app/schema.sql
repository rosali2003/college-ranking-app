-- College Rankings Database Schema
-- This file contains the SQL schema for the college rankings application

-- Create database (run this first if creating a new database)
-- CREATE DATABASE college_rankings;

-- Colleges table
CREATE TABLE IF NOT EXISTS colleges (
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
  majors TEXT[], -- PostgreSQL array type
  overall_rating DECIMAL(3,2),
  total_votes INTEGER DEFAULT 0,
  first_choice_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professions table
CREATE TABLE IF NOT EXISTS professions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profession rankings table
CREATE TABLE IF NOT EXISTS profession_rankings (
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
CREATE TABLE IF NOT EXISTS user_rankings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  college_id VARCHAR(50) REFERENCES colleges(id) ON DELETE CASCADE,
  profession_id INTEGER REFERENCES professions(id) ON DELETE SET NULL,
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
CREATE INDEX IF NOT EXISTS idx_profession_rankings_profession ON profession_rankings(profession_id);
CREATE INDEX IF NOT EXISTS idx_profession_rankings_rating ON profession_rankings(rating DESC);
CREATE INDEX IF NOT EXISTS idx_user_rankings_user ON user_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rankings_college ON user_rankings(college_id);
CREATE INDEX IF NOT EXISTS idx_colleges_rating ON colleges(overall_rating DESC);
CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(type);
CREATE INDEX IF NOT EXISTS idx_colleges_size ON colleges(size);

-- Insert initial professions
INSERT INTO professions (name, description) VALUES 
  ('Software Engineering', 'Computer science and software development careers'),
  ('Investment Banking', 'Financial services and investment careers'),
  ('Medicine', 'Medical and healthcare careers')
ON CONFLICT (name) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profession_rankings_updated_at BEFORE UPDATE ON profession_rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_rankings_updated_at BEFORE UPDATE ON user_rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
