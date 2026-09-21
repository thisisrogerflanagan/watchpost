'use client';

import React from 'react';
import posthog from 'posthog-js';
import { FilingRecord } from '../lib/filingRepository';

interface SignalCardProps {
  filing: FilingRecord;
  isDarkMode?: boolean;
}

export const SignalCard: React.FC<SignalCardProps> = ({ filing, isDarkMode = false }) => {
  const is105 = filing.item_105_flag;
  const ticker = filing.companies?.ticker ? filing.companies.ticker.toUpperCase() : `CIK:${filing.cik}`;
  const companyName = filing.companies?.company_name || filing.title;

  const cardBg = isDarkMode ? '#18181b' : '#ffffff';
  const borderColor = isDarkMode ? '#27272a' : '#e2e8f0';
  const textColor = isDarkMode ? '#f4f4f5' : '#0f172a';
  const subtextColor = isDarkMode ? '#a1a1aa' : '#64748b';
  const quoteBg = isDarkMode ? '#09090b' : '#f8fafc';
  const quoteBorder = is105 ? '#ef4444' : '#3b82f6';
  const badgeBg = is105 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)';
  const badgeText = is105 ? '#ef4444' : '#2563eb';

  const avatarInitial = ticker.charAt(0);
  const avatarBg = is105 ? '#dc2626' : '#2563eb';

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      if (diffMinutes < 60) return `${Math.max(1, diffMinutes)}m`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h`;
      return `${Math.floor(diffHours / 24)}d`;
    } catch {
      return 'recent';
    }
  };

  const handleSecClick = () => {
    posthog.capture('sec_file_opened', { ticker, url: filing.raw_html_url });
  };

  return (
    <article style={{
      backgroundColor: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      transition: 'box-shadow 0.2s ease, transform 0.1s ease',
      boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      {/* Author / Company Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar Icon */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: avatarBg,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '16px',
            flexShrink: 0
          }}>
            {avatarInitial}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '700', fontSize: '15px', color: textColor }}>{companyName}</span>
              <span style={{ fontSize: '13px', color: subtextColor, fontFamily: 'monospace' }}>@${ticker}</span>
            </div>
            <div style={{ fontSize: '12px', color: subtextColor, marginTop: '2px' }}>
              SEC EDGAR Filer • CIK:{filing.cik}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <span style={{ fontSize: '12px', color: subtextColor, fontWeight: '600' }}>
          {formatTimeAgo(filing.filing_date)}
        </span>
      </div>

      {/* Signal Type Badge */}
      <div style={{ marginBottom: '12px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: badgeBg,
          color: badgeText,
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.03em',
          textTransform: 'uppercase'
        }}>
          {is105 ? '🚨 ITEM 1.05: MATERIAL CYBERSECURITY INCIDENT' : '👔 ITEM 5.02: C-SUITE EXECUTIVE TRANSITION'}
        </span>
      </div>

      {/* Extracted Narrative Quote Box */}
      <div style={{
        backgroundColor: quoteBg,
        borderLeft: `4px solid ${quoteBorder}`,
        borderRadius: '0 8px 8px 0',
        padding: '12px 16px',
        fontSize: '13.5px',
        lineHeight: '1.6',
        color: textColor,
        marginBottom: '16px'
      }}>
        {filing.summary_text}
      </div>

      {/* Action Footer Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px solid ${borderColor}` }}>
        <a 
          href={`/sec/company/${ticker.toLowerCase()}`}
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#2563eb',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          View Signal Hub →
        </a>

        <a 
          href={filing.raw_html_url} 
          target="_blank" 
          rel="noreferrer"
          onClick={handleSecClick}
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: subtextColor,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: isDarkMode ? '#27272a' : '#f1f5f9',
            padding: '4px 10px',
            borderRadius: '6px'
          }}
        >
          📄 Raw SEC 8-K ↗
        </a>
      </div>
    </article>
  );
};
