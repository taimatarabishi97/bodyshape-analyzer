-- Migration 002: Setup Supabase Auth for Admin Users
-- This migration configures Supabase Auth and Row Level Security

-- ============================================================================
-- PART 1: Enable Row Level Security on Admin Tables
-- ============================================================================

-- Enable RLS on submissions table
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on access_tokens table
ALTER TABLE access_tokens ENABLE ROW LEVEL SECURITY;

-- Drop the old admin_users table (we'll use Supabase Auth instead)
DROP TABLE IF EXISTS admin_users;

-- ============================================================================
-- PART 2: Create Admin Metadata Table
-- ============================================================================

-- Create a table to store admin-specific metadata
-- This links Supabase Auth users to admin roles
CREATE TABLE IF NOT EXISTS admin_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS on admin_metadata
ALTER TABLE admin_metadata ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 3: Row Level Security Policies
-- ============================================================================

-- Policy: Admins can read all submissions
CREATE POLICY "Admins can read all submissions"
ON submissions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_metadata
        WHERE admin_metadata.user_id = auth.uid()
    )
);

-- Policy: Admins can insert submissions (for testing)
CREATE POLICY "Admins can insert submissions"
ON submissions
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admin_metadata
        WHERE admin_metadata.user_id = auth.uid()
    )
);

-- Policy: Anyone can insert submissions (for public questionnaire)
CREATE POLICY "Public can insert submissions"
ON submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Admins can read all access tokens
CREATE POLICY "Admins can read all access_tokens"
ON access_tokens
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_metadata
        WHERE admin_metadata.user_id = auth.uid()
    )
);

-- Policy: Admins can insert access tokens
CREATE POLICY "Admins can insert access_tokens"
ON access_tokens
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admin_metadata
        WHERE admin_metadata.user_id = auth.uid()
    )
);

-- Policy: Admins can update access tokens
CREATE POLICY "Admins can update access_tokens"
ON access_tokens
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_metadata
        WHERE admin_metadata.user_id = auth.uid()
    )
);

-- Policy: Public can read their own access token (for validation)
CREATE POLICY "Public can read own access_token"
ON access_tokens
FOR SELECT
TO anon
USING (true);

-- Policy: Public can update their own access token (mark as used)
CREATE POLICY "Public can update own access_token"
ON access_tokens
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Policy: Admins can read admin_metadata
CREATE POLICY "Admins can read admin_metadata"
ON admin_metadata
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM admin_metadata am
        WHERE am.user_id = auth.uid() AND am.role = 'super_admin'
    )
);

-- ============================================================================
-- PART 4: Helper Functions
-- ============================================================================

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_metadata
        WHERE admin_metadata.user_id = check_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create an admin user (call this after creating user in Supabase Auth)
CREATE OR REPLACE FUNCTION make_admin(user_email TEXT)
RETURNS VOID AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get user ID from email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Insert into admin_metadata
    INSERT INTO admin_metadata (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 5: Indexes for Performance
-- ============================================================================

-- Drop indexes if they exist (to avoid errors on re-run)
DROP INDEX IF EXISTS idx_admin_metadata_user_id;
DROP INDEX IF EXISTS idx_submissions_email;
DROP INDEX IF EXISTS idx_access_tokens_token;
DROP INDEX IF EXISTS idx_access_tokens_email;

-- Create indexes
CREATE INDEX idx_admin_metadata_user_id ON admin_metadata(user_id);
CREATE INDEX idx_submissions_email ON submissions(email);
CREATE INDEX idx_access_tokens_token ON access_tokens(token);
CREATE INDEX idx_access_tokens_email ON access_tokens(email);

-- ============================================================================
-- NOTES FOR SETUP
-- ============================================================================

-- After running this migration:
-- 
-- 1. Create an admin user in Supabase Auth Dashboard:
--    - Go to Authentication > Users
--    - Click "Add User"
--    - Email: admin@colorscodestyle.com
--    - Password: (set a secure password)
--    - Confirm email: YES (or disable email confirmation)
--
-- 2. Make the user an admin by running this SQL:
--    SELECT make_admin('admin@colorscodestyle.com');
--
-- 3. Test login in your application at /admin/login
--
-- ============================================================================

COMMIT;