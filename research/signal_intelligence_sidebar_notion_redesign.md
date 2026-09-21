# Signal Intelligence Sidebar Notion Redesign Research Specification

**Target File Path**: `/Users/rogerflanagan/Desktop/project-circus/research/signal_intelligence_sidebar_notion_redesign.md`  
**Author**: Watchpost HQ Research & Design Subagent  
**Date**: September 21, 2026  

---

## 1. Executive Summary & Audit of Current Codebase Components

Watchpost HQ's Signal Intelligence Sidebar is intended to give security leads, corporate risk analysts, and IR teams real-time actionable intelligence on SEC Form 8-K filings (specifically SEC Item 1.05 Material Cybersecurity Incidents and SEC Item 5.02 Executive Leadership Transitions). 

However, a detailed code audit of the current implementation reveals that the dynamic signal generation and frontend presentation layer feel synthetic, noisy, and like "junk" tier software. The system relies on static fallback arrays, hardcoded regex templates, saturated card borders, and visually aggressive controls that clash with modern minimalist productivity software like Notion.

Below is the granular audit breakdown across the key codebase files.

---

### 1.1 Detailed Audit of `lib/signalIntelligenceGenerator.ts` (Dynamic Generation Flaws)

| Architectural Function | Current Implementation Strategy | Why It Feels Synthetic & Flawed |
| :--- | :--- | :--- |
| `generateExecutiveSummary(filing)` | Basic regex test (`/testing\|staging/i`, `/ransomware\|encrypt/i`) returning canned static strings. | **Loss of Filing Context:** Ignores the actual narrative provided in `filing.summary_text`. A ransomware disclosure that lost 50M records gets mapped to the same generic canned string as a minor incident. |
| `calculateImpactScore(filing)` | Hardcoded base scores (85 for 105, 65 for 502) + static keyword bonuses (+12 for ransomware, +8 for exfiltration, +15 for CISO). | **Rigid Scoring Rules:** Lacks granular weights for actual filing severity, company size, recency decay, or specific operational details. |
| `scopeHighlights` (Enrichment) | Hardcoded static arrays: `['Testing Environment Containment', 'No Active Customer Data Impact', 'Third-Party Forensics Engaged']` for 1.05. | **Dangerous Inaccuracies:** Every single Item 1.05 filing receives the exact same 3 highlights—even if customer data *was* compromised or if containment is *ongoing*. |
| `contacts` (Decision Makers) | Hardcoded placeholder array: "Chief Information Security Officer (CISO)", "VP of Infrastructure & Cloud Security", "General Counsel". | **Generic Search Slots:** Uses placeholder roles with synthetic LinkedIn URL searches (`keywords=${encodedCompany}%20CISO`) instead of extracting actual executive names from filing disclosures. |
| Pitch Playbooks (`irPitchScript`, `vendorPitchScript`, `execBriefScript`) | Hardcoded template strings with manual replacement tokens like `[FirstName]`, `[Partner Name]`, `[Your Name]`. | **Template Fatigue:** Reads like standard spam templates. Fails to leverage dynamic filing quotes or specific disclosure details in the pitch narrative. |

---

### 1.2 Visual & UX Audit of `components/SignalActionCenter.tsx`

1. **Card Border Fatigue & Visual Noise:**
   - The UI nests multiple card boxes (`border: 1px solid ${borderColor}`, `borderRadius: 12px`, `padding: 20px`), creating heavy visual lines that fragment the sidebar layout.
   - Excessive border nesting creates high contrast borders that distract from reading content.

2. **Loud & Aggressive Badges/Gauges:**
   - Uses high-saturation badge tags (`⚡ IMPACT 85/100`) with semi-transparent background pills (`rgba(239, 68, 68, 0.15)`), bold 900 font weights, and heavy uppercase tracking (`CRITICAL URGENCY`).
   - Visual emphasis is placed on alarming numbers rather than clear context and readable intelligence.

3. **Clunky & High-Contrast Action Buttons:**
   - Heavy solid background fills: Pitch Black (`#0f172a`), Slack Purple (`#4a154b`), Resend Blue (`#2563eb`).
   - Buttons feature inline keyboard shortcut tags like `(c)`, `(s)`, `(e)`, `(o)` styled with raw opacity spans that clutter the button label.
   - Color saturation distracts the eye away from the document body.

4. **Unstyled Monospaced Script Displays:**
   - Renders outreach scripts inside a raw `<pre>` tag with fixed height (`maxHeight: 180px`), native browser scrollbars, and high-contrast monospaced font styling.
   - Fails to mirror modern Notion-style code blocks (which feature soft background tints, subtle border-radius, clean header metadata, and unobtrusive copy triggers).

---

## 2. Dynamic Company-Specific Signal Enrichment Architecture

To eliminate canned boilerplate, the signal enrichment engine must dynamically parse, extract, and score filing metadata directly from `filing.summary_text` or `filing.description`.

```
┌───────────────────────────────┐
│     Raw SEC EDGAR Filing      │
│ (summary_text & company info) │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Key Sentence & Fact Extractor │
│   (Sentence Tokenization &    │
│    Contextual Regex Match)    │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Dynamic Impact Scoring Matrix │
│ (Severity, Recency, Keywords) │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Contextual Pitch & Contact    │
│       Generator Engine        │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│  Notion-Styled Sidebar UI     │
│ (Properties, Callout, Code)   │
└───────────────┬───────────────┘
```

### 2.1 Key Sentence Extraction & Dynamic Summarization Algorithm

Instead of returning a pre-baked static paragraph, `generateExecutiveSummary()` must execute a multi-tier sentence extraction algorithm:

1. **Sentence Parsing:** Split `filing.summary_text` into discrete sentences using punctuation boundaries (`[.!?]`).
2. **Key Fact Scoring:** Rank sentences based on regulatory and security keywords:
   - *Incident Scope:* `testing`, `production`, `unauthorized`, `exfiltration`, `encrypted`, `ransomware`, `containment`.
   - *Operational Impact:* `restored`, `isolated`, `no material impact`, `ongoing evaluation`, `downtime`.
   - *Leadership Shift:* `appointed`, `resigned`, `chief information security officer`, `ciso`, `vp security`, `effective immediately`.
3. **Dynamic Synthesis:** Select the top 1-2 most informative verbatim sentences from the SEC filing text. If parsing yields insufficient text, synthesize a dynamic sentence incorporating actual extracted entity names, dates, and CIK/ticker numbers.

### 2.2 Company-Tailored Impact Indicator Engine

The new scoring model calculates a dynamic `impactScore` (50–99) using weighted scoring factors:

- **Base Score:** 80 for Item 1.05 (Cyber Incident); 60 for Item 5.02 (Executive Transition).
- **Severity Modifiers:**
  - `+12`: Active exfiltration / customer data compromise mentioned in text.
  - `+10`: Operational interruption / systems offline / ransomware mentioned.
  - `+8`: Third-party forensic firm / law enforcement engaged.
  - `+15`: Direct CISO / VP of Security departure (for Item 5.02).
  - `+5`: General director / officer departure.
- **Dynamic Scope Highlights Generation:** Derived dynamically by inspecting extracted key sentences:
  - If text includes "testing environment" -> Highlight: `Testing Env Isolated`
  - If text includes "isolated" -> Highlight: `Threat Environment Isolated`
  - If text includes "no material impact" -> Highlight: `No Material Operational Impact`
  - If text includes "CISO" -> Highlight: `CISO Leadership Shift`

### 2.3 Contextual Outbound Playbook & Contact Generator

- **Dynamic LinkedIn URL Construction:** Generates specific search strings based on detected executive roles and extracted names:
  `https://www.linkedin.com/search/results/people/?keywords=${companyName}%20${extractedRole}`
- **Contextual Script Injection:** Pitch playbooks inject real filing facts into outreach templates:
  ```text
  "Saw ${companyName}'s Item 1.05 filing disclosed on ${filingDate}. Specifically noting that '${extractedKeySentence}', our team can assist with rapid forensic audit verification..."
  ```

---

## 3. Notion Design System UI Specification

The Notion design philosophy centers on **typography, structured metadata (properties), soft callout blocks, subtle monospaced blocks, and low-contrast muted buttons**.

### 3.1 Design System Tokens

| Design Element | Notion Light Mode Token | Notion Dark Mode Token |
| :--- | :--- | :--- |
| **Workspace Canvas** | `#FFFFFF` | `#191919` |
| **Secondary Block Background** | `#F7F6F3` | `#222222` |
| **Callout Block Tint** | `#F1F0EC` | `#252525` |
| **Border Accent** | `#E9E8E4` | `#2F2F2F` |
| **Primary Text Color** | `#37352F` | `#D4D4D4` |
| **Muted Text Color** | `#787774` | `#9B9B9B` |
| **Accent Text Color** | `#0B6E99` (Notion Blue) | `#529CCA` |
| **Font Family (Sans)** | `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica` |
| **Font Family (Mono)** | `SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace` |

---

### 3.2 Notion Property List Component Spec

Notion pages format top-level metadata as a clean Property List rather than noisy bordered header cards.

- **Layout:** Vertical list of key-value pairs with subtle 16px row height, 13px font size, and muted property labels.
- **Properties Rendered:**
  - `🏷️ Signal Type`: Item 1.05 (Cyber Incident) or Item 5.02 (Leadership Shift)
  - `⚡ Impact Score`: Notion-styled progress pill or numerical text (`88 / 100 • Critical`)
  - `🏢 Company / Ticker`: `$CRWD` (CrowdStrike Holdings)
  - `📅 Filing Timestamp`: `Sep 21, 2026, 14:22 UTC`
  - `🔗 EDGAR Source`: Raw HTML link formatted as an inline Notion link with standard arrow indicator (`sec.gov ↗`).

---

### 3.3 Notion Callout Block Component Spec

Replaces nested executive summary card containers with standard Notion Callout Blocks.

- **Visual Features:**
  - Background fill: `#F1F0EC` (Light) / `#252525` (Dark).
  - Border: Subtle 1px solid `#E9E8E4`.
  - Border-radius: `6px`.
  - Icon slot: Notion emoji (`💡` for AI summary, `⚡` for critical incident, `👤` for leadership shift).
  - Scope Pill Tags: Soft, borderless grey tags (`background: #E8E7E3`, `color: #37352F`, `fontSize: 11px`, `borderRadius: 3px`).

---

### 3.4 Notion Monospaced Code & Script Block Component Spec

Replaces raw `<pre>` scrollboxes with clean Notion Code Blocks.

- **Visual Features:**
  - Soft grey block container (`#F7F6F3` light / `#222222` dark) with `6px` rounded corners.
  - Header bar: Displays script type label (`ir-playbook.md`, `slack-payload.json`) in muted 11px monospaced text alongside a subtle "Copy" ghost button.
  - Font styling: `12px` font size, `1.6` line-height, monospaced stack, `color: #37352F`.
  - Padding: `12px 16px`.

---

### 3.5 Minimal Muted Action Controls Component Spec

Replaces heavy solid purple/blue buttons with Notion-style ghost and text buttons.

- **Visual Features:**
  - Borderless or 1px subtle border (`#E9E8E4`).
  - Background: Transparent by default; subtle fill (`#EFEEEA`) on hover.
  - Text color: `#37352F` (Light) / `#D4D4D4` (Dark).
  - Typography: `12px` font size, `500` medium weight.
  - Keyboard shortcuts: Clean muted subscript tags (`⌘C`, `⌘S`, `⌘E`).
