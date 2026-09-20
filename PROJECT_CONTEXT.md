# PROJECT CONTEXT: CyberSec-8K (SEC 8-K Regulatory Signal Radar)

## 1. System Overview & Core Value Proposition

CyberSec-8K is a real-time regulatory signal alerting SaaS engineered specifically for **Incident Response (IR) Firms, MSSPs, and B2B Cybersecurity Sales Teams**.

### Core Problem Solved
When a public company suffers a material cybersecurity incident, SEC rules (enacted Dec 2023) mandate filing an **8-K Item 1.05 within 4 business days**. 
- Incident Response firms charge $25,000–$100,000+ for emergency forensic engagements and need to pitch breach targets immediately.
- Enterprise sales reps track **Item 5.02 (C-Suite Shifts)** because 70% of security vendor contracts are re-evaluated within 90 days of a new CISO/CIO taking office.
- Legacy tools (Bloomberg Terminal, AlphaSense) cost $25,000/year per seat. CyberSec-8K bridges this gap by delivering **instant Slack Block Kit & Resend Email alerts for $199–$349/month**.

---

## 2. Technical Infrastructure & Compliance

### SEC EDGAR Compliance Mandates
- **User-Agent Requirement**: All HTTP calls to SEC servers must supply a custom User-Agent header:  
  `User-Agent: CyberSec8K-Radar/1.0 (contact@cybersec8k-radar.com)`  
  *Default client headers (like raw unconfigured axios or fetch) are automatically blocked (HTTP 403).*
- **Rate-Limiting Ceiling**: The SEC enforces a strict maximum of **10 requests per second per IP**.  
  *The ingestion worker uses `p-limit(8)` to cap concurrency safely below this limit.*

### Zero-Cost Stack Architecture ($0.00/mo Fixed Overhead)
1. **Frontend & pSEO Routes**: Next.js 15 App Router hosted on **Vercel Free Tier**.
2. **Database & Auth**: PostgreSQL 16 on **Supabase Free Tier** (500 MB DB).
3. **Cron Worker**: **GitHub Actions** running `scripts/ingest-sec.ts` every 15 minutes during trading hours (`cron: '*/15 13-22 * * 1-5'`).
4. **Email Dispatch**: **Resend Free Tier** (3,000 emails/month).
5. **Billing**: **Stripe Checkout** ($199/mo Pro, $349/mo Enterprise).

---

## 3. Database Schema Contract (`supabase/migrations/01_sec_schema.sql`)

- `companies`: Primary key `cik` (padded 10 digits), `ticker`, `company_name`, `sic`, `exchange`.
- `filings`: `accession_number` (unique), `cik`, `item_105_flag` (boolean), `item_502_flag` (boolean), `filing_date`, `summary_text`, `raw_html_url`.
- `subscribers`: `id`, `email`, `slack_webhook_url`, `custom_webhook_url`, `tier` (`free`, `pro`, `enterprise`), `watchlist_tickers`.
- `alerts`: `filing_id`, `subscriber_id`, `channel` (`email`, `slack`, `webhook`), `status`.

---

## 4. AI-Assisted Go-To-Market (GTM) Strategy

To reach **$10,000 MRR** (35 subscribers @ $299 avg):

1. **Build-in-Public Social Engine (LinkedIn & X)**:
   - When a major 8-K breach or CISO shift occurs, post a real-time breakdown graphic on LinkedIn/X with a link to the live radar feed.
2. **AI-Assisted Outbound (15 Mins/Day)**:
   - Target: Business Development Directors at Incident Response & Forensic firms.
   - Process: AI auto-drafts hyper-personalized email pitches referencing live breach filings; founder spends 5 minutes reviewing and sending.
3. **Programmatic SEO (pSEO)**:
   - Next.js dynamic routing (`/sec/company/[ticker]`) auto-generates 5,000+ ticker landing pages capturing long-tail Google search traffic.

---

## 5. Maintenance & Operational Runbook

- **Testing**: Run `node --test tests/ingest.test.js tests/alerts.test.js` after any code modification.
- **Error Handling**: If SEC rate-limiting or parsing fails, Sentry/Discord webhooks ping the developer instantly.
- **Legal Compliance**: Standard footer disclaimer included on all emails and web pages (*"Informational regulatory alert service; not legal, financial, or investment advice"*).
