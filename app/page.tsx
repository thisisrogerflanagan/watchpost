'use client';

import React, { useState } from 'react';

interface FilingSignal {
  ticker: string;
  companyName: string;
  itemType: 'Item 1.05' | 'Item 5.02';
  timeAgo: string;
  summary: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

const MOCK_FILINGS: FilingSignal[] = [
  {
    ticker: 'CRWD',
    companyName: 'CrowdStrike Holdings, Inc.',
    itemType: 'Item 1.05',
    timeAgo: '1m ago',
    summary: 'Disclosed material network incident in testing environment. Internal server isolated; live customer data uncompromised.',
    severity: 'CRITICAL',
  },
  {
    ticker: 'LII',
    companyName: 'Lennox International Inc.',
    itemType: 'Item 5.02',
    timeAgo: '4m ago',
    summary: 'Appointed new Chief Information Security Officer (CISO). 90-day vendor security stack evaluation window open.',
    severity: 'HIGH',
  },
  {
    ticker: 'KR',
    companyName: 'Kroger Co.',
    itemType: 'Item 1.05',
    timeAgo: '12m ago',
    summary: 'Disclosed operational network incident under Item 1.05. Incident response protocols activated; containment verified.',
    severity: 'CRITICAL',
  },
  {
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    itemType: 'Item 5.02',
    timeAgo: '18m ago',
    summary: 'Executive leadership transition announced under Item 5.02. Key C-suite security oversight shift.',
    severity: 'HIGH',
  },
];

export default function LandingPage() {
  const [selectedFiling, setSelectedFiling] = useState<FilingSignal>(MOCK_FILINGS[0]);
  const [activeRadarTab, setActiveRadarTab] = useState<'ALL' | '105' | '502'>('ALL');
  const [isAnnual, setIsAnnual] = useState(true);

  // ROI Calculator States
  const [retainerValue, setRetainerValue] = useState<number>(35000);
  const [pitchesPerMonth, setPitchesPerMonth] = useState<number>(2);

  const annualRevenueOpportunity = retainerValue * pitchesPerMonth * 12;
  const starterAnnualCost = (isAnnual ? 39 : 49) * 12;
  const roiMultiplier = Math.round(annualRevenueOpportunity / starterAnnualCost);

  const filteredFilings = MOCK_FILINGS.filter((f) => {
    if (activeRadarTab === '105') return f.itemType === 'Item 1.05';
    if (activeRadarTab === '502') return f.itemType === 'Item 5.02';
    return true;
  });

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Notion Top Navigation */}
      <nav style={{ borderBottom: '1px solid #27272a', backgroundColor: '#18181b', padding: '14px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '900', letterSpacing: '0.05em' }}>
              SEC RADAR
            </span>
            <span style={{ fontWeight: '900', fontSize: '18px', color: '#ffffff', tracking: '-0.02em' }}>
              Watchpost HQ
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', fontWeight: '600' }}>
            <a href="#radar" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Live Radar</a>
            <a href="#features" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Features</a>
            <a href="#roi" style={{ color: '#a1a1aa', textDecoration: 'none' }}>ROI Model</a>
            <a href="#pricing" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Pricing</a>
            <a href="/feed" style={{ color: '#ffffff', backgroundColor: '#27272a', border: '1px solid #3f3f46', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none' }}>
              Open Feed Terminal →
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="radar" style={{ borderBottom: '1px solid #27272a', padding: '80px 24px', backgroundImage: 'radial-gradient(rgba(63, 63, 70, 0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          {/* Status Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#18181b', border: '1px solid #27272a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', marginBottom: '24px' }}>
            <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#4ade80', fontSize: '11px' }}>LIVE RADAR ACTIVE</span>
            <span style={{ color: '#3f3f46' }}>|</span>
            <span style={{ color: '#a1a1aa' }}>Sub-Second SEC EDGAR Ingestion SLA</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.1', margin: '0 0 20px', color: '#ffffff', letterSpacing: '-0.03em', maxWidth: '850px' }}>
            Detect Material SEC 8-K Breaches &amp; CISO Shifts <span style={{ color: '#38bdf8', borderBottom: '3px solid #38bdf8' }}>Before Headlines</span>.
          </h1>

          <p style={{ fontSize: '18px', color: '#a1a1aa', margin: '0 0 32px', maxWidth: '720px', lineHeight: '1.6' }}>
            Watchpost HQ monitors SEC EDGAR filings 24/7. Convert raw Form 8-K Item 1.05 cybersecurity breach disclosures and Item 5.02 executive shifts into instant Slack &amp; email outreach playbooks.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '50px' }}>
            <a href="https://hooks.slack.com" target="_blank" rel="noreferrer" style={{ backgroundColor: '#ffffff', color: '#09090b', padding: '12px 24px', borderRadius: '8px', fontWeight: '800', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>💬</span> Install Free Slack Bot ($0)
            </a>
            <a href="#pricing" style={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
              Start $49/mo Starter Trial →
            </a>
          </div>

          {/* Interactive Live Radar Drawer Demo */}
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            {/* Header bar */}
            <div style={{ borderBottom: '1px solid #27272a', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#09090b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#71717a', marginLeft: '8px' }}>watchpost-live-radar-feed.v1</span>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#18181b', padding: '3px', borderRadius: '6px', border: '1px solid #27272a' }}>
                {[
                  { id: 'ALL', label: 'All Signals' },
                  { id: '105', label: 'Item 1.05 Breaches' },
                  { id: '502', label: 'Item 5.02 CISO Moves' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRadarTab(tab.id as any)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: activeRadarTab === tab.id ? '#27272a' : 'transparent',
                      color: activeRadarTab === tab.id ? '#ffffff' : '#a1a1aa',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content split grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', borderTop: '1px solid #27272a' }}>
              {/* Left Column: Feed List */}
              <div style={{ borderRight: '1px solid #27272a' }}>
                {filteredFilings.map((filing) => {
                  const isSelected = selectedFiling.ticker === filing.ticker;
                  return (
                    <div
                      key={filing.ticker}
                      onClick={() => setSelectedFiling(filing)}
                      style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #27272a',
                        backgroundColor: isSelected ? '#27272a' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '13px', backgroundColor: '#09090b', border: '1px solid #3f3f46', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px' }}>
                            ${filing.ticker}
                          </span>
                          <span style={{ fontWeight: '700', fontSize: '14px', color: '#ffffff' }}>{filing.companyName}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace' }}>{filing.timeAgo}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: filing.itemType === 'Item 1.05' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: filing.itemType === 'Item 1.05' ? '#ef4444' : '#3b82f6'
                        }}>
                          {filing.itemType}
                        </span>
                        <span style={{ fontSize: '12px', color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                          {filing.summary}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Executive Brief Preview */}
              <div style={{ padding: '24px', backgroundColor: '#09090b' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #27272a', pb: '10px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '800', color: '#a1a1aa' }}>EXECUTIVE BRIEF PREVIEW</span>
                  <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: '700', fontFamily: 'monospace' }}>✓ VERIFIED EDGAR DISCLOSURE</span>
                </div>

                <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', marginBottom: '12px' }}>
                  {selectedFiling.companyName} (${selectedFiling.ticker})
                </div>

                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Executive Signal Intelligence
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#f4f4f5', margin: 0 }}>
                    {selectedFiling.summary}
                  </p>
                </div>

                <div style={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#4ade80', marginBottom: '4px' }}>
                    💬 Instant Slack Dispatch Payload
                  </div>
                  <pre style={{ margin: 0, fontSize: '11.5px', fontFamily: 'monospace', color: '#a1a1aa', whiteSpace: 'pre-wrap' }}>
                    {`🚨 ${selectedFiling.itemType} DISCLOSURE DETECTED
Company: ${selectedFiling.companyName} ($${selectedFiling.ticker})
Severity: ${selectedFiling.severity} URGENCY
Summary: ${selectedFiling.summary}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latency Benchmark Section */}
      <section style={{ borderBottom: '1px solid #27272a', padding: '60px 24px', backgroundColor: '#18181b' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              SPEED SLA BENCHMARK
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', margin: '6px 0 0' }}>
              Sub-Second Ingestion vs. Legacy Financial Tools
            </h2>
          </div>

          <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272a', color: '#71717a', fontFamily: 'monospace', fontSize: '11px' }}>
                  <th style={{ padding: '14px 20px' }}>DISCLOSURE SIGNAL</th>
                  <th style={{ padding: '14px 20px' }}>SEC PUBLICATION TIME</th>
                  <th style={{ padding: '14px 20px' }}>WATCHPOST DISPATCH</th>
                  <th style={{ padding: '14px 20px' }}>BLOOMBERG / RSS DELAY</th>
                  <th style={{ padding: '14px 20px' }}>SPEED ADVANTAGE</th>
                </tr>
              </thead>
              <tbody style={{ color: '#f4f4f5' }}>
                <tr style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '14px 20px', fontWeight: '700' }}>Item 1.05 Material Breach</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace' }}>16:42:12.102 UTC</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#4ade80', fontWeight: '700' }}>16:42:13.410 UTC</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#ef4444' }}>16:58:20.000 UTC</td>
                  <td style={{ padding: '14px 20px', fontWeight: '800', color: '#4ade80' }}>+16m 06s Faster</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: '700' }}>Item 5.02 CISO Leadership Shift</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace' }}>14:02:04.880 UTC</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#4ade80', fontWeight: '700' }}>14:02:06.120 UTC</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#ef4444' }}>14:24:10.000 UTC</td>
                  <td style={{ padding: '14px 20px', fontWeight: '800', color: '#4ade80' }}>+22m 04s Faster</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi" style={{ borderBottom: '1px solid #27272a', padding: '80px 24px', backgroundColor: '#09090b' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '36px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              INTERACTIVE ROI CALCULATOR
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', margin: '6px 0 24px' }}>
              Calculate Your IR Retainer &amp; Sales Pipeline Return
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                    <span>Avg. Retainer / Contract Value:</span>
                    <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>${retainerValue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="5000"
                    value={retainerValue}
                    onChange={(e) => setRetainerValue(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#38bdf8' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                    <span>Target Deals Pitched / Month:</span>
                    <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{pitchesPerMonth} Filings</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={pitchesPerMonth}
                    onChange={(e) => setPitchesPerMonth(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#38bdf8' }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#a1a1aa', textTransform: 'uppercase' }}>
                  ANNUAL PIPELINE OPPORTUNITY
                </div>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#4ade80', margin: '8px 0' }}>
                  ${annualRevenueOpportunity.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#a1a1aa', borderTop: '1px solid #27272a', paddingTop: '12px', marginTop: '12px' }}>
                  Watchpost Starter Cost: <span style={{ fontFamily: 'monospace', color: '#ffffff' }}>${starterAnnualCost}/yr</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', marginTop: '6px' }}>
                  Estimated ROI Multiplier: {roiMultiplier}x Net Return
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section ($0 / $49 / $299) */}
      <section id="pricing" style={{ padding: '80px 24px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              TRANSPARENT SELF-SERVE PRICING
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: '6px 0 16px' }}>
              Start Free. Scale as You Win Retainers.
            </h2>

            {/* Annual Billing Switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '14px', fontWeight: '600' }}>
              <span style={{ color: !isAnnual ? '#ffffff' : '#a1a1aa' }}>Monthly Billing</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: '#27272a', border: '1px solid #3f3f46', position: 'relative', cursor: 'pointer' }}
              >
                <span style={{ height: '18px', width: '18px', borderRadius: '50%', backgroundColor: '#ffffff', position: 'absolute', top: '2px', left: isAnnual ? '26px' : '2px', transition: 'left 0.15s ease' }} />
              </button>
              <span style={{ color: isAnnual ? '#ffffff' : '#a1a1aa' }}>
                Annual Billing <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '12px', marginLeft: '6px' }}>SAVE 20%</span>
              </span>
            </div>
          </div>

          {/* 3 Pricing Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* Tier 1: Free */}
            <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>Free Signal Radar</div>
                <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px' }}>Essential SEC alerts for researchers &amp; BDRs.</div>
                <div style={{ fontSize: '38px', fontWeight: '900', color: '#ffffff', margin: '20px 0 16px' }}>
                  $0 <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '400' }}>/ forever</span>
                </div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '13px', color: '#a1a1aa', lineHeight: '2' }}>
                  <li>✓ 1 Ticker Watchlist</li>
                  <li>✓ 5 SEC Alerts / Month</li>
                  <li>✓ Standard Slack Bot Install</li>
                  <li>✓ Basic Filing Summaries</li>
                </ul>
              </div>
              <a href="https://hooks.slack.com" target="_blank" rel="noreferrer" style={{ marginTop: '28px', backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#ffffff', textAlign: 'center', padding: '10px 0', borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', display: 'block' }}>
                Install Free Slack Bot
              </a>
            </div>

            {/* Tier 2: Starter Plan ($49/mo) */}
            <div style={{ backgroundColor: '#09090b', border: '2px solid #38bdf8', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#38bdf8', color: '#09090b', fontSize: '10px', fontWeight: '900', padding: '2px 10px', borderRadius: '12px', letterSpacing: '0.05em' }}>
                SELF-SERVE WEDGE (&lt;$50 EXPENSE LIMIT)
              </span>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>Analyst Starter</div>
                <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px' }}>Real-time alerts for solo sales reps &amp; consultants.</div>
                <div style={{ fontSize: '38px', fontWeight: '900', color: '#ffffff', margin: '20px 0 16px' }}>
                  ${isAnnual ? '39' : '49'} <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '400' }}>/ month</span>
                </div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '13px', color: '#f4f4f5', lineHeight: '2' }}>
                  <li>✓ Unlimited Watchlist Tickers</li>
                  <li style={{ color: '#4ade80', fontWeight: '700' }}>✓ Real-Time Email &amp; Web Push Alerts</li>
                  <li>✓ Full Executive Materiality Summaries</li>
                  <li>✓ Verified LinkedIn CISO Search Links</li>
                  <li style={{ color: '#38bdf8', fontWeight: '700' }}>✓ 14-Day Free Trial</li>
                </ul>
              </div>
              <a href="/feed" style={{ marginTop: '28px', backgroundColor: '#38bdf8', color: '#09090b', textAlign: 'center', padding: '12px 0', borderRadius: '6px', fontSize: '13px', fontWeight: '900', textDecoration: 'none', display: 'block' }}>
                Start 14-Day Free Trial →
              </a>
            </div>

            {/* Tier 3: Institutional Analyst ($299/mo) */}
            <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>Institutional Analyst</div>
                <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px' }}>For Incident Response firms &amp; MSSP teams.</div>
                <div style={{ fontSize: '38px', fontWeight: '900', color: '#ffffff', margin: '20px 0 16px' }}>
                  ${isAnnual ? '239' : '299'} <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '400' }}>/ month</span>
                </div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '13px', color: '#a1a1aa', lineHeight: '2' }}>
                  <li style={{ color: '#4ade80', fontWeight: '700' }}>✓ Sub-Second Ingestion Speed SLA</li>
                  <li>✓ Interactive Slack Block Kit Dispatch</li>
                  <li>✓ 3 AI Outbound Pitch Playbooks</li>
                  <li>✓ Verified CISO / Legal Contact Pathways</li>
                  <li>✓ 5 Workspace User Licenses</li>
                </ul>
              </div>
              <a href="/feed" style={{ marginTop: '28px', backgroundColor: '#ffffff', color: '#09090b', textAlign: 'center', padding: '12px 0', borderRadius: '6px', fontSize: '13px', fontWeight: '800', textDecoration: 'none', display: 'block' }}>
                Get Institutional Plan →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Notion Minimalist Footer */}
      <footer style={{ backgroundColor: '#09090b', padding: '40px 24px', borderTop: '1px solid #27272a', fontSize: '13px', color: '#71717a' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '15px', marginBottom: '4px' }}>Watchpost HQ</div>
            <div>Sub-Second SEC EDGAR Item 1.05 &amp; 5.02 Regulatory Radar.</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#4ade80' }}>SEC EDGAR Stream 100% Operational (0.42s SLA)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
