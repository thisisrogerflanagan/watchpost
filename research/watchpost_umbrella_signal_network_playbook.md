# Watchpost HQ: The Umbrella Signal Network Playbook

**Target File Path**: `/Users/rogerflanagan/Desktop/project-circus/research/watchpost_umbrella_signal_network_playbook.md`  
**Author**: Watchpost HQ Product Strategy Architect  
**Date**: September 21, 2026  

---

## Executive Summary

Building a single niche app can be risky, but building **"Watchpost HQ" as an Umbrella Signal Network** transforms a solo developer into an automated financial & corporate intelligence platform (similar to how YipitData, Quiver Quantitative, or Bloomberg aggregated multiple feeds under one ecosystem).

Because every open data signal (SEC filings, SAM.gov procurement, ClinicalTrials.gov, State WARN notices, Socrata permits) shares the **exact same technical stack**, 90% of the code written for Watchpost HQ is reusable across every vertical.

---

## 1. The Watchpost Umbrella Product Suite

```
                               ┌───────────────────────────────────┐
                               │           WATCHPOST HQ            │
                               │  Umbrella Signal Network ($0 CAC)  │
                               └─────────────────┬─────────────────┘
                                                 │
      ┌───────────────────┬──────────────────────┼──────────────────────┬───────────────────┐
      │                   │                      │                      │                   │
      ▼                   ▼                      ▼                      ▼                   ▼
🛡️ Watchpost SecOps  🏛️ Watchpost Gov   🧬 Watchpost BioPharma   📢 Watchpost WARN   🏗️ Watchpost Permits
(SEC 8-K Breaches)   (SAM.gov Contracts)  (Clinical Trials)      (State Layoffs)     (Municipal Permits)
$199 - $499/mo       $199 - $399/mo       $399 - $799/mo         $99 - $199/mo       $149 - $299/mo
```

### Vertical Breakdown
1. **Watchpost SecOps**: SEC 8-K Item 1.05 Breaches & Item 5.02 C-Suite Shifts ($199–$499/mo).
2. **Watchpost GovContracts**: SAM.gov 5-year contract expirations & small-biz quotas ($199–$399/mo).
3. **Watchpost BioPharma**: ClinicalTrials.gov Phase 3 updates & USPTO biotech patent assignments ($399–$799/mo).
4. **Watchpost WARN**: 50 State Department of Labor WARN Act layoff disclosures ($99–$199/mo).
5. **Watchpost Permits**: Socrata municipal commercial construction permit leads ($149–$299/mo).

---

## 2. Universal Signal Schema & Reusable Architecture

Because all signals are normalized into a single PostgreSQL table structure in Supabase, adding a new signal source takes **less than 1 day of work**.

```sql
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical_id VARCHAR(50) NOT NULL, -- 'secops', 'govcontracts', 'biopharma', 'warn', 'permits'
  external_id VARCHAR(255) NOT NULL, -- Accession No., SolId, NCT ID, WARN ID
  ticker VARCHAR(20),
  entity_name VARCHAR(255) NOT NULL,
  signal_type VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  impact_score INT DEFAULT 70,
  urgency_level VARCHAR(20) DEFAULT 'MEDIUM',
  raw_html_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb, -- Industry, NAICS, Phase, Valuation
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Shared Multi-Tenant Dispatch Router
A single dispatch function routes any signal to client Slack channels or Discord webhooks regardless of vertical:

```typescript
export async function routeSignalToSubscribers(signal: NormalizedSignal) {
  // 1. Query active subscriptions matching signal.vertical_id
  const activeSubs = await getSubscribersForVertical(signal.vertical_id);

  // 2. Dispatch in parallel to Slack & Discord
  for (const sub of activeSubs) {
    if (sub.slack_webhook_url) {
      await sendSlackBlockKitCard(sub.slack_webhook_url, signal);
    }
    if (sub.discord_webhook_url) {
      await sendDiscordEmbedCard(sub.discord_webhook_url, signal);
    }
  }
}
```

---

## 3. Monetization & Pricing Bundles

| Subscription Tier | Monthly Price | Feeds Included | Target Buyer |
| :--- | :--- | :--- | :--- |
| **Single Radar Pass** | **$149 – $399 / mo** | Pick any 1 vertical (e.g. SecOps or BioPharma) | Solo SDR, niche recruiter, local distributor |
| **Dual Radar Pass** | **$499 / mo** | Pick any 2 verticals | IR Law Firms, Regional MSSPs |
| **Watchpost Network All-Access Pass** | **$999 / mo** | **ALL 5 Verticals** + Raw JSON API + Unlimited Slack Webhooks | Hedge Funds, Enterprise Risk Desks, MDRs |

---

## 4. Programmatic SEO Network Moat

By aggregating all 5 signal sources under `watchposthq.com`, the domain builds massive organic search authority:

- `watchposthq.com/sec/company/[ticker]` (100+ public company breach hubs)
- `watchposthq.com/gov/naics/[naicscode]` (1,000+ federal procurement hubs)
- `watchposthq.com/biotech/trials/[nct_id]` (10,000+ clinical trial status hubs)
- `watchposthq.com/layoffs/state/[state]` (50 state layoff tracking hubs)
- `watchposthq.com/permits/city/[city]` (100+ city commercial permit hubs)

Over 50,000 indexable pSEO pages driving **free organic search traffic** directly to Watchpost HQ signup pages with $0 ad spend.

---

## 5. Solo Developer Rollout Roadmap

- **Month 1 (Current Baseline)**: Solidify **Watchpost SecOps** (SEC EDGAR 8-K) + Slack/Discord Webhooks.
- **Month 2**: Launch **Watchpost WARN** (State Layoffs API) + **Watchpost GovContracts** (SAM.gov API).
- **Month 3**: Launch **Watchpost BioPharma** (ClinicalTrials.gov API).
- **Month 4**: Launch **Watchpost Network All-Access Pass** ($999/mo).
