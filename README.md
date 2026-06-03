# FocusAI

> **Test Before You Publish** — AI-powered pre-publication content review.

FocusAI analyzes your content (video, image, text) before you publish, giving you expert feedback on hook strength, retention, and clarity — plus simulated audience reactions.

---

## Project Structure

```
FocusAI/
├── frontend/          # Next.js 14 + TypeScript + Tailwind
├── backend/           # Python + FastAPI
├── database/          # PostgreSQL schema & seed data
├── PRD.md             # Full product requirements document
├── PROGRESS.md        # Milestone tracking
└── docker-compose.yml # Local development stack
```

---

## Quick Start (Local Dev)

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker + Docker Compose
- A [Clerk](https://clerk.com) account (auth)

### 1. Clone & configure environment

```bash
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env
# Fill in Clerk, Stripe, Anthropic, AWS keys
```

### 2. Start the database

```bash
docker compose up postgres -d
```

### 3. Start the backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Or run everything with Docker

```bash
docker compose up --build
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Auth | Clerk |
| Backend | Python 3.12, FastAPI |
| Database | PostgreSQL 16 |
| Storage | AWS S3 |
| Payments | Stripe |
| AI | Anthropic Claude (claude-sonnet-4-6) |

---

## Feature Flags

Flags are stored in the `feature_flags` DB table and default-seeded. Toggle them via the admin panel or directly in the DB.

| Flag | Default | Description |
|------|---------|-------------|
| `PREPUBLISH` | ON | Core product |
| `AUDIENCELAB` | OFF | Persona simulation |
| `HOOK_EXPERT` | ON | Hook analysis |
| `RETENTION_EXPERT` | ON | Retention analysis |
| `CLARITY_EXPERT` | ON | Clarity analysis |
| `PDF_REPORT` | OFF | PDF export |

---

## API Docs

When the backend is running: **http://localhost:8000/docs**

---

## Milestones

See [PROGRESS.md](./PROGRESS.md) for the full milestone tracker.

---

## Brand

- **Company:** FocusAI
- **Product:** PrePublish
- **Tagline:** Test Before You Publish
- **Primary Color:** `#7C3AED`
