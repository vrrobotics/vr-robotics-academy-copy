-- Run this in your NEW Supabase SQL Editor
-- Project URL: https://gyhszmbtfwqivnnazpch.supabase.co

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Demo bookings used by DemoBookingPage + Admin/Teacher demo pages
CREATE TABLE IF NOT EXISTS demosessions (
  _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  _createdDate TIMESTAMPTZ DEFAULT NOW(),
  _updatedDate TIMESTAMPTZ DEFAULT NOW(),
  parentName TEXT,
  parentEmail TEXT,
  parentPhone TEXT,
  childName TEXT,
  childAge INTEGER,
  preferredDate TEXT,
  preferredTime TEXT,
  status TEXT DEFAULT 'pending',
  teacherId TEXT,
  interests TEXT,
  message TEXT
);

-- Teacher approvals used by teacher signup/login/admin approval flows
CREATE TABLE IF NOT EXISTS teacherapprovals (
  _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  _createdDate TIMESTAMPTZ DEFAULT NOW(),
  _updatedDate TIMESTAMPTZ DEFAULT NOW(),
  teacherEmail TEXT,
  teacherFullName TEXT,
  teacherPhoneNumber TEXT,
  approvalStatus TEXT DEFAULT 'pending',
  submissionDate TIMESTAMPTZ,
  approvalDate TIMESTAMPTZ,
  approvedByAdmin TEXT,
  rejectionReason TEXT,
  submittedDocumentNames TEXT,
  submittedDocuments TEXT,
  password TEXT
);

-- Pricing plans (ProgramFeesPage reads this; if empty, frontend fallback still works)
CREATE TABLE IF NOT EXISTS programfees (
  _id TEXT PRIMARY KEY,
  _createdDate TIMESTAMPTZ DEFAULT NOW(),
  _updatedDate TIMESTAMPTZ DEFAULT NOW(),
  planName TEXT,
  price NUMERIC,
  billingCycle TEXT,
  shortDescription TEXT,
  featuresSummary TEXT,
  callToActionText TEXT,
  isRecommended BOOLEAN DEFAULT FALSE
);

-- New: paid session enrollments from pricing Razorpay success flow
CREATE TABLE IF NOT EXISTS sessionenrollments (
  _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  _createdDate TIMESTAMPTZ DEFAULT NOW(),
  _updatedDate TIMESTAMPTZ DEFAULT NOW(),
  paymentId TEXT,
  paymentStatus TEXT,
  studentName TEXT,
  studentEmail TEXT,
  studentPhone TEXT,
  planName TEXT,
  billingMode TEXT,
  amountUsd NUMERIC,
  source TEXT,
  enrolledAt TIMESTAMPTZ
);

ALTER TABLE demosessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacherapprovals ENABLE ROW LEVEL SECURITY;
ALTER TABLE programfees ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessionenrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON demosessions;
DROP POLICY IF EXISTS "Allow public insert access" ON demosessions;
DROP POLICY IF EXISTS "Allow public update access" ON demosessions;
DROP POLICY IF EXISTS "Allow public delete access" ON demosessions;

DROP POLICY IF EXISTS "Allow public read access" ON teacherapprovals;
DROP POLICY IF EXISTS "Allow public insert access" ON teacherapprovals;
DROP POLICY IF EXISTS "Allow public update access" ON teacherapprovals;
DROP POLICY IF EXISTS "Allow public delete access" ON teacherapprovals;

DROP POLICY IF EXISTS "Allow public read access" ON programfees;
DROP POLICY IF EXISTS "Allow public insert access" ON programfees;
DROP POLICY IF EXISTS "Allow public update access" ON programfees;
DROP POLICY IF EXISTS "Allow public delete access" ON programfees;

DROP POLICY IF EXISTS "Allow public read access" ON sessionenrollments;
DROP POLICY IF EXISTS "Allow public insert access" ON sessionenrollments;
DROP POLICY IF EXISTS "Allow public update access" ON sessionenrollments;
DROP POLICY IF EXISTS "Allow public delete access" ON sessionenrollments;

CREATE POLICY "Allow public read access" ON demosessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON demosessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON demosessions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON demosessions FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON teacherapprovals FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON teacherapprovals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON teacherapprovals FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON teacherapprovals FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON programfees FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON programfees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON programfees FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON programfees FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON sessionenrollments FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON sessionenrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON sessionenrollments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON sessionenrollments FOR DELETE USING (true);

-- Optional seed pricing rows
INSERT INTO programfees (_id, planName, price, billingCycle, shortDescription, featuresSummary, callToActionText, isRecommended)
VALUES
  ('plan-basic', 'Basic', 20, 'session', 'Perfect for learners who prefer collaborative group learning', 'Group Class - 20 Students Online', 'Start Learning', false),
  ('plan-premium', 'Premium', 25, 'session', 'Best for students seeking personalized attention and guidance', 'Small Group Class - 5 Students Online', 'Get Started Now', true),
  ('plan-elite', 'Elite', 30, 'session', 'Ultimate program for serious learners - fully customized learning', 'One-on-One Online Classes', 'Book Your Session', false)
ON CONFLICT (_id) DO NOTHING;
