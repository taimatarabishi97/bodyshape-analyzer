-- Migration 003: Seed Data (Optional)
-- This migration adds sample data for testing

-- ============================================================================
-- PART 1: Sample Access Tokens (for testing access gate)
-- ============================================================================

-- Insert sample access tokens for testing
-- These can be used to test the access gate functionality

INSERT INTO access_tokens (token, email, tier, is_used, expires_at) VALUES
    ('test-basic-token-123', 'test@example.com', 'basic', false, NOW() + INTERVAL '30 days'),
    ('test-standard-token-456', 'premium@example.com', 'standard', false, NOW() + INTERVAL '30 days'),
    ('test-premium-token-789', 'vip@example.com', 'premium', false, NOW() + INTERVAL '30 days'),
    ('used-token-abc', 'used@example.com', 'basic', true, NOW() + INTERVAL '30 days'),
    ('expired-token-xyz', 'expired@example.com', 'basic', false, NOW() - INTERVAL '1 day')
ON CONFLICT (token) DO NOTHING;

-- ============================================================================
-- PART 2: Sample Submissions (for testing admin dashboard)
-- ============================================================================

-- Insert sample submissions for testing admin dashboard
INSERT INTO submissions (
    email,
    questionnaire_answers,
    measurements,
    body_shape_result,
    styling_recommendations
) VALUES
    (
        'sample1@example.com',
        '{
            "shoulderWidth": "average",
            "hipWidth": "wide",
            "waistDefinition": "very-defined",
            "weightDistribution": "lower-body",
            "bustSize": "medium",
            "largestBodyPart": "hips",
            "smallestBodyPart": "waist",
            "bodyFrameSize": "average"
        }'::jsonb,
        '{
            "height": 165,
            "weight": 60,
            "bust": 90,
            "waist": 68,
            "hips": 98
        }'::jsonb,
        'pear',
        '{
            "bodyShape": "pear",
            "description": "Your body shape is characterized by a smaller upper body and fuller hips and thighs.",
            "stylingRecommendations": [],
            "colorTips": ["Wear brighter colors on top", "Darker colors on bottom"],
            "fitTips": ["A-line skirts", "Bootcut jeans"]
        }'::jsonb
    ),
    (
        'sample2@example.com',
        '{
            "shoulderWidth": "broad",
            "hipWidth": "average",
            "waistDefinition": "somewhat-defined",
            "weightDistribution": "evenly",
            "bustSize": "large",
            "largestBodyPart": "bust",
            "smallestBodyPart": "hips",
            "bodyFrameSize": "average"
        }'::jsonb,
        null,
        'inverted-triangle',
        '{
            "bodyShape": "inverted-triangle",
            "description": "Your body shape features broader shoulders and a narrower lower body.",
            "stylingRecommendations": [],
            "colorTips": ["Balance with darker tops", "Brighter bottoms"],
            "fitTips": ["V-neck tops", "Flared pants"]
        }'::jsonb
    ),
    (
        'sample3@example.com',
        '{
            "shoulderWidth": "average",
            "hipWidth": "average",
            "waistDefinition": "very-defined",
            "weightDistribution": "evenly",
            "bustSize": "medium",
            "largestBodyPart": "bust",
            "smallestBodyPart": "waist",
            "bodyFrameSize": "average"
        }'::jsonb,
        '{
            "height": 170,
            "weight": 65,
            "bust": 92,
            "waist": 70,
            "hips": 94
        }'::jsonb,
        'hourglass',
        '{
            "bodyShape": "hourglass",
            "description": "Your body shape features balanced proportions with a defined waist.",
            "stylingRecommendations": [],
            "colorTips": ["Emphasize your waist", "Fitted styles work well"],
            "fitTips": ["Wrap dresses", "Belted styles"]
        }'::jsonb
    )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTES
-- ============================================================================

-- Test Tokens:
-- - test-basic-token-123 (valid, unused)
-- - test-standard-token-456 (valid, unused)
-- - test-premium-token-789 (valid, unused)
-- - used-token-abc (valid but already used)
-- - expired-token-xyz (expired)
--
-- You can use these tokens to test the access gate at:
-- http://localhost:3000/access/test-basic-token-123
--
-- Sample submissions are visible in the admin dashboard for testing.
-- ============================================================================

COMMIT;