'use client';

import React, { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { FilingRecord } from '../lib/filingRepository';
import { SignalCard } from './SignalCard';
import { SignalActionCenter } from './SignalActionCenter';
import { NotificationAuditFeed } from './NotificationAuditFeed';
import { FilingAnalyticsCard } from './FilingAnalyticsCard';
import { useAuth } from '../lib/useAuth';

interface IvoryLayoutProps {
  filings: FilingRecord[];
  loading: boolean;
}

export const IvoryLayout: React.FC<IvoryLayoutProps> = ({ filings, loading }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedFilingId, setSelectedFilingId] = useState<string | null>(null);

  // Colors based on theme
  const pageBg = isDarkMode ? '#09090b' : '#f8fafc';
  const railBg = isDarkMode ? '#18181b' : '#f1f5f9';
  const columnBg = isDarkMode ? '#09090b' : '#ffffff';
  const headerBg = isDarkMode ? '#18181b' : '#ffffff';
  const borderColor = isDarkMode ? '#27272a' : '#e2e8f0';
  const textColor = isDarkMode ? '#f4f4f5' : '#0f172a';
  const subtextColor = isDarkMode ? '#a1a1aa' : '#64748b';
  const activeRailItemBg = isDarkMode ? '#27272a' : '#e2e8f0';

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    posthog.capture('feed_filter_changed', { filter_type: type });
  };

  const filteredFilings = filings.filter(f => {
    const matchesSearch = search === '' ||
      (f.title && f.title.toLowerCase().includes(search.toLowerCase())) ||
      (f.summary_text && f.summary_text.toLowerCase().includes(search.toLowerCase())) ||
      (f.companies?.ticker && f.companies.ticker.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === 'all' ||
      (filterType === '1.05' && f.item_105_flag) ||
      (filterType === '5.02' && f.item_502_flag);

    return matchesSearch && matchesType;
  });

  // Auto-select first filing when list loads
  useEffect(() => {
    if (filteredFilings.length > 0 && !selectedFilingId) {
      setSelectedFilingId(filteredFilings[0].id);
    }
  }, [filteredFilings, selectedFilingId]);

  const selectedFiling = filteredFilings.find(f => f.id === selectedFilingId) || (filteredFilings.length > 0 ? filteredFilings[0] : null);

  // Keyboard navigation (j/k for signals, o for open SEC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (filteredFilings.length === 0) return;

      const currentIndex = filteredFilings.findIndex(f => f.id === selectedFilingId);

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(filteredFilings.length - 1, currentIndex + 1);
        setSelectedFilingId(filteredFilings[nextIndex].id);
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        setSelectedFilingId(filteredFilings[prevIndex].id);
      } else if (e.key === 'o' && selectedFiling) {
        e.preventDefault();
        window.open(selectedFiling.raw_html_url, '_blank');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredFilings, selectedFilingId, selectedFiling]);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: pageBg,
      color: textColor,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      {/* 1. Left Compact Vertical Navigation Rail */}
      <aside style={{
        width: '64px',
        backgroundColor: railBg,
        borderRight: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        flexShrink: 0
      }}>
        {/* Top Brand Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '16px',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)'
            }}>
              W
            </div>
          </a>

          {/* Navigation Icons */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setActiveTab('feed')}
              title="Signals Feed (j/k)"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'feed' ? activeRailItemBg : 'transparent',
                color: activeTab === 'feed' ? textColor : subtextColor,
                cursor: 'pointer',
                fontSize: '18px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              🏠
              {activeTab === 'feed' && (
                <span style={{
                  position: 'absolute',
                  right: '-2px',
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#dc2626',
                  borderRadius: '2px'
                }} />
              )}
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              title="Ticker Watchlist"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'watchlist' ? activeRailItemBg : 'transparent',
                color: activeTab === 'watchlist' ? textColor : subtextColor,
                cursor: 'pointer',
                fontSize: '18px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              📡
            </button>

            <button
              onClick={() => setActiveTab('webhooks')}
              title="Alert Settings"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'webhooks' ? activeRailItemBg : 'transparent',
                color: activeTab === 'webhooks' ? textColor : subtextColor,
                cursor: 'pointer',
                fontSize: '18px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ⚙️
            </button>
          </nav>
        </div>

        {/* Bottom Theme Toggle & Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Light/Dark Theme"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: `1px solid ${borderColor}`,
              backgroundColor: isDarkMode ? '#27272a' : '#ffffff',
              color: textColor,
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </aside>

      {/* 2. Column 1: Live SEC 8-K Feed Pane */}
      <section style={{
        flex: '1.2',
        backgroundColor: columnBg,
        borderRight: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Column 1 Header */}
        <header style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${borderColor}`,
          backgroundColor: headerBg,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: textColor }}>
                Watchpost HQ Signals Feed
              </h1>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                LIVE 8-K
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isLoggedIn && user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: isDarkMode ? '#18181b' : '#f1f5f9', border: `1px solid ${borderColor}`, padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                  <span style={{ fontWeight: '700', color: textColor }}>{user.workspaceName}</span>
                  <span style={{ color: subtextColor }}>({user.userEmail})</span>
                  <button
                    onClick={logout}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '11px', cursor: 'pointer', paddingLeft: '4px' }}
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <a
                  href="/"
                  style={{ color: subtextColor, fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}
                >
                  ← Home
                </a>
              )}

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticker or company..."
                style={{
                  backgroundColor: isDarkMode ? '#18181b' : '#f1f5f9',
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  width: '180px'
                }}
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'all', label: 'All Signals' },
              { id: '1.05', label: '🚨 Item 1.05 Breaches' },
              { id: '5.02', label: '👔 Item 5.02 Shifts' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  border: `1px solid ${filterType === filter.id ? '#dc2626' : borderColor}`,
                  backgroundColor: filterType === filter.id ? (isDarkMode ? '#dc2626' : '#fee2e2') : (isDarkMode ? '#18181b' : '#f8fafc'),
                  color: filterType === filter.id ? (isDarkMode ? '#ffffff' : '#dc2626') : subtextColor,
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </header>

        {/* Feed Cards Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: subtextColor }}>
              Connecting to live database stream...
            </div>
          ) : filteredFilings.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: subtextColor }}>
              No SEC filings match your search filter. Monitoring SEC EDGAR 24/7.
            </div>
          ) : (
            filteredFilings.map((filing) => (
              <SignalCard
                key={filing.id}
                filing={filing}
                isDarkMode={isDarkMode}
                isSelected={selectedFiling?.id === filing.id}
                onSelect={() => setSelectedFilingId(filing.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* 3. Column 2: Signal Intelligence & Outbound Action Center */}
      <section style={{
        flex: '1.3',
        backgroundColor: pageBg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Column 2 Header */}
        <header style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${borderColor}`,
          backgroundColor: headerBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: textColor }}>
              Signal Intelligence &amp; Action Center
            </h2>
            <span style={{ fontSize: '11px', color: subtextColor, backgroundColor: isDarkMode ? '#27272a' : '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
              Keyboard Shortcuts (j/k, c, s, e, o)
            </span>
          </div>

          <a
            href="#pricing"
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Upgrade Plan
          </a>
        </header>

        {/* Action Center & Analytics Body Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Action Center */}
          <SignalActionCenter filing={selectedFiling} isDarkMode={isDarkMode} />

          {/* Medium-Style Analytics Card */}
          <FilingAnalyticsCard filings={filings} isDarkMode={isDarkMode} />

          {/* Live Delivery Audit Log */}
          <NotificationAuditFeed isDarkMode={isDarkMode} />
        </div>
      </section>
    </div>
  );
};
