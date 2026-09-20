import React from 'react';

const SAMPLE_SIGNALS = [
  {
    ticker: 'CRWD',
    company: 'CrowdStrike Holdings, Inc.',
    itemType: 'Item 1.05',
    title: 'Material Cybersecurity Incident',
    time: '14 minutes ago',
    summary: 'Identified unauthorized activity in a secondary cloud testing environment. Materiality determined on Sept 20. Containment completed.',
  },
  {
    ticker: 'MSFT',
    company: 'Microsoft Corporation',
    itemType: 'Item 5.02',
    title: 'C-Suite Executive Transition',
    time: '42 minutes ago',
    summary: 'Appointed new Chief Information Security Officer (CISO) effective September 20, 2026.',
  },
  {
    ticker: 'OKTA',
    company: 'Okta, Inc.',
    itemType: 'Item 1.05',
    title: 'Material Cybersecurity Incident',
    time: '2 hours ago',
    summary: 'Disclosed credential spray incident impacting an isolated tenant environment. Remediation dispatched.',
  },
  {
    ticker: 'PANW',
    company: 'Palo Alto Networks, Inc.',
    itemType: 'Item 5.02',
    title: 'C-Suite Executive Transition',
    time: '5 hours ago',
    summary: 'Announced retirement of Vice President & Chief Information Officer. Executive search initiated.',
  }
];

export default function WatchpostLandingPage() {
  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header Navigation */}
      <header style={{ borderBottom: '1px solid #27272a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ backgroundColor: '#dc2626', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>WATCHPOST HQ</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Watchpost HQ</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/feed" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>Live Radar Feed</a>
          <a href="#pricing" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>Pricing</a>
          <a href="/feed" style={{ backgroundColor: '#ffffff', color: '#000000', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
            Start 7-Day Trial
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#a1a1aa', marginBottom: '24px' }}>
          🛡️ Watchpost HQ: Real-Time SEC 8-K Regulatory & Breach Intelligence
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          Real-Time SEC Cyber Breaches & Executive Shifts <span style={{ color: '#ef4444' }}>Delivered to Slack</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#a1a1aa', maxWidth: '750px', margin: '0 auto 32px', lineHeight: '1.6' }}>
          Watchpost HQ monitors SEC EDGAR 24/7 for <strong>Item 1.05 Material Cybersecurity Incidents</strong> and <strong>Item 5.02 C-Suite Transitions</strong>, sending instant Slack, Email, and Webhook alerts to Incident Response teams and sales leaders.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="/feed" style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontWeight: '600', fontSize: '16px', textDecoration: 'none' }}>
            Get Instant Slack Alerts ($199/mo)
          </a>
          <a href="#feed-preview" style={{ backgroundColor: '#27272a', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontWeight: '600', fontSize: '16px', textDecoration: 'none' }}>
            View Live Signal Radar ↓
          </a>
        </div>
      </section>

      {/* Live Signal Feed Social Proof Section */}
      <section id="feed-preview" style={{ maxWidth: '900px', margin: '40px auto 80px', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #27272a', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
              <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Watchpost HQ Live Regulatory Stream</h2>
            </div>
            <span style={{ fontSize: '12px', color: '#a1a1aa' }}>SEC EDGAR 24/7 Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SAMPLE_SIGNALS.map((sig, idx) => (
              <div key={idx} style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#3b82f6' }}>${sig.ticker}</span>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{sig.company}</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: sig.itemType === 'Item 1.05' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(37, 99, 235, 0.2)', color: sig.itemType === 'Item 1.05' ? '#ef4444' : '#3b82f6' }}>
                      {sig.itemType}: {sig.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#71717a' }}>{sig.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa', lineHeight: '1.5' }}>
                  {sig.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ maxWidth: '900px', margin: '0 auto 80px', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Transparent, High-ROI Pricing</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '40px' }}>Winning a single Incident Response engagement pays for years of subscription.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Pro Tier */}
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '32px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Pro Analyst</h3>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>$199 <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 'normal' }}>/ month</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', fontSize: '14px', color: '#d4d4d8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>✓ Instant Slack Channel Webhook Alerts</li>
              <li>✓ Real-Time Email Alerts (Resend)</li>
              <li>✓ Item 1.05 (Cyber Breaches) & Item 5.02 (C-Suite)</li>
              <li>✓ Watchpost Web Dashboard Access</li>
            </ul>
            <a href="/feed" style={{ display: 'block', textAlign: 'center', backgroundColor: '#ffffff', color: '#000000', padding: '12px', borderRadius: '6px', fontWeight: '600', textDecoration: 'none' }}>
              Start 7-Day Trial
            </a>
          </div>

          {/* Enterprise Tier */}
          <div style={{ backgroundColor: '#18181b', border: '2px solid #dc2626', borderRadius: '12px', padding: '32px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Enterprise Team</h3>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>$349 <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 'normal' }}>/ month</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', fontSize: '14px', color: '#d4d4d8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>✓ Everything in Pro Analyst</li>
              <li>✓ Custom JSON REST API Webhooks</li>
              <li>✓ Salesforce / HubSpot CRM Sync</li>
              <li>✓ 5 Team Member Seats</li>
              <li>✓ SMS On-Call Alert Triggers</li>
            </ul>
            <a href="/feed" style={{ display: 'block', textAlign: 'center', backgroundColor: '#dc2626', color: '#ffffff', padding: '12px', borderRadius: '6px', fontWeight: '600', textDecoration: 'none' }}>
              Start Enterprise Trial
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #27272a', padding: '32px', textAlign: 'center', fontSize: '12px', color: '#71717a' }}>
        <p style={{ margin: '0 0 8px' }}>Watchpost HQ is a public regulatory data notification service and does not provide legal, financial, or investment advice. All signals are sourced directly from public SEC EDGAR filings.</p>
        <p style={{ margin: 0 }}>© 2026 Watchpost HQ (watchposthq.com). All rights reserved.</p>
      </footer>
    </div>
  );
}
