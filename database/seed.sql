-- FocusAI Seed Data (development only)
-- Creates a test admin user and sample prompt versions

-- Test admin user (Clerk ID must match a real Clerk test user)
INSERT INTO users (id, clerk_id, email, plan, credits_remaining, is_admin)
VALUES (
    uuid_generate_v4(),
    'user_test_admin',
    'admin@focusai.dev',
    'pro',
    100,
    TRUE
) ON CONFLICT DO NOTHING;

-- Seed initial prompt versions
INSERT INTO prompt_versions (name, expert, version, prompt_text, is_active) VALUES
(
    'HookExpert_v1',
    'hook',
    1,
    'You are the Hook Expert for FocusAI. Analyze the provided content and evaluate its hook strength. A hook is the opening moment that determines whether a viewer stops scrolling. Return a JSON object with: score (0-100), strengths (array of strings), weaknesses (array of strings).',
    TRUE
),
(
    'RetentionExpert_v1',
    'retention',
    1,
    'You are the Retention Expert for FocusAI. Analyze the provided content and evaluate its ability to hold audience attention throughout. Identify pacing issues, flow problems, and attention drop risks. Return a JSON object with: score (0-100), risks (array of strings), suggestions (array of strings).',
    TRUE
),
(
    'ClarityExpert_v1',
    'clarity',
    1,
    'You are the Clarity Expert for FocusAI. Analyze the provided content and evaluate how clearly it communicates its message. Assess whether the target audience will understand the core value proposition. Return a JSON object with: score (0-100), issues (array of strings), suggestions (array of strings).',
    TRUE
),
(
    'Moderator_v1',
    'moderator',
    1,
    'You are the Moderator for FocusAI. You receive structured outputs from the Hook Expert, Retention Expert, and Clarity Expert, plus persona feedback. Synthesize all findings into a final report. Return a JSON object with: final_score (0-100), summary (string), strengths (array), weaknesses (array), top_recommendations (array of up to 5), top_risks (array of up to 3).',
    TRUE
)
ON CONFLICT (name) DO NOTHING;
