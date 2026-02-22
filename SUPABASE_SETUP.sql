-- VR Robotics Academy - Supabase Database Schema Setup
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- Drop existing tables first (CASCADE will automatically drop policies)
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS robotavatarskins CASCADE;
DROP TABLE IF EXISTS gamemissions CASCADE;
DROP TABLE IF EXISTS coursemodules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS demosessions CASCADE;
DROP TABLE IF EXISTS upcomingclasses CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS teacherapprovals CASCADE;
DROP TABLE IF EXISTS studentapprovals CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;  
DROP TABLE IF EXISTS students CASCADE;

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  grade_level INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Teachers table
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  experience_years INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Student Approvals table
CREATE TABLE studentapprovals (
  _id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fullName VARCHAR(255),
  email VARCHAR(255),
  phoneNumber VARCHAR(20),
  age INTEGER,
  gender VARCHAR(50),
  interests TEXT,
  submissionDate TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  approvalDate TIMESTAMP,
  approvedByAdmin VARCHAR(255),
  rejectionReason TEXT,
  _createdDate TIMESTAMP DEFAULT NOW(),
  _updatedDate TIMESTAMP DEFAULT NOW()
);

-- Teacher Approvals table
CREATE TABLE teacherapprovals (
  _id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fullName VARCHAR(255),
  email VARCHAR(255),
  phoneNumber VARCHAR(20),
  experience VARCHAR(255),
  subject VARCHAR(255),
  submissionDate TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  approvalDate TIMESTAMP,
  approvedByAdmin VARCHAR(255),
  rejectionReason TEXT,
  _createdDate TIMESTAMP DEFAULT NOW(),
  _updatedDate TIMESTAMP DEFAULT NOW()
);

-- Batches table
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  teacher_id UUID REFERENCES teachers(id),
  grade_level INTEGER,
  module_id INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  batch_id UUID REFERENCES batches(id),
  enrollment_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Upcoming Classes table
CREATE TABLE upcomingclasses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES batches(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Demo Sessions table
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

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  grade_level INTEGER,
  modules_count INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Course Modules table
CREATE TABLE coursemodules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  module_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  grade_level_min INTEGER,
  grade_level_max INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Game Missions table
CREATE TABLE gamemissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(50),
  points INTEGER DEFAULT 100,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Robot Avatar Skins table
CREATE TABLE robotavatarskins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50),
  description TEXT,
  unlocked_by_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  unlock_condition VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE studentapprovals ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacherapprovals ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcomingclasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE demosessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coursemodules ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamemissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE robotavatarskins ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Create public access policies (for development only - restrict in production)
-- SELECT (Read)
CREATE POLICY "Allow public read access" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON teachers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON studentapprovals FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON teacherapprovals FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON batches FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON enrollments FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON upcomingclasses FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON demosessions FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON coursemodules FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON gamemissions FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON robotavatarskins FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON badges FOR SELECT USING (true);

-- INSERT (Write)
CREATE POLICY "Allow public insert access" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON studentapprovals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON teacherapprovals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON batches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON upcomingclasses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON demosessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON coursemodules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON gamemissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON robotavatarskins FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON badges FOR INSERT WITH CHECK (true);

-- UPDATE (Modify)
CREATE POLICY "Allow public update access" ON students FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON teachers FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON studentapprovals FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON teacherapprovals FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON batches FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON enrollments FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON upcomingclasses FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON demosessions FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON courses FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON coursemodules FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON gamemissions FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON robotavatarskins FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON badges FOR UPDATE USING (true);

-- DELETE (Remove)
CREATE POLICY "Allow public delete access" ON students FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON teachers FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON studentapprovals FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON teacherapprovals FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON batches FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON enrollments FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON upcomingclasses FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON demosessions FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON courses FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON coursemodules FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON gamemissions FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON robotavatarskins FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON badges FOR DELETE USING (true);
