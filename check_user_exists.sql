-- Diagnostic query to check if your user exists in Supabase Auth
-- Run this in Supabase SQL Editor to see if the user is there

SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    confirmed_at
FROM auth.users
WHERE email ILIKE '%taima%';

-- This will show you:
-- 1. If the user exists
-- 2. The exact email spelling
-- 3. If the email is confirmed
-- 4. When the user was created

-- If you see your user listed, copy the exact email and try:
-- SELECT make_admin('exact-email-from-above@hotmail.com');
