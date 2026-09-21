# Watchpost HQ: Notion-Style Landing Page & Programmatic SEO (pSEO) Playbook

**Author:** AI Research & Systems Architecture Agent  
**Date:** September 21, 2026  
**Target File Path:** `/Users/rogerflanagan/Desktop/project-circus/research/watchpost_notion_landing_page_and_pseo_playbook.md`  
**Target Product:** Watchpost HQ (SEC 8-K Regulatory Signal Radar)  
**Stack Specifications:** Next.js 15 (App Router, Async Params, React 19), Tailwind CSS, Supabase PostgreSQL, Stripe Checkout, Resend, Slack API  

---

## Executive Summary & System Architecture

Watchpost HQ is a real-time regulatory intelligence radar that monitors SEC EDGAR filings 24/7 to catch **Item 1.05 (Material Cybersecurity Incidents)** and **Item 5.02 (C-Suite & CISO Leadership Transitions)**. 

To maximize organic acquisition and self-serve SaaS conversions, Watchpost HQ employs a **dual-engine frontend strategy**:
1. **Notion-Style Warm Minimalist Landing Page (`app/page.tsx`)**: High-contrast, clean 1px bordered marketing page optimized for rapid positioning, interactive product simulation, ROI calculation, and friction-free Slack Bot / Stripe conversion.
2. **5,000+ Ticker Programmatic SEO Engine (`app/sec/...`)**: Dynamic Next.js 15 routes auto-generated from Supabase company and filing records, providing indexable hubs for every public ticker, specific breach disclosures, and CISO transitions.

```
+-----------------------------------------------------------------------------------+
|                        WATCHPOST HQ SYSTEM ARCHITECTURE                           |
+-----------------------------------------------------------------------------------+
| 1. SEC EDGAR INGESTION WORKER (GitHub Actions Cron / Node.js + p-limit)           |
|    - Polling RSS / Submission API every 15s during trading hours                  |
|    - Parses Item 1.05 & Item 5.02 flags -> Stores in Supabase PostgreSQL           |
+------------------------------------+----------------------------------------------+
| 2. NOTION-STYLE MARKETING HOMEPAGE | 3. PROGRAMMATIC SEO (pSEO) ENGINE            |
|    - app/page.tsx                  |    - app/sec/company/[ticker]/page.tsx      |
|    - Hero SEC Radar Simulator      |    - app/sec/breaches/[year]/[id]/page.tsx   |
|    - 3-Tier Pricing ($0/$49/$299) |    - app/sec/ciso-moves/[ticker]/page.tsx    |
|    - Interactive Bento Grid        |    - app/sitemap.ts (Dynamic XML Sitemap)  |
|    - Interactive ROI Calculator    |    - Schema.org JSON-LD (NewsArticle, Org)   |
+------------------------------------+----------------------------------------------+
| 4. CONVERSION & DISTRIBUTION FLOW                                                 |
|    - Free Slack Bot OAuth Install -> Pro $49/mo Stripe Checkout -> Webhook Alerts |
+-----------------------------------------------------------------------------------+
```

---

## Section 1: Notion-Style Design Ethos & Component Architecture

Notion’s visual design language is defined by **warm minimalism, extreme typographical discipline, subtle surface elevation, crisp 1px borders, and high-density content structure**. Unlike flashy 3D-heavy marketing pages, Notion’s design focuses on utility, calm focus, and human legibility.

### 1.1 Notion Design Principles & Color Palette Tokens

```
+-----------------------------------------------------------------------------------+
|                           NOTION AESTHETIC DECONSTRUCTION                         |
+-----------------------------------+-----------------------------------------------+
| WARM NEUTRAL BASE COLOURS         | Light: #fafafa / #ffffff | Dark: #09090b / #18181b |
| CRISP 1PX BORDER GRID             | Light: #e2e8f0 (Slate 200) | Dark: #27272a (Zinc 800) |
| TYPOGRAPHY & LETTERING            | Inter / Geist Sans, tracking-tight, mono tags |
| SUBTLE BACKGROUND PATTERNS        | SVG radial dot grids (16px spacing, 1px dot)  |
| STATUS BADGES & PILLS             | Soft rounded-full badges, animated pulse dots |
| HIGH-CONTRAST PRIMARY CTAS        | Solid dark in light mode, solid white in dark  |
+-----------------------------------+-----------------------------------------------+
```

#### Tailored Tailwind CSS Tokens (`tailwind.config.ts` / CSS Variables)

| Token Name | Light Mode Hex | Dark Mode Hex | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-app` | `#fafafa` (Slate 50) | `#09090b` (Zinc 950) | Main background canvas |
| `--bg-card` | `#ffffff` (White) | `#18181b` (Zinc 900) | Card & modal surfaces |
| `--border-subtle` | `#e2e8f0` (Slate 200) | `#27272a` (Zinc 800) | 1px clean container borders |
| `--border-hover` | `#cbd5e1` (Slate 300) | `#3f3f46` (Zinc 700) | Hover transition borders |
| `--text-primary` | `#0f172a` (Slate 900) | `#f4f4f5` (Zinc 100) | Main headlines & body |
| `--text-muted` | `#64748b` (Slate 500) | `#a1a1aa` (Zinc 400) | Subtitles, labels, timestamps |
| `--accent-emerald` | `#10b981` (Emerald 500)| `#34d399` (Emerald 400)| Real-time radar active pulse |
| `--accent-amber` | `#f59e0b` (Amber 500)  | `#fbbf24` (Amber 400)  | Item 5.02 executive alert |
| `--accent-rose` | `#f43f5e` (Rose 500)   | `#fb7185` (Rose 400)   | Item 1.05 material breach |

#### Background Dot Grid Pattern Utility (Tailwind CSS)
```css
.bg-notion-grid {
  background-image: radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px);
  background-size: 20px 20px;
}
.dark .bg-notion-grid {
  background-image: radial-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

---

### 1.2 Landing Page Section Structure & Component Design

#### Section 1: Hero Section with Live SEC Radar Simulation
- **Pill Badge**: `[LIVE RADAR]` "Sub-5 Second SEC EDGAR Ingestion Pipeline" (Rounded-full badge with pulsing emerald green dot).
- **Headline**: "Detect Material SEC 8-K Breaches & CISO Moves Before the Headlines."
- **Subheadline**: "Watchpost HQ monitors SEC filings 24/7. Get instant Item 1.05 cybersecurity breach disclosures and Item 5.02 executive shifts dispatched to Slack and email before your competition."
- **Dual CTA Block**:
  - Primary CTA: `Install Free Slack Bot` (Direct OAuth trigger).
  - Secondary CTA: `View Live SEC Radar` (Scrolls down or links to `/feed`).
- **Live Interactive SEC Radar Simulator**:
  - Tabbed interface switching between *All Filings*, *Item 1.05 Breaches*, and *Item 5.02 CISO Moves*.
  - Live animated feed displaying mock real-time filings with ticker badges (`CRWD`, `UNH`, `AAPL`), CIK numbers, filing timestamps (`2 mins ago`), and item tags.
  - Clicking any row opens an **Executive Brief Drawer** displaying the AI summary and formatted Slack Block Kit preview.

```tsx
// Interactive Hero Component Code Snippet (app/components/HeroRadar.tsx)
"use client";

import React, { useState } from "react";

interface FilingSignal {
  ticker: string;
  companyName: string;
  itemType: "Item 1.05" | "Item 5.02";
  timeAgo: string;
  summary: string;
  severity: "CRITICAL" | "HIGH" | "INFO";
}

const MOCK_FILINGS: FilingSignal[] = [
  {
    ticker: "CRWD",
    companyName: "CrowdStrike Holdings, Inc.",
    itemType: "Item 1.05",
    timeAgo: "1m ago",
    summary: "Disclosed material network incident impacting operational telemetry. Remediation ongoing.",
    severity: "CRITICAL",
  },
  {
    ticker: "UNH",
    companyName: "UnitedHealth Group Inc.",
    itemType: "Item 1.05",
    timeAgo: "4m ago",
    summary: "Disclosed unauthorized access to Optum business unit infrastructure.",
    severity: "CRITICAL",
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corp",
    itemType: "Item 5.02",
    timeAgo: "12m ago",
    summary: "Appointed new Chief Information Security Officer following executive retirement.",
    severity: "HIGH",
  },
];

export function HeroRadar() {
  const [selectedFiling, setSelectedFiling] = useState<FilingSignal | null>(MOCK_FILINGS[0]);
  const [activeTab, setActiveTab] = useState<"ALL" | "105" | "502">("ALL");

  const filteredFilings = MOCK_FILINGS.filter((f) => {
    if (activeTab === "105") return f.itemType === "Item 1.05";
    if (activeTab === "502") return f.itemType === "Item 5.02";
    return true;
  });

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-notion-grid py-20 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Status Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-mono uppercase tracking-wider text-[11px]">Live Radar Active</span>
          <span className="text-slate-300 dark:text-zinc-700">|</span>
          <span className="text-slate-500 dark:text-zinc-400">Sub-5s SEC EDGAR Ingestion</span>
        </div>

        {/* Hero Title */}
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
          Detect Material SEC 8-K Breaches &amp; CISO Moves <span className="underline decoration-slate-300 underline-offset-8 dark:decoration-zinc-700">Before Headlines</span>.
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-zinc-400">
          Watchpost HQ monitors SEC EDGAR filings 24/7. Get instant Item 1.05 cybersecurity breach alerts and Item 5.02 executive shifts dispatched to Slack and email before your competition.
        </p>

        {/* Dual CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="/api/slack/install"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100"
          >
            Install Free Slack Bot
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            View Pricing ($0 - $299/mo)
          </a>
        </div>

        {/* Live Radar Interactive Simulation Box */}
        <div className="mt-12 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {/* Radar Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400">
                watchpost-radar-simulation.v1
              </span>
            </div>
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-950">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "ALL" ? "bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:text-zinc-400"
                }`}
              >
                All Signals
              </button>
              <button
                onClick={() => setActiveTab("105")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "105" ? "bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:text-zinc-400"
                }`}
              >
                Item 1.05 Breaches
              </button>
              <button
                onClick={() => setActiveTab("502")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "502" ? "bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:text-zinc-400"
                }`}
              >
                Item 5.02 CISO Moves
              </button>
            </div>
          </div>

          {/* Radar Feed List + Preview Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-zinc-800">
            {/* Feed List (7 cols) */}
            <div className="lg:col-span-7 divide-y divide-slate-100 dark:divide-zinc-800/50">
              {filteredFilings.map((filing) => (
                <div
                  key={filing.ticker}
                  onClick={() => setSelectedFiling(filing)}
                  className={`flex cursor-pointer items-start justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${
                    selectedFiling?.ticker === filing.ticker ? "bg-slate-50 dark:bg-zinc-800/70" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="rounded border border-slate-200 bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      ${filing.ticker}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                        {filing.companyName}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 dark:text-zinc-400">
                        {filing.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${
                        filing.itemType === "Item 1.05"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                      }`}
                    >
                      {filing.itemType}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500">{filing.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Signal Executive Brief Drawer (5 cols) */}
            <div className="lg:col-span-5 p-5 bg-slate-50/50 dark:bg-zinc-950/50">
              {selectedFiling ? (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-zinc-400">EXECUTIVE BRIEF</span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">VERIFIED SEC 8-K</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                    {selectedFiling.companyName} (${selectedFiling.ticker})
                  </h3>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">Slack Dispatch Preview:</p>
                    <p className="text-slate-600 dark:text-zinc-400">
                      🚨 <strong>{selectedFiling.itemType} Disclosure Detected</strong><br/>
                      • Company: {selectedFiling.companyName}<br/>
                      • Ticker: ${selectedFiling.ticker}<br/>
                      • Impact: {selectedFiling.summary}
                    </p>
                  </div>
                  <button className="mt-4 w-full rounded-md bg-slate-900 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200">
                    Copy Pitch Outline
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Select a filing to view details.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

#### Section 2: 3-Tier Pricing Architecture ($0 / $49 / $299)
- Designed to capture developers & small teams with a generous **Free Slack Bot**, monetize individual sales reps / IR consultants at **$49/mo**, and scale to enterprise security vendors / IR firms at **$299/mo**.

```
+-----------------------------------------------------------------------------------+
|                            3-TIER PRICING ARCHITECTURE                            |
+-------------------+-------------------------------+-------------------------------+
| COMMUNITY FREE    | PRO SIGNAL HUB ($49/mo)       | ENTERPRISE IR ($299/mo)       |
| $0/month          | $49/month ($39/mo billed yr)  | $299/month ($239/mo billed yr)|
| - 1 Watchlist     | - Unlimited Watchlists        | - 5 User Workspaces           |
| - 15-min Delay    | - Sub-5s Real-Time SLA        | - Dedicated Priority EDGAR    |
| - Basic Slack Bot | - LLM 8-K Executive Summaries | - CISO Shift Pitch Generator  |
| - Email Digests   | - Slack + Discord + Webhooks  | - Custom Retainer Webhooks    |
| - Community Hub   | - 14-Day Free Trial           | - Dedicated Account Manager   |
+-------------------+-------------------------------+-------------------------------+
```

```tsx
// Pricing Section Component Snippet (app/components/PricingSection.tsx)
"use client";

import React, { useState } from "react";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            TRANSPARENT PRICING
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Start Free. Scale as You Catch Retainers.
          </p>
          
          {/* Monthly / Annual Billing Switch */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 dark:bg-zinc-700 transition-colors"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
              Billed Annually <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Tier 1: Free */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Community Free</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">Essential monitoring for individual researchers.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-500"> / forever</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">✓ 1 Watchlist Ticker</li>
                <li className="flex items-center gap-2">✓ 15-Minute Delayed Alerts</li>
                <li className="flex items-center gap-2">✓ Standard Slack Bot Integration</li>
                <li className="flex items-center gap-2">✓ Daily Email Digest</li>
              </ul>
            </div>
            <a href="/api/slack/install" className="mt-8 block w-full rounded-lg border border-slate-300 bg-white py-2.5 text-center text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
              Install Free Slack Bot
            </a>
          </div>

          {/* Tier 2: Pro Signal (Highlighted) */}
          <div className="relative rounded-xl border-2 border-slate-900 bg-white p-8 shadow-xl dark:border-white dark:bg-zinc-950 flex flex-col justify-between">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-white dark:bg-white dark:text-slate-900">
              MOST POPULAR
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro Signal Hub</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">Real-time alerts for active sales reps &amp; IR consultants.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${isAnnual ? "39" : "49"}</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">✓ Unlimited Watchlist Tickers</li>
                <li className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">✓ Sub-5s Real-Time EDGAR Ingestion SLA</li>
                <li className="flex items-center gap-2">✓ Full AI LLM 8-K Executive Summaries</li>
                <li className="flex items-center gap-2">✓ Slack + Discord + Custom Webhooks</li>
                <li className="flex items-center gap-2">✓ 14-Day Free Trial</li>
              </ul>
            </div>
            <a href="/api/checkout?tier=pro" className="mt-8 block w-full rounded-lg bg-slate-900 py-2.5 text-center text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100">
              Start 14-Day Free Trial
            </a>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise IR</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">Multi-seat intelligence center for MSSPs &amp; IR firms.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${isAnnual ? "239" : "299"}</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">✓ 5 Workspace Seat Licenses</li>
                <li className="flex items-center gap-2">✓ Priority Dedicated EDGAR Socket</li>
                <li className="flex items-center gap-2">✓ CISO Shift Lead Scoring Radar</li>
                <li className="flex items-center gap-2">✓ Custom Retainer Pitch Builder</li>
                <li className="flex items-center gap-2">✓ Dedicated Account Manager &amp; SOC 2</li>
              </ul>
            </div>
            <a href="/api/checkout?tier=enterprise" className="mt-8 block w-full rounded-lg border border-slate-300 bg-white py-2.5 text-center text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
              Contact Sales / Buy Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

#### Section 3: Interactive Bento Feature Grid (2x2 / 3x2)
The feature grid deconstructs the 4 core product capabilities into visual, interactive cards with Notion border styles:
1. **Speed SLA (Sub-5 Second Ingestion)**: Visual comparison bar chart showing Watchpost's sub-5s WebSocket polling vs legacy Bloomberg/AlphaSense 15-minute delays.
2. **Executive Summarizer**: AI synthesis box transforming a 40-page SEC 8-K legal filing into 3 clear IR pitch bullet points.
3. **CISO Pathways**: Track Item 5.02 executive transitions to capture the 90-day vendor contract re-evaluation window.
4. **Slack Dispatch**: Native Slack Block Kit alert formatting with instant 1-click team escalation buttons.

---

#### Section 4: Customer ROI Calculator
Allows IR firms and cybersecurity sales leaders to model their expected return on investment dynamically:

```tsx
// Customer ROI Calculator Component (app/components/RoiCalculator.tsx)
"use client";

import React, { useState } from "react";

export function RoiCalculator() {
  const [retainerValue, setRetainerValue] = useState<number>(35000);
  const [pitchesPerMonth, setPitchesPerMonth] = useState<number>(2);

  const annualRevenueOpportunity = retainerValue * pitchesPerMonth * 12;
  const proAnnualCost = 39 * 12; // $468/yr
  const roiMultiplier = Math.round(annualRevenueOpportunity / proAnnualCost);

  return (
    <section className="py-20 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            INTERACTIVE ROI MODEL
          </h2>
          <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Calculate Your IR Pitch &amp; Sales Pipeline ROI
          </h3>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  <span>Avg. Incident Response Retainer / Contract:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">${retainerValue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={retainerValue}
                  onChange={(e) => setRetainerValue(Number(e.target.value))}
                  className="mt-2 w-full accent-slate-900 dark:accent-white"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  <span>Target Filings Pitched / Month:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{pitchesPerMonth} Filings</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={pitchesPerMonth}
                  onChange={(e) => setPitchesPerMonth(Number(e.target.value))}
                  className="mt-2 w-full accent-slate-900 dark:accent-white"
                />
              </div>
            </div>

            {/* Live Calculation Output */}
            <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">ANNUAL PIPELINE OPPORTUNITY</span>
              <span className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
                ${annualRevenueOpportunity.toLocaleString()}
              </span>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-zinc-400">Watchpost Pro Cost:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">${proAnnualCost}/yr</span>
              </div>
              <div className="mt-2 flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-zinc-400">Estimated ROI Multiplier:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{roiMultiplier}x ROI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

#### Section 5: Minimalist Notion-Style Footer
- Clean multi-column links (`Product`, `pSEO SEC Ticker Hubs`, `Legal & Compliance`, `System Status`).
- Regulatory Disclaimer Callout: *"Informational regulatory alert service; not legal, financial, or investment advice."*
- Real-Time System Health Indicator: Green pulsing badge *"SEC EDGAR Stream: 100% Operational (0.42s latency)"*.

---

## Section 2: Programmatic SEO (pSEO) Strategy & Route Architecture

Programmatic SEO enables Watchpost HQ to capture long-tail organic search traffic for thousands of publicly traded companies. When executives, IR leads, or security analysts search Google for `"[Ticker] SEC breach filing"`, `"[Company] CISO replacement 2026"`, or `"Item 1.05 filing [Company]"`, Watchpost HQ’s dynamic pages rank on Page 1.

### 2.1 Next.js 15 App Router Route Specification

```
app/
├── sec/
│   ├── company/
│   │   └── [ticker]/
│   │       └── page.tsx      # Ticker Hub Page (e.g. /sec/company/aapl)
│   ├── breaches/
│   │   └── [year]/
│   │       └── [id]/
│   │           └── page.tsx  # Item 1.05 Breach Detail (e.g. /sec/breaches/2026/0000320193-26-000012)
│   └── ciso-moves/
│       └── [ticker]/
│           └── page.tsx      # Item 5.02 CISO Transition Hub (e.g. /sec/ciso-moves/crwd)
└── sitemap.ts                # Dynamic XML Sitemap Generator
```

---

### 2.2 Route 1: Company SEC Radar Hub (`app/sec/company/[ticker]/page.tsx`)

> **Next.js 15 Breaking Pattern Note**: In Next.js 15, `params` is an asynchronous Promise! You must declare `params: Promise<{ ticker: string }>` and `await params` before accessing properties.

```tsx
// app/sec/company/[ticker]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Page Config for Incremental Static Regeneration (ISR)
export const revalidate = 3600; // Revalidate static cache every hour
export const dynamicParams = true; // Build un-generated pages dynamically

interface Props {
  params: Promise<{ ticker: string }>;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Pre-render top 500 S&P 500 tickers at build time for instant loading
export async function generateStaticParams() {
  const { data: companies } = await supabase
    .from("companies")
    .select("ticker")
    .limit(500);

  return (companies || []).map((c) => ({
    ticker: c.ticker.toLowerCase(),
  }));
}

// Dynamic OpenGraph & SEO Metadata Generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  const { data: company } = await supabase
    .from("companies")
    .select("company_name, cik")
    .eq("ticker", upperTicker)
    .single();

  if (!company) return { title: "Company Not Found | Watchpost HQ" };

  const title = `${company.company_name} (${upperTicker}) SEC 8-K Regulatory Signal & Breach Radar`;
  const description = `Monitor live SEC EDGAR 8-K filings for ${company.company_name} (${upperTicker}). Track Item 1.05 cybersecurity disclosures and Item 5.02 CISO executive transitions.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://watchpost.hq/sec/company/${ticker.toLowerCase()}`,
      siteName: "Watchpost HQ",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CompanyRadarPage({ params }: Props) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  // Fetch company info
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("ticker", upperTicker)
    .single();

  if (!company) notFound();

  // Fetch company's recent 8-K filings
  const { data: filings } = await supabase
    .from("filings")
    .select("*")
    .eq("cik", company.cik)
    .order("filing_date", { ascending: false })
    .limit(20);

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.company_name,
    tickerSymbol: upperTicker,
    identifier: company.cik,
    url: `https://watchpost.hq/sec/company/${ticker.toLowerCase()}`,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-8 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1 font-mono text-sm font-bold text-slate-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            ${upperTicker}
          </span>
          <span className="font-mono text-xs text-slate-500">CIK: {company.cik}</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
          {company.company_name} SEC Regulatory Signal Radar
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
          Exchange: {company.exchange || "N/A"} | SIC Code: {company.sic} ({company.sic_description || "General"})
        </p>
      </div>

      {/* Filings Table / History */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Historical 8-K Regulatory Disclosures
        </h2>
        {filings && filings.length > 0 ? (
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {filings.map((filing) => (
              <div key={filing.id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono text-xs text-slate-500">
                      {new Date(filing.filing_date).toLocaleDateString()}
                    </span>
                    {filing.item_105_flag && (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        Item 1.05 Breach
                      </span>
                    )}
                    {filing.item_502_flag && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        Item 5.02 CISO Shift
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mt-1">
                    {filing.title}
                  </h3>
                </div>
                <a
                  href={filing.raw_html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
                >
                  SEC EDGAR Original ↗
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No Item 1.05 or 5.02 disclosures recorded for this ticker.</p>
        )}
      </div>
    </div>
  );
}
```

---

### 2.3 Dynamic XML Sitemap Generator (`app/sitemap.ts`)

Generates dynamic XML sitemaps for Google Search Console, indexing all tickers, recent breach detail pages, and CISO move pages:

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://watchpost.hq";

  // Static marketing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Fetch all active company tickers
  const { data: companies } = await supabase
    .from("companies")
    .select("ticker, updated_at")
    .eq("is_active", true)
    .limit(5000);

  const companyRoutes: MetadataRoute.Sitemap = (companies || []).map((c) => ({
    url: `${baseUrl}/sec/company/${c.ticker.toLowerCase()}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  // Fetch recent Item 1.05 breach filings
  const { data: breachFilings } = await supabase
    .from("filings")
    .select("accession_number, filing_date")
    .eq("item_105_flag", true)
    .order("filing_date", { ascending: false })
    .limit(1000);

  const breachRoutes: MetadataRoute.Sitemap = (breachFilings || []).map((b) => {
    const year = new Date(b.filing_date).getFullYear();
    return {
      url: `${baseUrl}/sec/breaches/${year}/${b.accession_number}`,
      lastModified: new Date(b.filing_date),
      changeFrequency: "never",
      priority: 0.9,
    };
  });

  return [...staticRoutes, ...companyRoutes, ...breachRoutes];
}
```

---

### 2.4 Schema.org JSON-LD Structured Data Specs

To achieve **Google Rich Snippet Carousel** inclusion for cybersecurity news and regulatory events, Watchpost HQ injects standard Schema.org structured data:

1. **Item 1.05 Material Breach Pages (`NewsArticle` Schema)**:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "NewsArticle",
     "headline": "CrowdStrike Discloses Item 1.05 Material Cybersecurity Incident in SEC 8-K",
     "datePublished": "2026-09-21T14:00:00Z",
     "description": "CrowdStrike disclosed an active cybersecurity event under Item 1.05 in SEC Form 8-K.",
     "publisher": {
       "@type": "Organization",
       "name": "Watchpost HQ",
       "url": "https://watchpost.hq"
     },
     "about": {
       "@type": "Organization",
       "name": "CrowdStrike Holdings, Inc.",
       "tickerSymbol": "CRWD"
     }
   }
   ```

---

## Section 3: Step-by-Step Implementation Phasing

```
+-----------------------------------------------------------------------------------+
|                        STEP-BY-STEP IMPLEMENTATION ROADMAP                        |
+-----------------------------------------------------------------------------------+
| PHASE 1: NOTION MARKETING HOMEPAGE (app/page.tsx)                                 |
| - Setup Notion Tailwind tokens (#fafafa / #09090b / 1px borders)                   |
| - Implement HeroRadar, BentoGrid, PricingSection, RoiCalculator, Footer           |
| - Validate dark mode transitions & responsive layout breakpoints                  |
+-----------------------------------------------------------------------------------+
| PHASE 2: PROGRAMMATIC SEO ENGINE (app/sec/...)                                    |
| - Build company/[ticker], breaches/[year]/[id], ciso-moves/[ticker] routes        |
| - Inject generateMetadata() dynamic OpenGraph card generator                      |
| - Deploy app/sitemap.ts dynamic XML sitemap generator                             |
| - Ping Google Search Console API for indexation                                   |
+-----------------------------------------------------------------------------------+
| PHASE 3: CONVERSION & STRIPE CHECKOUT INTEGRATION                                 |
| - Implement app/api/slack/install (Slack OAuth Flow & Webhook Store)             |
| - Build app/api/checkout/route.ts (Stripe Checkout Session API)                 |
| - Build app/api/webhooks/stripe/route.ts (Pro / Enterprise Entitlement Provision)|
+-----------------------------------------------------------------------------------+
```

---

## Section 4: Primary Source Citations & References

1. **Next.js 15 Release Notes & Async Request APIs**: Official Next.js 15 App Router documentation on `await params`, `generateMetadata()`, `MetadataRoute.Sitemap`, and React 19 Server Components.
2. **SEC EDGAR Form 8-K Regulatory Rules**: SEC Rule 33-11216 (*Capital Markets Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure*), enforcing Item 1.05 (Material Incidents) and Item 5.02 (Executive Officers).
3. **Notion.com Visual Design Architecture**: Notion Brand and UI Style Guide teardown (warm neutrals `#fafafa` / `#09090b`, `#e2e8f0` / `#27272a` borders, monospaced metadata badges, Inter/Geist typography).
4. **Schema.org Structured Data Specifications**: Official `NewsArticle` and `Organization` JSON-LD specifications for search engine indexing.
5. **Stripe API Documentation**: Stripe Checkout Sessions and Webhook Event Handling (`checkout.session.completed`, `customer.subscription.updated`).
