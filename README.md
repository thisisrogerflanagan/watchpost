# CyberSec-8K: Real-Time SEC 8-K Regulatory Signal Radar

CyberSec-8K is a real-time regulatory intelligence engine and alerting platform built for Incident Response (IR) firms, MSSPs, and B2B cybersecurity sales leaders. It monitors the official US Securities and Exchange Commission (SEC) EDGAR Atom feed 24/7 for high-value regulatory disclosures:

- **Item 1.05**: Material Cybersecurity Incidents (mandatory disclosure rule).
- **Item 5.02**: Departure/Appointment of Directors or C-Suite Officers (CISOs, CIOs, CTOs, CEOs).

The product is engineered to operate on a **$0.00/month fixed infrastructure stack** (Vercel Free Tier, Supabase PostgreSQL Free Tier, GitHub Actions, Resend, SEC EDGAR Atom API).

---

## Technical Stack & Architecture

- **Frontend & Web UI**: Next.js 15 (App Router, Server Components, React Server Actions) + Tailwind CSS
- **Database & Storage**: PostgreSQL 16 + Supabase (Row Level Security, Indexing)
- **Ingestion Cron Engine**: GitHub Actions (`cron: '*/15 13-22 * * 1-5'` UTC) running Node.js/TypeScript
- **Alert Dispatchers**: Slack Webhooks (Block Kit) + Resend Email HTML API
- **Testing Engine**: Vitest & Node.js Native Test Runner (`node --test`)

---

## Directory Structure

```
project-circus/
├── app/
│   ├── page.tsx                      # Public B2B Landing Page & Live Feed Preview
│   ├── feed/
│   │   └── page.tsx                  # Subscriber Radar Feed Dashboard
│   └── sec/
│       └── company/
│           └── [ticker]/
│               └── page.tsx          # Programmatic SEO (pSEO) Dynamic Ticker Route
├── lib/
│   ├── slackAlertService.ts         # Slack Block Kit payload generator & dispatcher
│   └── resendAlertService.ts        # Resend HTML email generator & dispatcher
├── scripts/
│   └── ingest-sec.ts                 # SEC EDGAR Atom feed worker script (Rate-limited)
├── supabase/
│   └── migrations/
│       └── 01_sec_schema.sql        # Supabase PostgreSQL DDL DDL Schema & Indexes
├── tests/
│   ├── fixtures/
│   │   └── sec_105_sample.xml       # Sample SEC 8-K XML Atom feed fixture
│   ├── ingest.test.js               # SEC Parser & User-Agent compliance tests
│   └── alerts.test.js               # Slack & Email payload rendering tests
├── research/                        # Deep-dive strategy, teardown & GTM reports
└── README.md
```

---

## Local Development & Testing

### Running Tests (TDD Workflow)
Run the native zero-dependency test suite locally:
```bash
node --test tests/ingest.test.js tests/alerts.test.js
```

### Running Ingestion Engine Locally
```bash
npx ts-node scripts/ingest-sec.ts
```

---

## Deployment & Production Setup

1. **Database**: Run `supabase/migrations/01_sec_schema.sql` in your Supabase SQL Editor.
2. **Web App**: Connect repository to Vercel and configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `RESEND_API_KEY`.
3. **Cron Worker**: Configure GitHub Actions secret environment variables.
