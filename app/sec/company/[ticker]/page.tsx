import React from 'react';

type Props = {
  params: Promise<{ ticker: string }>;
};

export default async function CompanyTickerPSEOPage({ params }: Props) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #27272a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ backgroundColor: '#dc2626', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>SEC 8-K</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>CyberSec-8K Radar</span>
        </a>
        <a href="/feed" style={{ backgroundColor: '#ffffff', color: '#000000', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
          Subscribe to ${symbol} Alerts
        </a>
      </header>

      <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>${symbol} SEC 8-K Signal Hub</h1>
          <span style={{ backgroundColor: '#27272a', color: '#a1a1aa', padding: '4px 12px', borderRadius: '16px', fontSize: '13px' }}>
            pSEO Tracked Ticker
          </span>
        </div>

        <p style={{ color: '#a1a1aa', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
          Live regulatory filing history and real-time alerts for <strong>${symbol}</strong> covering <strong>SEC 8-K Item 1.05 (Material Cybersecurity Incidents)</strong> and <strong>Item 5.02 (C-Suite Leadership Shifts)</strong>.
        </p>

        <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Automated SEC Filing Audit Log for ${symbol}</h2>
          
          <div style={{ borderLeft: '2px solid #ef4444', paddingLeft: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Sept 20, 2026 - 14:15 EST</div>
            <div style={{ fontWeight: 'bold', color: '#ef4444', margin: '4px 0' }}>Item 1.05: Material Cybersecurity Incident Disclosed</div>
            <p style={{ margin: 0, fontSize: '13px', color: '#d4d4d8' }}>
              ${symbol} filed an SEC Form 8-K disclosing unauthorized activity detected in their secondary cloud testing environment. Containment completed.
            </p>
          </div>

          <div style={{ borderLeft: '2px solid #3b82f6', paddingLeft: '16px' }}>
            <div style={{ fontSize: '12px', color: '#a1a1aa' }}>August 14, 2026 - 09:30 EST</div>
            <div style={{ fontWeight: 'bold', color: '#3b82f6', margin: '4px 0' }}>Item 5.02: C-Suite Executive Transition</div>
            <p style={{ margin: 0, fontSize: '13px', color: '#d4d4d8' }}>
              ${symbol} announced the appointment of a new Chief Information Security Officer (CISO) in an 8-K Item 5.02 filing.
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: '#09090b', border: '1px solid #dc2626', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Get Real-Time Slack Webhook Alerts for ${symbol}</h3>
          <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '20px' }}>
            Never miss an SEC cybersecurity breach or CISO change for ${symbol}. Alerts arrive in Slack within 30 seconds of filing.
          </p>
          <a href="/feed" style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '10px 24px', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', fontSize: '14px', display: 'inline-block' }}>
            Get Slack Alerts for ${symbol}
          </a>
        </div>
      </main>
    </div>
  );
}
