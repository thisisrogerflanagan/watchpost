'use client';

import React, { useEffect, useState } from 'react';
import { getLatestFilings, FilingRecord } from '../../lib/filingRepository';

export default function SignalFeedDashboard() {
  const [filings, setFilings] = useState<FilingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    async function fetchLiveFilings() {
      try {
        setLoading(true);
        const data = await getLatestFilings(50);
        setFilings(data);
      } catch (err) {
        console.error('Failed to fetch live filings from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveFilings();
  }, []);

  const filteredFilings = filings.filter(f => {
    const matchesSearch = search === '' || 
      (f.title && f.title.toLowerCase().includes(search.toLowerCase())) ||
      (f.summary_text && f.summary_text.toLowerCase().includes(search.toLowerCase()));
    
    const matchesType = filterType === 'all' ||
      (filterType === '1.05' && f.item_105_flag) ||
      (filterType === '5.02' && f.item_502_flag);

    return matchesSearch && matchesType;
  });

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* App Navigation */}
      <header style={{ borderBottom: '1px solid #27272a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#dc2626', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>WATCHPOST HQ</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Watchpost HQ Radar</span>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticker or company..." 
              style={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '14px', width: '220px' }}
            />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '14px' }}
            >
              <option value="all">All Item Types</option>
              <option value="1.05">Item 1.05 (Cyber Breaches Only)</option>
              <option value="5.02">Item 5.02 (C-Suite Shifts Only)</option>
            </select>
          </div>
        </div>

        {/* Signals Table */}
        <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>Connecting to Supabase live database...</div>
          ) : filteredFilings.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>
              No filings match your current filter. New SEC EDGAR filings will appear here automatically.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272a', backgroundColor: '#09090b', color: '#a1a1aa', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Filing Time</th>
                  <th style={{ padding: '12px 16px' }}>Ticker / CIK</th>
                  <th style={{ padding: '12px 16px' }}>Company Title</th>
                  <th style={{ padding: '12px 16px' }}>Signal Type</th>
                  <th style={{ padding: '12px 16px' }}>Extracted Narrative Summary</th>
                  <th style={{ padding: '12px 16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFilings.map((filing) => (
                  <tr key={filing.id} style={{ borderBottom: '1px solid #27272a' }}>
                    <td style={{ padding: '16px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>
                      {new Date(filing.filing_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: filing.item_105_flag ? '#ef4444' : '#3b82f6' }}>
                      {filing.companies?.ticker ? `$${filing.companies.ticker}` : `CIK:${filing.cik}`}
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>
                      {filing.companies?.company_name || filing.title}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        backgroundColor: filing.item_105_flag ? 'rgba(220, 38, 38, 0.2)' : 'rgba(37, 99, 235, 0.2)', 
                        color: filing.item_105_flag ? '#ef4444' : '#3b82f6', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '700' 
                      }}>
                        {filing.item_105_flag ? 'ITEM 1.05 BREACH' : 'ITEM 5.02 SHIFT'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#d4d4d8', maxWidth: '350px' }}>
                      {filing.summary_text}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <a href={filing.raw_html_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '12px' }}>
                        SEC File ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
