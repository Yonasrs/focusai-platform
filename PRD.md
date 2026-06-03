# FocusAI Product Requirements & Technical Specification (Version 1.0)

## Document Information
- **Product Name:** FocusAI
- **Primary Product:** PrePublish
- **Version:** 1.0
- **Status:** MVP Definition

---

## Vision
FocusAI helps creators, marketers, and business owners understand how their content is likely to perform before publishing it.

## Mission
To become the leading AI-powered pre-publication review platform for content, advertising, and digital assets.

## Problem Statement
Content creators and marketers frequently publish content without knowing:
- Whether the hook is strong enough
- Whether the audience will stay engaged
- Whether the message is clear
- Whether the content is likely to perform

Existing tools provide analytics after publishing. FocusAI aims to provide insight **before** publishing.

---

## Product Portfolio

| Product | Description |
|---------|-------------|
| **Product 1 — PrePublish (MVP)** | Content Review Platform. Input: Video, Image, Text. Output: Hook Analysis, Retention Analysis, Clarity Analysis, Audience Simulation, Final Score, Recommendations |
| **Product 2 — AudienceLab** | Synthetic Focus Group |
| **Product 3 — AdLens** | Advertising Review (Facebook, Instagram, TikTok, Google Ads) |
| **Product 4 — LandingLens** | Landing Page Analysis |

---

## Target Audience
- **Primary:** Content Creators (TikTok, Instagram Reels, YouTube Shorts)
- **Secondary:** Marketers, Freelancers, Agencies, Media Buyers
- **Third:** Business Owners (Ecommerce, SaaS, Coaches, Consultants)

---

## MVP Scope

**Included:** Authentication, Upload Content, Hook Expert, Retention Expert, Clarity Expert, 3 Audience Personas, Final Report, Usage Limits, Stripe Payments

**Excluded:** Mobile App, TikTok/Instagram Integration, Teams, Agency Accounts, Fine-Tuned Models

---

## User Roles
- **User:** Upload content, View reports, Manage subscription
- **Admin:** View users, View reports, Manage feature flags, Monitor costs

---

## User Journey
```
Landing Page → Register → Dashboard → Upload Content → Run Analysis → View Report → Save Report → Upgrade Plan (optional)
```

## Navigation
- **Public:** Home, Pricing, Login, Register
- **Private:** Dashboard, Upload, Reports, History, Settings, Billing
- **Admin:** Users, Analytics, Costs, Feature Flags

---

## Pricing

| Plan | Analyses per Month | Price |
|------|-------------------|-------|
| Free | 3 | $0 |
| Pro  | 100 | TBD |

### Credit System
- Internal only
- 1 Analysis = 1 Credit

---

## AI Architecture
```
Content → Analysis Engine → Enabled Experts → Audience Simulation → Moderator → Final Report
```

### Experts

| Expert | Analyzes | Output |
|--------|----------|--------|
| **Hook Expert** | First impression, curiosity, scroll-stopping power | Score, Strengths, Weaknesses |
| **Retention Expert** | Pacing, flow, attention drops | Score, Risks, Suggestions |
| **Clarity Expert** | Message clarity, audience understanding, communication effectiveness | Score, Issues, Suggestions |

### AudienceLab MVP Personas
- **Skeptical Viewer:** Questions claims
- **Busy Viewer:** Values speed and clarity
- **Enthusiastic Viewer:** Represents engaged audience members

### Moderator
Combines all expert outputs → Final Score, Summary, Recommendations, Top Risks

### Report Structure
Final Score, Strengths, Weaknesses, Hook Analysis, Retention Analysis, Clarity Analysis, Persona Feedback, Top Recommendations

---

## Feature Flags
`PREPUBLISH`, `AUDIENCELAB`, `HOOK_EXPERT`, `RETENTION_EXPERT`, `CLARITY_EXPERT`, `PDF_REPORT`

## Prompt Versioning
Every expert prompt must be versioned (e.g. `HookExpert_v1`, `RetentionExpert_v1`) for testing, rollback, and performance comparison.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Storage | AWS S3 |
| Auth | Clerk or Supabase Auth |
| Payments | Stripe |

---

## Database Schema — Core Tables
`users`, `subscriptions`, `uploads`, `analysis_jobs`, `expert_reviews`, `persona_reviews`, `final_reports`, `usage`, `api_usage`, `feature_flags`, `prompt_versions`, `analysis_history`

---

## Upload Limits

| Plan | Max Duration | Max Size |
|------|-------------|----------|
| Free | 30 seconds | 100 MB |
| Pro  | 5 minutes | 1 GB |

**Supported Formats:** JPG, PNG, MP4, Plain Text

---

## Subscription & Billing
Plans: Free, Pro — Upgrade, Downgrade, Cancel, Renewal flows via Stripe

## Email Flows
Welcome, Analysis Complete, Payment Confirmation, Subscription Upgrade, Password Reset

---

## Security
- Authenticated uploads only
- File validation
- Rate limiting
- Secure storage
- HTTPS only

## Data Retention
- **Uploaded Files:** 30 days
- **Reports:** Indefinitely
- **Logs:** 90 days

## Logging
Store: User ID, Upload ID, Model, Tokens, Cost, Duration, Status

## Cost Tracking
Track input/output tokens, API cost, analysis cost, user cost. Prevent uncontrolled AI spending.

## AI Cost Strategy
Preferred: Single AI call producing multiple expert outputs. Avoid separate API call per expert.

---

## Analytics
Track: Signups, Conversion Rate, Retention, Upgrade Rate, Usage Frequency

## Non-Functional Requirements
- **Analysis Completion:** Under 60 seconds
- **Availability:** 99%
- **Scalability:** 1,000 active users

---

## Brand Identity
- **Company:** FocusAI
- **Tagline:** Test Before You Publish
- **Primary Product:** PrePublish

## Design System

### Dark Mode
| Token | Value |
|-------|-------|
| Background | `#0B1020` |
| Cards | `#151B2F` |
| Primary | `#7C3AED` |
| Text | `#F8FAFC` |
| Secondary Text | `#94A3B8` |

### Light Mode
| Token | Value |
|-------|-------|
| Background | `#FFFFFF` |
| Secondary Background | `#F8FAFC` |
| Primary | `#7C3AED` |
| Text | `#0F172A` |

---

## Development Roadmap

| Milestone | Description |
|-----------|-------------|
| Milestone 0 | Foundation |
| Milestone 1 | Upload Platform |
| Milestone 2 | Analysis Engine Skeleton |
| Milestone 3 | Hook Expert |
| Milestone 4 | Retention Expert |
| Milestone 5 | Clarity Expert |
| Milestone 6 | AudienceLab MVP |
| Milestone 7 | Moderator |
| Milestone 8 | Dashboard |
| Milestone 9 | Credits & Usage |
| Milestone 10 | Stripe Billing |
| Milestone 11 | Admin Panel |
| Milestone 12 | Production Beta |

---

## Success Metrics
- **Month 1:** 10 users
- **Month 3:** First paying customer
- **Month 6:** 20 paying customers
- **Year 1:** 100 paying customers

## Definition of Success
> A user uploads content, receives actionable feedback within one minute, finds value in the report, and returns to use the platform again.
