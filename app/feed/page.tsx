import React from 'react';

export default function SignalFeedDashboard() {
  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* App Navigation */}
      <header style={{ borderBottom: '1px solid #27272a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#dc2626', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>SEC 8-K</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>CyberSec-8K Radar</span>
          </a>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            🟢 Engine Active (Polling SEC EDGAR)
          </span>
          <button style={{ backgroundColor: '#27272a', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
            ⚙️ Webhook Settings
          </button>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 24px' }}>
        {/* Controls & Search Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px' }}>Live SEC 8-K Regulatory Radar</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>Monitoring Item 1.05 (Material Breaches) and Item 5.02 (Executive Shifts)</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Search ticker or company..." 
              style={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '14px', width: '220px' }}
            />
            <select style={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '14px' }}>
              <option value="all">All Item Types</option>
              <option value="1.05">Item 1.05 (Cyber Breaches Only)</option>
              <option value="5.02">Item 5.02 (C-Suite Shifts Only)</option>
            </select>
          </div>
        </div>

        {/* Signals Table */}
        <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #27272a', backgroundColor: '#09090b', color: '#a1a1aa', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Filing Time</th>
                <th style={{ padding: '12px 16px' }}>Ticker</th>
                <th style={{ padding: '12px 16px' }}>Company Name</th>
                <th style={{ padding: '12px 16px' }}>Signal Type</th>
                <th style={{ padding: '12px 16px' }}>Extracted Narrative Summary</th>
                <th style={{ padding: '12px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #27272a' }}>
                <td style={{ padding: '16px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>14m ago</td>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#ef4444' }}>$CRWD</td>
                <td style={{ padding: '16px', fontWeight: '600' }}>CrowdStrike Holdings, Inc.</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                    ITEM 1.05 BREACH
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#d4d4d8', maxWidth: '350px' }}>
                  Identified unauthorized activity in a secondary cloud testing environment. Materiality determined Sept 20. Containment completed.
                </td>
                <td style={{ padding: '16px' }}>
                  <a href="https://sec.gov" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '12px' }}>SEC File ↗</a>
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid #27272a' }}>
                <td style={{ padding: '16px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>42m ago</td>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#3b82f6' }}>$MSFT</td>
                <td style={{ padding: '16px', fontWeight: '600' }}>Microsoft Corporation</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#3b82f6', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                    ITEM 5.02 SHIFT
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#d4d4d8', maxWidth: '350px' }}>
                  Appointed new Chief Information Security Officer (CISO) effective September 20, 2026.
                </td>
                <td style={{ padding: '16px' }}>
                  <a href="https://sec.gov" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '12px' }}>SEC File ↗</a>
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid #27272a' }}>
                <td style={{ padding: '16px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>2h ago</td>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#ef4444' }}>$OKTA</td>
                <td style={{ padding: '16px', fontWeight: '600' }}>Okta, Inc.</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                    ITEM 1.05 BREACH
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#d4d4d8', maxWidth: '350px' }}>
                  Disclosed credential spray incident impacting an isolated tenant environment. Remediation dispatched.
                </td>
                <td style={{ padding: '16px' }}>
                  <a href="https://sec.gov" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '12px' }}>SEC File ↗</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
