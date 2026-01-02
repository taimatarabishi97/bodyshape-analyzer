-- Seed Admin User
-- This creates a default admin user for initial setup
-- 
-- IMPORTANT: Change this password immediately after first login!
-- Default credentials:
--   Email: admin@example.com
--   Password: ChangeMe123!
--
-- To generate a new password hash, use bcrypt with 10 rounds

-- Insert default admin user
-- Password hash for "ChangeMe123!" (bcrypt, 10 rounds)
INSERT INTO admin_users (email, password_hash)
VALUES (
    'admin@example.com',
    '$2a$10$rQ3qY5Y5Y5Y5Y5Y5Y5Y5Y.5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y'
)
ON CONFLICT (email) DO NOTHING;

-- Note: The above hash is a placeholder. To create a real hash:
-- 1. Use Node.js: 
--    const bcrypt = require('bcryptjs');
--    const hash = await bcrypt.hash('YourPassword', 10);
--    console.log(hash);
--
-- 2. Or use an online bcrypt generator (use 10 rounds)
--
-- 3. Replace the hash in this file before running the migration

COMMENT ON TABLE admin_users IS 'Default admin: admin@example.com / ChangeMe123! - CHANGE IMMEDIATELY!';