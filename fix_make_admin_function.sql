-- Fix for the make_admin() function
-- Run this SQL in your Supabase SQL Editor to fix the ambiguous column reference error

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

-- After running the above, use this to make your user an admin:
-- SELECT make_admin('your-email@example.com');
-- (Replace 'your-email@example.com' with your actual admin email)
