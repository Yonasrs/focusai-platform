-- FocusAI PostgreSQL Schema
-- Version: 1.0
-- Run this against a fresh database: psql -U focusai -d focusai -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id        TEXT UNIQUE NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    plan            TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    credits_remaining INT NOT NULL DEFAULT 3,
    is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id      TEXT UNIQUE,
    stripe_subscription_id  TEXT UNIQUE,
    plan                    TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    status                  TEXT NOT NULL DEFAULT 'active',  -- active | past_due | canceled | trialing
    current_period_start    TIMESTAMPTZ,
    current_period_end      TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_subscription_user UNIQUE (user_id)
);

-- ============================================================
-- UPLOADS
-- ============================================================
CREATE TABLE IF NOT EXISTS uploads (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename          TEXT NOT NULL,
    content_type      TEXT NOT NULL CHECK (content_type IN ('video', 'image', 'text')),
    s3_key            TEXT NOT NULL,
    file_size_bytes   BIGINT NOT NULL,
    duration_seconds  INT,
    status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'complete', 'failed')),
    expires_at        TIMESTAMPTZ,  -- 30-day retention
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_uploads_status ON uploads(status);

-- ============================================================
-- ANALYSIS JOBS
-- ============================================================
CREATE TABLE IF NOT EXISTS analysis_jobs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_id       UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'complete', 'failed')),
    credits_used    INT NOT NULL DEFAULT 1,
    error_message   TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_user_id ON analysis_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_upload_id ON analysis_jobs(upload_id);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_status ON analysis_jobs(status);

-- ============================================================
-- EXPERT REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS expert_reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id          UUID NOT NULL REFERENCES analysis_jobs(id) ON DELETE CASCADE,
    expert_name     TEXT NOT NULL CHECK (expert_name IN ('hook', 'retention', 'clarity')),
    prompt_version  TEXT NOT NULL,
    score           NUMERIC(4,1) NOT NULL CHECK (score >= 0 AND score <= 100),
    output          JSONB NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_expert_reviews_job_id ON expert_reviews(job_id);

-- ============================================================
-- PERSONA REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS persona_reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id          UUID NOT NULL REFERENCES analysis_jobs(id) ON DELETE CASCADE,
    persona_name    TEXT NOT NULL CHECK (persona_name IN ('skeptical', 'busy', 'enthusiastic')),
    sentiment       TEXT NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    feedback        TEXT NOT NULL,
    raw_output      JSONB NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_persona_reviews_job_id ON persona_reviews(job_id);

-- ============================================================
-- FINAL REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS final_reports (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id                      UUID NOT NULL REFERENCES analysis_jobs(id) ON DELETE CASCADE,
    user_id                     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    final_score                 NUMERIC(4,1) NOT NULL CHECK (final_score >= 0 AND final_score <= 100),
    summary                     TEXT NOT NULL,
    strengths                   JSONB NOT NULL DEFAULT '[]',
    weaknesses                  JSONB NOT NULL DEFAULT '[]',
    top_recommendations         JSONB NOT NULL DEFAULT '[]',
    top_risks                   JSONB NOT NULL DEFAULT '[]',
    moderator_prompt_version    TEXT NOT NULL,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_final_report_job UNIQUE (job_id)
);
CREATE INDEX IF NOT EXISTS idx_final_reports_user_id ON final_reports(user_id);

-- ============================================================
-- USAGE (per billing period)
-- ============================================================
CREATE TABLE IF NOT EXISTS usage (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    period_start        TIMESTAMPTZ NOT NULL,
    period_end          TIMESTAMPTZ NOT NULL,
    analyses_used       INT NOT NULL DEFAULT 0,
    analyses_limit      INT NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_usage_user_id ON usage(user_id);

-- ============================================================
-- API USAGE (cost tracking per AI call)
-- ============================================================
CREATE TABLE IF NOT EXISTS api_usage (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id          UUID NOT NULL REFERENCES analysis_jobs(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model           TEXT NOT NULL,
    prompt_version  TEXT NOT NULL,
    input_tokens    INT NOT NULL,
    output_tokens   INT NOT NULL,
    cost_usd        NUMERIC(10,6) NOT NULL,
    duration_ms     INT NOT NULL,
    status          TEXT NOT NULL CHECK (status IN ('success', 'error')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_usage_job_id ON api_usage(job_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);

-- ============================================================
-- FEATURE FLAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS feature_flags (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT UNIQUE NOT NULL,
    enabled     BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NOT NULL DEFAULT '',
    updated_by  TEXT NOT NULL DEFAULT 'system',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default flags
INSERT INTO feature_flags (name, enabled, description) VALUES
    ('PREPUBLISH',       TRUE,  'Core PrePublish product'),
    ('AUDIENCELAB',      FALSE, 'AudienceLab persona simulation'),
    ('HOOK_EXPERT',      TRUE,  'Hook analysis expert'),
    ('RETENTION_EXPERT', TRUE,  'Retention analysis expert'),
    ('CLARITY_EXPERT',   TRUE,  'Clarity analysis expert'),
    ('PDF_REPORT',       FALSE, 'PDF export for final reports')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- PROMPT VERSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS prompt_versions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,          -- e.g. HookExpert_v1
    expert      TEXT NOT NULL,          -- hook | retention | clarity | moderator | persona
    version     INT NOT NULL,
    prompt_text TEXT NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_prompt_name UNIQUE (name)
);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_expert ON prompt_versions(expert);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_active ON prompt_versions(is_active);

-- ============================================================
-- ANALYSIS HISTORY VIEW (convenience)
-- ============================================================
CREATE OR REPLACE VIEW analysis_history AS
SELECT
    aj.id           AS job_id,
    aj.user_id,
    aj.status       AS job_status,
    aj.created_at   AS submitted_at,
    aj.completed_at,
    u.filename,
    u.content_type,
    fr.final_score,
    fr.summary
FROM analysis_jobs aj
JOIN uploads u ON u.id = aj.upload_id
LEFT JOIN final_reports fr ON fr.job_id = aj.id;
