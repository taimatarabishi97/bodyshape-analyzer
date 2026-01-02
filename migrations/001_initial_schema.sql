-- Body Shape Analysis Database Schema
-- This migration creates all necessary tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Submissions table: stores all user questionnaire submissions and results
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    questionnaire_answers JSONB NOT NULL,
    measurements JSONB,
    body_shape_result VARCHAR(50) NOT NULL,
    styling_recommendations JSONB NOT NULL,
    access_token_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_submissions_email ON submissions(email);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_body_shape ON submissions(body_shape_result);

-- Admin users table: stores admin credentials
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access tokens table: for Shopify integration and access control
CREATE TABLE IF NOT EXISTS access_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('basic', 'standard', 'premium')),
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE,
    shopify_order_id VARCHAR(255)
);

-- Create indexes for access tokens
CREATE INDEX idx_access_tokens_token ON access_tokens(token);
CREATE INDEX idx_access_tokens_email ON access_tokens(email);
CREATE INDEX idx_access_tokens_is_used ON access_tokens(is_used);

-- Add foreign key constraint
ALTER TABLE submissions 
ADD CONSTRAINT fk_access_token 
FOREIGN KEY (access_token_id) 
REFERENCES access_tokens(id) 
ON DELETE SET NULL;

-- Add comments for documentation
COMMENT ON TABLE submissions IS 'Stores all body shape analysis submissions with questionnaire answers and results';
COMMENT ON TABLE admin_users IS 'Stores admin user credentials for dashboard access';
COMMENT ON TABLE access_tokens IS 'Manages access tokens for paid users, prepared for Shopify integration';

COMMENT ON COLUMN submissions.questionnaire_answers IS 'JSON object containing all questionnaire responses';
COMMENT ON COLUMN submissions.measurements IS 'Optional JSON object with height, weight, bust, waist, hips, shoulder measurements';
COMMENT ON COLUMN submissions.styling_recommendations IS 'Complete analysis result including body shape, recommendations, tips';
COMMENT ON COLUMN access_tokens.tier IS 'Service tier: basic, standard, or premium';
COMMENT ON COLUMN access_tokens.shopify_order_id IS 'Shopify order ID for tracking purchases';