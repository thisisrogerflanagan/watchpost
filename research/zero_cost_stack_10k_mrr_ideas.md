# Ultra-Lean B2B Micro-SaaS Blueprints: Reaching $10,000 MRR on a Near $0 Tech Stack

## Executive Summary & Baseline Infrastructure Stack

For a solo developer, building a scalable $10,000/month MRR business without recurring infrastructure overhead requires leveraging **high-value B2B data signals**, **100% free primary REST/Atom APIs** (eliminating proxy and scraping API costs entirely), and **generous free-tier cloud infrastructure**.

By serving high-ACV (Annual Contract Value) B2B customers who pay **$99 to $349/month**, reaching **$10,000 MRR requires only 30 to 70 paying subscribers**.

### The $0 Initial Infrastructure Stack

| Architecture Component | Free Tier Provider | Free Monthly Limits & Capabilities | Cost at $10k MRR |
| :--- | :--- | :--- | :--- |
| **Frontend & API Hosting** | Vercel Free Tier | 100 GB Bandwidth, Edge Functions, Server Actions | **$0.00 / mo** |
| **Database & Auth** | Supabase PostgreSQL | 500 MB DB, 50,000 Monthly Active Users, Row Level Security | **$0.00 / mo** |
| **Cron / Ingestion Engine** | GitHub Actions | 2,000 execution minutes/mo (Scheduled `cron` triggers) | **$0.00 / mo** |
| **Email Notification Engine** | Resend | 3,000 emails/mo (100 emails/day) | **$0.00 / mo** |
| **Instant Alerts** | Slack & Discord Webhooks | Unlimited webhook deliveries | **$0.00 / mo** |
| **Payment & Subscription** | Stripe Checkout | $0 base monthly fee (2.9% + $0.30 per successful payout) | **Pay-as-you-earn** |
| **TOTAL FIXED MONTHLY OVERHEAD** | | | **$0.00 / mo** |

---

## Concept 1: CyberSec-8K (SEC EDGAR Material Cybersecurity & Executive Signal Alerting)

### 1. Concept Overview & B2B Urgency
Publicly traded companies are required to file **Form 8-K** with the SEC within **4 business days** of determining a material event. Specifically:
- **Item 1.05**: Material Cybersecurity Incidents (mandatory disclosure rule).
- **Item 5.02**: Departure of Directors or Certain Officers; Election of Directors; Appointment of Certain Officers.
- **Item 1.01**: Entry into a Material Definitive Agreement (Major vendor/contract shifts).

**The Urgent B2B Problem:**
1. **Cybersecurity Incident Response (IR) Firms & MSSPs** pay thousands of dollars for immediate alerts on companies experiencing material breaches (Item 1.05) to pitch emergency incident remediation, PR crisis support, and forensic services.
2. **B2B Enterprise Software Reps** target companies experiencing C-suite changes (Item 5.02)—when a new CIO or CISO takes office, 70% of current tech vendor contracts are re-evaluated within 90 days.

### 2. Primary Free API Specifications
- **Data Source:** SEC EDGAR RSS & Data API (100% Free, Official US Government API)
- **Primary Endpoint (Real-Time Feed):** `https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&company=&dateb=&owner=include&count=100&output=atom`
- **Submissions Endpoint (Company Context):** `https://data.sec.gov/submissions/CIK{cik_padded_10_digits}.json`
- **Authentication:** None required.
- **Mandatory Requirement:** SEC requires a custom `User-Agent` header in the format `User-Agent: AppName admin@yourdomain.com`. Default HTTP client headers (like Python requests or node-fetch defaults) are blocked.
- **Rate Limit:** 10 requests per second per IP (vastly higher than GitHub Actions ingestion needs).
- **Scraping / Proxy Cost:** **$0.00** (Native XML/Atom feed and JSON API).

### 3. Pricing & Path to $10,000 MRR
- **Tier 1 (Pro Analyst - $199/mo):** Instant Slack/Email alerts for Item 1.05 (Cybersecurity Incidents) + executive contacts extracted from filing text.
- **Tier 2 (Enterprise Team - $349/mo):** Item 1.05 + Item 5.02 (Executive Shifts) + API Webhooks into Salesforce/HubSpot.
- **Target Customers Needed:** **30 customers @ $334/mo avg = $10,020 MRR**.

### 4. Technical Architecture & Implementation Details

```
[SEC EDGAR Atom Feed] 
       │ (Every 15 min via GitHub Actions cron)
       ▼
[GitHub Action Worker Script] ──(Parses XML & 8-K Items)
       │
       ├──► Stores Signal in [Supabase PostgreSQL]
       │
       └──► Triggers Instant Alerts via [Resend Email / Slack Webhook]
```

#### GitHub Action Workflow (`.github/workflows/sec_ingest.yml`)
```yaml
name: SEC 8-K Ingest
on:
  schedule:
    - cron: '*/15 8-22 * * 1-5' # Every 15 mins during trading hours
  workflow_dispatch:

jobs:
  ingest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: node scripts/ingest-sec.js
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
```

#### Database Schema (`supabase/migrations/01_sec_schema.sql`)
```sql
create table sec_signals (
  id uuid primary key default gen_random_uuid(),
  acc_num text unique not null,
  company_name text not null,
  cik text not null,
  item_type text not null, -- '1.05' or '5.02'
  filing_date timestamp with time zone not null,
  filing_url text not null,
  summary_text text,
  created_at timestamp with time zone default now()
);

create index idx_sec_item_type on sec_signals(item_type, filing_date desc);
```

---

## Concept 2: GovRecompete (USASpending.gov Federal Contract Renewal & Subcontracting Radar)

### 1. Concept Overview & B2B Urgency
The US Federal Government spends over $700 Billion annually on procurement contracts. Every contract award and modification is recorded in public domain database USASpending.gov.

**The Urgent B2B Problem:**
- **Mid-Tier Contractors & Subcontractors** spend thousands hunting for **re-compete opportunities**—prime contracts valued at $1M–$50M expiring in 60 to 90 days.
- When a prime contract expires, government agencies re-bid the contract or prime contractors search for new sub-contractors (small businesses, WOSB, SDVOSB, 8(a)).
- **GovRecompete** alerts subcontractors 90 days *before* contract expiration and highlights newly awarded prime contractors so subs can pitch the winning primes immediately.

### 2. Primary Free API Specifications
- **Data Source:** USAspending.gov REST API v2 (Official US Department of the Treasury API)
- **Endpoint:** `POST https://api.usaspending.gov/api/v2/search/spending_by_award/`
- **Authentication:** None required. Completely free public open API.
- **Rate Limit:** Generous batch limits; no restrictive API key requirements.
- **Scraping / Proxy Cost:** **$0.00**.

#### Sample JSON Query Payload (Expiring Contracts Signal):
```json
{
  "filters": {
    "time_period": [
      {
        "start_date": "2026-10-01",
        "end_date": "2026-12-31"
      }
    ],
    "award_type_codes": ["A", "B", "C", "D"],
    "award_amounts": [
      {
        "lower_bound": 1000000,
        "upper_bound": 50000000
      }
    ]
  },
  "fields": [
    "Award ID",
    "Recipient Name",
    "Award Amount",
    "Description",
    "Period of Performance End Date",
    "Awarding Agency",
    "Awarding Sub Agency"
  ],
  "limit": 100,
  "page": 1,
  "sort": "Period of Performance End Date",
  "order": "asc"
}
```

### 3. Pricing & Path to $10,000 MRR
- **GovCon Subcontractor Tier ($249/month):** Weekly digests & real-time alerts for expiring prime contracts filtering by NAICS codes and set-aside status (8(a), HUBZone, Veteran-Owned).
- **Target Customers Needed:** **41 customers @ $249/mo = $10,209 MRR**.

### 4. Technical Architecture & Database Design

#### Supabase Schema for Federal Signals
```sql
create table gov_awards (
  id uuid primary key default gen_random_uuid(),
  award_id text unique not null,
  recipient_name text not null,
  award_amount numeric(15, 2) not null,
  description text,
  end_date date not null,
  agency_name text not null,
  naics_code text,
  notified boolean default false,
  created_at timestamp with time zone default now()
);

create index idx_gov_end_date on gov_awards(end_date asc);
```

---

## Concept 3: TrialPulse B2B (ClinicalTrials.gov v2 CRO & Biotech Vendor Lead Engine)

### 1. Concept Overview & B2B Urgency
Biotech companies spend tens of millions of dollars on clinical trials. When a trial transitions from **Phase 1 to Phase 2** or is newly registered as **Recruiting**, the sponsor actively contracts out millions of dollars to specialized vendors:
- Contract Research Organizations (CROs)
- Central Laboratories & Cold-Chain Logistics Providers
- Patient Recruitment Agencies & eCOA/ePRO Software Providers

**The Urgent B2B Problem:**
Sales reps at CROs and biotech vendor companies manually search ClinicalTrials.gov daily. Early outreach to a Biotech Sponsor (often a venture-backed startup with fresh $20M+ Series A funding) secures multi-million dollar vendor contracts before competitors even know the trial reached Phase 2.

### 2. Primary Free API Specifications
- **Data Source:** ClinicalTrials.gov REST API v2 (Official NIH / National Library of Medicine API)
- **Endpoint:** `GET https://clinicaltrials.gov/api/v2/studies`
- **Key Parameters:**
  - `query.term=AREA[OverallStatus]RECRUITING`
  - `filter.advanced=AREA[Phase]PHASE2 AND AREA[LeadSponsorClass]INDUSTRY`
  - `pageSize=50`
  - `fields=NCTId,BriefTitle,LeadSponsorName,OverallStatus,Phase,CentralContactName,CentralContactEMail`
- **Authentication:** None required. Public API.
- **Rate Limit:** ~50 requests per minute per IP (use 0.2s throttle in ingestion scripts).
- **Scraping / Proxy Cost:** **$0.00**.

### 3. Pricing & Path to $10,000 MRR
- **Standard CRO Tier ($149/month):** Filtered Phase 1 -> Phase 2 advancements, sponsor lead contact information, weekly CSV exports.
- **Growth Vendor Tier ($299/month):** Real-time daily alerts, unlimited team seats, webhook integration into HubSpot/Salesforce.
- **Target Customers Needed:** **40 customers @ $250/mo avg = $10,000 MRR**.

### 4. Technical Ingestion Script Snippet (Node.js)

```javascript
// scripts/ingest-trials.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fetchClinicalSignals() {
  const url = 'https://clinicaltrials.gov/api/v2/studies?' + new URLSearchParams({
    'format': 'json',
    'query.term': 'AREA[OverallStatus]RECRUITING',
    'filter.advanced': 'AREA[Phase]PHASE2 AND AREA[LeadSponsorClass]INDUSTRY',
    'pageSize': '50'
  });

  const res = await fetch(url);
  const data = await res.json();

  for (const study of data.studies) {
    const protocol = study.protocolSection;
    const nctId = protocol.identificationModule.nctId;
    const title = protocol.identificationModule.briefTitle;
    const sponsor = protocol.sponsorCollaboratorsModule?.leadSponsor?.name;
    const contacts = protocol.contactsLocationsModule?.centralContacts || [];
    
    const primaryContact = contacts[0] || {};

    await supabase.from('clinical_signals').upsert({
      nct_id: nctId,
      title: title,
      sponsor_name: sponsor,
      contact_name: primaryContact.name || null,
      contact_email: primaryContact.email || null,
      phase: 'Phase 2',
      updated_at: new Date().toISOString()
    }, { onConflict: 'nct_id' });
  }
}

fetchClinicalSignals().catch(console.error);
```

---

## ROI Formulas & Zero-Ad Customer Acquisition Blueprint

### Direct ROI Pitch to Customers
| Product | Target Buyer | Buyer ACV / Win Value | Micro-SaaS Price | Buyer ROI Metric |
| :--- | :--- | :--- | :--- | :--- |
| **CyberSec-8K** | MSSP / IR Firm | $25,000 per IR engagement | $299 / mo | 1 deal won from 8-K Item 1.05 pays for **7 years** of subscription. |
| **GovRecompete** | GovCon Subcontractor | $100,000+ sub-contract award | $249 / mo | 1 re-compete contract won pays for **33 years** of subscription. |
| **TrialPulse** | CRO / Lab Vendor | $50,000+ lab/testing deal | $199 / mo | 1 Phase 2 trial lead closed pays for **20 years** of subscription. |

### Go-To-Market Execution (Zero-Ad Spend)
1. **Automated Cold Email (LinkedIn & Apollo Signal-Based):**
   - Query Apollo/LinkedIn for titles: "Director of Business Development at CRO", "GovCon Sales Director", or "Head of Incident Response".
   - Cold Outreach Trigger: Send a free sample alert when a major signal drops (e.g., *"Hey [Name], saw company X just filed an 8-K Item 1.05 breach notice 20 mins ago. We automatically dispatched this to IR teams. Free trial here..."*).
2. **Programmatic SEO (pSEO):**
   - Create free public landing pages for every CIK company, NAICS code, or NCT trial number (e.g., `app.com/sec/cik-0000320193` or `app.com/contracts/naics-541512`).
   - Vercel Next.js dynamic routing caches these pages statically at zero cost, capturing high-intent organic search traffic.
