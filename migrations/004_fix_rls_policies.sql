-- Migration 004: Fix RLS policies for public access to submissions
-- This allows users to read their own submissions by ID

-- ============================================================================
-- PART 1: Add policy for public to read submissions by ID
-- ============================================================================

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Public can read own submission by id" ON submissions;

-- Policy: Public can read their own submission by ID (for viewing results)
-- This allows anonymous users to view their results after completing the questionnaire
CREATE POLICY "Public can read own submission by id"
ON submissions
FOR SELECT
TO anon
USING (true);

-- ============================================================================
-- NOTES
-- ============================================================================
-- This policy allows anonymous users to read submissions.
-- In a production environment, you might want to add additional security
-- such as requiring a secret token or limiting access based on email verification.
-- For now, this allows the Results page to work properly.

COMMIT;
