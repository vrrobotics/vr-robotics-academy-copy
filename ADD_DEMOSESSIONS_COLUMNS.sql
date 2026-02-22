-- Add missing columns to demosessions table
-- Run this in Supabase SQL Editor

-- Drop the existing table and recreate with new columns
-- First, backup any existing data if needed
DROP TABLE IF EXISTS demosessions CASCADE;

CREATE TABLE demosessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_email VARCHAR(255) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  scheduled_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  parent_name VARCHAR(255),
  parent_phone VARCHAR(20),
  student_age INTEGER,
  preferred_time VARCHAR(50),
  interests VARCHAR(255),
  message TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Re-enable RLS
ALTER TABLE demosessions ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Allow public read access" ON demosessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON demosessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON demosessions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON demosessions FOR DELETE USING (true);
