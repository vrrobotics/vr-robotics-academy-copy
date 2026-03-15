-- Fix studentapprovals table - Add missing fullName column
-- Run this in your Supabase SQL Editor

-- Step 1: Add fullName column if it doesn't exist
ALTER TABLE studentapprovals 
ADD COLUMN IF NOT EXISTS fullName VARCHAR(255);

-- Step 2: Verify the column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'studentapprovals';

-- If you need to add other missing columns:
ALTER TABLE studentapprovals 
ADD COLUMN IF NOT EXISTS phoneNumber VARCHAR(20),
ADD COLUMN IF NOT EXISTS interests TEXT,
ADD COLUMN IF NOT EXISTS approvalDate TIMESTAMP,
ADD COLUMN IF NOT EXISTS approvedByAdmin VARCHAR(255),
ADD COLUMN IF NOT EXISTS rejectionReason TEXT;
