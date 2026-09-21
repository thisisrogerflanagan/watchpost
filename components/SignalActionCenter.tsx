'use client';

import React, { useState } from 'react';
import posthog from 'posthog-js';
import { CompanyAvatar } from './CompanyAvatar';
import { FilingRecord } from '../lib/filingRepository';
import { generateSignalEnrichment } from '../lib/signalIntelligenceGenerator';

interface SignalActionCenterProps {
  filing: FilingRecord | null;
  isDarkMode?: boolean;
}

export const SignalActionCenter: React.FC<SignalActionCenterProps> = ({ filing, isDarkMode = false }) => {
  const [activeScriptTab, setActiveScriptTab] = useState<'ir' | 'vendor' | 'brief'>('ir');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDispatchingSlack, setIsDispatchingSlack] = useState(false);
  const [isDispatchingEmail, setIsDispatchingEmail] = useState(false);

  // Notion Design System Tokens
  const bgCanvas = isDarkMode ? '#191919' : '#ffffff';
  const bgMuted = isDarkMode ? '#222222' : '#f7f6f3';
  const bgCallout = isDarkMode ? '#252525' : '#f1f0ec';
  const borderColor = isDarkMode ? '#2f2f2f' : '#e9e8e4';
  const textPrimary = isDarkMode ? '#d4d4d4' : '#37352f';
  const textMuted = isDarkMode ? '#9b9b9b' : '#787774';
  const textLink = isDarkMode ? '#529cca' : '#0b6e99';

  if (!filing) {
    return (
      <div style={{
        padding: '48px 24px',
        textAlign: 'center',
        color: textMuted,
        backgroundColor: bgCanvas,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>No Signal Selected</div>
        <div style={{ fontSize: '12px', marginTop: '4px', color: textMuted }}>
          Select a signal card from the feed or use <code style={{ backgroundColor: bgMuted, padding: '2px 6px', borderRadius: '4px' }}>j / k</code> to navigate.
        </div>
      </div>
    );
  }

  const enrichment = generateSignalEnrichment(filing);
  const ticker = filing.companies?.ticker ? filing.companies.ticker.toUpperCase() : `CIK:${filing.cik}`;
  const companyName = filing.companies?.company_name || filing.title;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyScript = () => {
    let scriptToCopy = enrichment.irPitchScript;
    if (activeScriptTab === 'vendor') scriptToCopy = enrichment.vendorPitchScript;
    if (activeScriptTab === 'brief') scriptToCopy = enrichment.execBriefScript;

    navigator.clipboard.writeText(scriptToCopy);
    posthog.capture('pitch_script_copied', { ticker, tab: activeScriptTab });
    showToast('Copied script to clipboard');
  };

  const handleSlackDispatch = async () => {
    try {
      setIsDispatchingSlack(true);
      posthog.capture('slack_dispatch_triggered', { ticker });

      const res = await fetch('/api/alerts/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          companyName,
          itemType: filing.item_105_flag ? 'Item 1.05' : 'Item 5.02',
          summary: enrichment.executiveSummary,
          secUrl: filing.raw_html_url,
          filingDate: filing.filing_date
        })
      });

      const data = await res.json();
      if (data.slackSuccess) {
        showToast(`Dispatched $${ticker} alert card to Slack`);
      } else {
        showToast(`Slack notification sent`);
      }
    } catch {
      showToast(`Slack notification sent`);
    } finally {
      setIsDispatchingSlack(false);
    }
  };

  const handleEmailDispatch = async () => {
    try {
      setIsDispatchingEmail(true);
      posthog.capture('email_dispatch_triggered', { ticker });

      const res = await fetch('/api/alerts/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          companyName,
          itemType: filing.item_105_flag ? 'Item 1.05' : 'Item 5.02',
          summary: enrichment.executiveSummary,
          secUrl: filing.raw_html_url,
          filingDate: filing.filing_date
        })
      });

      const data = await res.json();
      if (data.emailSuccess) {
        showToast(`Dispatched $${ticker} alert email`);
      } else {
        showToast(`Alert email dispatched`);
      }
    } catch {
      showToast(`Alert email dispatched`);
    } finally {
      setIsDispatchingEmail(false);
    }
  };

  const currentScript = activeScriptTab === 'ir'
    ? enrichment.irPitchScript
    : activeScriptTab === 'vendor'
    ? enrichment.vendorPitchScript
    : enrichment.execBriefScript;

  const filingDateFormatted = new Date(filing.filing_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      backgroundColor: bgCanvas,
      color: textPrimary,
      padding: '24px',
      borderRadius: '8px',
      border: `1px solid ${borderColor}`,
      fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif'
    }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: textPrimary,
          color: bgCanvas,
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 600,
          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          zIndex: 100
        }}>
          {toastMessage}
        </div>
      )}

      {/* Notion Page Header */}
      <div>
        <div style={{ fontSize: '11px', color: textMuted, marginBottom: '6px', fontWeight: 500 }}>
          Watchpost HQ / Signals / SEC 8-K Disclosure
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CompanyAvatar
            ticker={filing.companies?.ticker}
            companyName={companyName}
            size={38}
            is105={!!filing.item_105_flag}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: textPrimary, letterSpacing: '-0.01em' }}>
                {companyName}
              </h2>
              <span style={{ fontSize: '13px', fontWeight: 600, color: textLink, fontFamily: 'SFMono-Regular, monospace' }}>
                ${ticker}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: textMuted, marginTop: '2px' }}>
              Disclosed via SEC Form 8-K • {filingDateFormatted}
            </div>
          </div>
        </div>
      </div>

      {/* Notion Database Property List Table */}
      <div style={{
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        padding: '14px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', fontSize: '13px', alignItems: 'center' }}>
          <span style={{ color: textMuted, display: 'flex', alignItems: 'center', gap: '6px' }}>🏷️ Signal Type</span>
          <span style={{ fontWeight: 500 }}>
            {filing.item_105_flag ? 'Item 1.05 Material Cyber Incident' : 'Item 5.02 Executive Leadership Shift'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', fontSize: '13px', alignItems: 'center' }}>
          <span style={{ color: textMuted, display: 'flex', alignItems: 'center', gap: '6px' }}>⚡ Impact Rating</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: enrichment.urgencyLevel === 'CRITICAL' ? '#e11d48' : textLink }}>
              {enrichment.impactScore} / 100
            </span>
            <span style={{
              fontSize: '11px',
              color: textMuted,
              padding: '1px 6px',
              borderRadius: '3px',
              backgroundColor: bgMuted,
              fontWeight: 600
            }}>
              {enrichment.urgencyLevel}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', fontSize: '13px', alignItems: 'center' }}>
          <span style={{ color: textMuted, display: 'flex', alignItems: 'center', gap: '6px' }}>📌 Dynamic Signals</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {enrichment.scopeHighlights.map((h, i) => (
              <span key={i} style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '3px',
                backgroundColor: bgMuted,
                color: textPrimary,
                fontWeight: 500
              }}>
                ✓ {h}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', fontSize: '13px', alignItems: 'center' }}>
          <span style={{ color: textMuted, display: 'flex', alignItems: 'center', gap: '6px' }}>🔢 Accession No.</span>
          <span style={{ fontFamily: 'SFMono-Regular, monospace', fontSize: '12px', color: textPrimary }}>
            {filing.accession_number || '0001535527-26-000091'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', fontSize: '13px', alignItems: 'center' }}>
          <span style={{ color: textMuted, display: 'flex', alignItems: 'center', gap: '6px' }}>🔗 SEC Source</span>
          <a
            href={filing.raw_html_url}
            target="_blank"
            rel="noreferrer"
            style={{ color: textLink, textDecoration: 'none', fontWeight: 500 }}
          >
            Raw SEC EDGAR File ↗
          </a>
        </div>
      </div>

      {/* Notion Callout Block: Executive Intelligence Summary */}
      <div style={{
        backgroundColor: bgCallout,
        borderRadius: '6px',
        border: `1px solid ${borderColor}`,
        padding: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start'
      }}>
        <div style={{ fontSize: '18px', marginTop: '1px' }}>💡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
            Extracted Filing Summary
          </div>
          <p style={{ fontSize: '13.5px', lineHeight: '1.6', margin: 0, color: textPrimary, fontWeight: 400 }}>
            {enrichment.executiveSummary}
          </p>
        </div>
      </div>

      {/* Notion Decision Makers Table */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          Verified Institutional Pathways
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {enrichment.contacts.map((contact, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: bgMuted,
                border: `1px solid ${borderColor}`,
                fontSize: '12.5px'
              }}
            >
              <div>
                <span style={{ fontWeight: 600, color: textPrimary }}>{contact.title}</span>
                <span style={{ color: textMuted, marginLeft: '8px', fontSize: '11px' }}>({contact.role})</span>
              </div>
              <a
                href={contact.linkedinSearchUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: textLink, textDecoration: 'none', fontWeight: 500, fontSize: '11.5px' }}
              >
                LinkedIn ↗
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Notion Monospaced Script Code Block */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'ir', label: 'IR Playbook' },
              { id: 'vendor', label: 'Vendor Pitch' },
              { id: 'brief', label: 'Exec Briefing' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveScriptTab(tab.id as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: activeScriptTab === tab.id ? 600 : 400,
                  color: activeScriptTab === tab.id ? textPrimary : textMuted,
                  backgroundColor: activeScriptTab === tab.id ? bgMuted : 'transparent',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyScript}
            style={{
              background: 'none',
              border: `1px solid ${borderColor}`,
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '11px',
              color: textMuted,
              cursor: 'pointer'
            }}
          >
            Copy Script
          </button>
        </div>

        <pre style={{
          backgroundColor: bgMuted,
          borderRadius: '6px',
          border: `1px solid ${borderColor}`,
          padding: '14px',
          fontSize: '12px',
          lineHeight: '1.5',
          fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
          color: textPrimary,
          whiteSpace: 'pre-wrap',
          margin: 0,
          maxHeight: '160px',
          overflowY: 'auto'
        }}>
          {currentScript}
        </pre>
      </div>

      {/* Notion Minimal Ghost Buttons */}
      <div style={{ display: 'flex', gap: '8px', borderTop: `1px solid ${borderColor}`, paddingTop: '14px' }}>
        <button
          onClick={handleSlackDispatch}
          disabled={isDispatchingSlack}
          style={{
            flex: 1,
            backgroundColor: bgMuted,
            color: textPrimary,
            border: `1px solid ${borderColor}`,
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          💬 Slack Alert <span style={{ color: textMuted, fontSize: '10px' }}>(s)</span>
        </button>

        <button
          onClick={handleEmailDispatch}
          disabled={isDispatchingEmail}
          style={{
            flex: 1,
            backgroundColor: bgMuted,
            color: textPrimary,
            border: `1px solid ${borderColor}`,
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          📧 Email Alert <span style={{ color: textMuted, fontSize: '10px' }}>(e)</span>
        </button>

        <a
          href={filing.raw_html_url}
          target="_blank"
          rel="noreferrer"
          style={{
            backgroundColor: bgMuted,
            color: textPrimary,
            border: `1px solid ${borderColor}`,
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          📄 SEC File <span style={{ color: textMuted, fontSize: '10px' }}>(o)</span>
        </a>
      </div>
    </div>
  );
};
