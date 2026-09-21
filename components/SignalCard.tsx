'use client';

import React from 'react';
import posthog from 'posthog-js';
import { CompanyAvatar } from './CompanyAvatar';
import { FilingRecord } from '../lib/filingRepository';

interface SignalCardProps {
  filing: FilingRecord;
  isDarkMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

function cleanSummaryText(rawText: string): string {
  if (!rawText) return '';
  let text = rawText
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  text = text.replace(/<b>Filed:<\/b>.*?<b>Size:<\/b>.*?(?:<br\s*\/?>|$)/gi, '');
  text = text.replace(/Filed:.*?AccNo:.*?Size:.*?(?:<br\s*\/?>|$)/gi, '');
  text = text.replace(/<br\s*\/?>/gi, ' ').replace(/<\/?[^>]+(>|$)/g, ' ');
  return text.replace(/\s+/g, ' ').trim();
}

export const SignalCard: React.FC<SignalCardProps> = ({
  filing,
  isDarkMode = false,
  isSelected = false,
  onSelect
}) => {
  const is105 = filing.item_105_flag;
  const ticker = filing.companies?.ticker ? filing.companies.ticker.toUpperCase() : `CIK:${filing.cik}`;
  const companyName = filing.companies?.company_name || filing.title;

  const cardBg = isSelected
    ? (isDarkMode ? '#27272a' : '#f1f5f9')
    : (isDarkMode ? '#18181b' : '#ffffff');
  const borderColor = isSelected
    ? '#dc2626'
    : (isDarkMode ? '#27272a' : '#e2e8f0');
  const textColor = isDarkMode ? '#f4f4f5' : '#0f172a';
  const subtextColor = isDarkMode ? '#a1a1aa' : '#64748b';
  const quoteBg = isDarkMode ? '#09090b' : '#ffffff';
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

  const handleSecClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    posthog.capture('sec_file_opened', { ticker, url: filing.raw_html_url });
  };

  const formattedSummary = cleanSummaryText(filing.summary_text);

  return (
    <article
      onClick={onSelect}
      style={{
        backgroundColor: cardBg,
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '18px',
        marginBottom: '14px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isSelected
          ? '0 4px 12px rgba(220, 38, 38, 0.15)'
          : (isDarkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)')
      }}
    >
      {/* Author / Company Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar Icon */}
          <CompanyAvatar
            ticker={filing.companies?.ticker}
            companyName={companyName}
            size={38}
            is105={!!is105}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '700', fontSize: '14.5px', color: textColor }}>{companyName}</span>
              <span style={{ fontSize: '12.5px', color: subtextColor, fontFamily: 'monospace' }}>@${ticker}</span>
            </div>
            <div style={{ fontSize: '11.5px', color: subtextColor, marginTop: '2px' }}>
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
      <div style={{ marginBottom: '10px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: badgeBg,
          color: badgeText,
          padding: '3px 8px',
          borderRadius: '6px',
          fontSize: '10.5px',
          fontWeight: '700',
          letterSpacing: '0.03em',
          textTransform: 'uppercase'
        }}>
          {is105 ? 'SEC ITEM 1.05: MATERIAL CYBERSECURITY DISCLOSURE' : 'SEC ITEM 5.02: EXECUTIVE LEADERSHIP TRANSITION'}
        </span>
      </div>

      {/* Extracted Narrative Quote Box */}
      <div style={{
        backgroundColor: quoteBg,
        borderLeft: `3.5px solid ${quoteBorder}`,
        borderRadius: '0 8px 8px 0',
        padding: '10px 14px',
        fontSize: '13px',
        lineHeight: '1.5',
        color: textColor,
        marginBottom: '14px'
      }}>
        {formattedSummary}
      </div>

      {/* Action Footer Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px solid ${borderColor}` }}>
        <span style={{
          fontSize: '12px',
          fontWeight: '700',
          color: isSelected ? '#dc2626' : '#2563eb',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {isSelected ? '✓ Inspecting Action Center →' : 'Inspect Action Center →'}
        </span>

        <a 
          href={filing.raw_html_url} 
          target="_blank" 
          rel="noreferrer"
          onClick={handleSecClick}
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: subtextColor,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: isDarkMode ? '#27272a' : '#f1f5f9',
            padding: '3px 8px',
            borderRadius: '6px'
          }}
        >
          📄 Raw SEC 8-K ↗
        </a>
      </div>
    </article>
  );
};
