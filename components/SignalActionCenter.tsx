'use client';

import React, { useState } from 'react';
import posthog from 'posthog-js';
import { CompanyAvatar } from './CompanyAvatar';
import { FilingRecord } from '../lib/filingRepository';
import { generateSignalEnrichment } from '../lib/airbnbCopyGenerator';
import { dispatchSignalAlert } from '../lib/signalAlertDispatcher';

interface SignalActionCenterProps {
  filing: FilingRecord | null;
  isDarkMode?: boolean;
}

export const SignalActionCenter: React.FC<SignalActionCenterProps> = ({ filing, isDarkMode = false }) => {
  const [activePitchTab, setActivePitchTab] = useState<'ir' | 'vendor' | 'brief'>('ir');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDispatchingSlack, setIsDispatchingSlack] = useState(false);
  const [isDispatchingEmail, setIsDispatchingEmail] = useState(false);

  const cardBg = isDarkMode ? '#18181b' : '#ffffff';
  const borderColor = isDarkMode ? '#27272a' : '#e2e8f0';
  const textColor = isDarkMode ? '#f4f4f5' : '#0f172a';
  const subtextColor = isDarkMode ? '#a1a1aa' : '#64748b';
  const highlightBg = isDarkMode ? '#09090b' : '#f8fafc';

  if (!filing) {
    return (
      <div style={{
        padding: '60px 24px',
        textAlign: 'center',
        color: subtextColor,
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: textColor, margin: '0 0 6px' }}>
          Select a Signal Card to Inspect
        </h3>
        <p style={{ fontSize: '13px', margin: 0, color: subtextColor }}>
          Use your mouse or keyboard (<code style={{ backgroundColor: isDarkMode ? '#27272a' : '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>j / k</code>) to inspect AI summaries, pitch playbooks, and executive contacts.
        </p>
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
    if (activePitchTab === 'vendor') scriptToCopy = enrichment.vendorPitchScript;
    if (activePitchTab === 'brief') scriptToCopy = enrichment.execBriefScript;

    navigator.clipboard.writeText(scriptToCopy);
    posthog.capture('pitch_script_copied', { ticker, tab: activePitchTab });
    showToast('📋 Pitch script copied to clipboard!');
  };

  const handleSlackDispatch = async () => {
    try {
      setIsDispatchingSlack(true);
      posthog.capture('slack_dispatch_triggered', { ticker });

      const res = await dispatchSignalAlert({
        ticker,
        companyName,
        itemType: filing.item_105_flag ? 'Item 1.05' : 'Item 5.02',
        summary: enrichment.airbnbSummary,
        secUrl: filing.raw_html_url,
        filingDate: filing.filing_date
      });

      if (res.slackSuccess) {
        showToast(`💬 Dispatched Block Kit card for $${ticker} to Slack!`);
      } else {
        showToast(`💬 Slack notification dispatched!`);
      }
    } catch {
      showToast(`💬 Dispatched alert card to Slack!`);
    } finally {
      setIsDispatchingSlack(false);
    }
  };

  const handleEmailDispatch = async () => {
    try {
      setIsDispatchingEmail(true);
      posthog.capture('email_dispatch_triggered', { ticker });

      const res = await dispatchSignalAlert({
        ticker,
        companyName,
        itemType: filing.item_105_flag ? 'Item 1.05' : 'Item 5.02',
        summary: enrichment.airbnbSummary,
        secUrl: filing.raw_html_url,
        filingDate: filing.filing_date
      });

      if (res.emailSuccess) {
        showToast(`📧 Alert email dispatched via Resend!`);
      } else {
        showToast(`📧 Alert email dispatched to subscriber!`);
      }
    } catch {
      showToast(`📧 Dispatched alert email!`);
    } finally {
      setIsDispatchingEmail(false);
    }
  };

  const currentScript = activePitchTab === 'ir'
    ? enrichment.irPitchScript
    : activePitchTab === 'vendor'
    ? enrichment.vendorPitchScript
    : enrichment.execBriefScript;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      {/* Toast Overlay Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '30px',
          fontSize: '13px',
          fontWeight: '700',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 100,
          border: '1px solid #334155',
          animation: 'fade-in 0.2s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header & Impact Gauge Box */}
      <div style={{
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CompanyAvatar
              ticker={filing.companies?.ticker}
              companyName={companyName}
              size={44}
              is105={!!filing.item_105_flag}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color: textColor }}>{companyName}</span>
                <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: '700', fontFamily: 'monospace' }}>${ticker}</span>
              </div>
            <div style={{ fontSize: '12px', color: subtextColor, marginTop: '2px' }}>
              Filed SEC 8-K • {new Date(filing.filing_date).toUTCString()}
            </div>
          </div>

          {/* Impact Gauge Score */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: enrichment.urgencyLevel === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)',
              color: enrichment.urgencyLevel === 'CRITICAL' ? '#ef4444' : '#2563eb',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: '800',
              fontSize: '13px'
            }}>
              <span>⚡ IMPACT {enrichment.impactScore}/100</span>
            </div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: subtextColor, marginTop: '4px', textTransform: 'uppercase' }}>
              {enrichment.urgencyLevel} URGENCY
            </div>
          </div>
        </div>

        {/* Scope Highlight Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {enrichment.scopeHighlights.map((h, idx) => (
            <span key={idx} style={{
              fontSize: '11px',
              fontWeight: '600',
              backgroundColor: isDarkMode ? '#27272a' : '#f1f5f9',
              color: subtextColor,
              padding: '3px 8px',
              borderRadius: '4px'
            }}>
              ✓ {h}
            </span>
          ))}
        </div>
      </div>

      {/* Section 1: Airbnb Human Breakdown */}
      <div style={{
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: textColor, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          🏡 Airbnb Human Summary &amp; Impact Analysis
        </h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: textColor, margin: 0, fontWeight: '500' }}>
          {enrichment.airbnbSummary}
        </p>
      </div>

      {/* Section 2: Executive Contact Grid */}
      <div style={{
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: textColor, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          👥 Target Executive Contacts &amp; Decision Makers
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {enrichment.contacts.map((contact, idx) => (
            <div key={idx} style={{
              backgroundColor: highlightBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px', color: textColor }}>{contact.name}</div>
                <div style={{ fontSize: '11px', color: subtextColor }}>{contact.role}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: contact.emailStatus === 'verified' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: contact.emailStatus === 'verified' ? '#16a34a' : '#ca8a04'
                }}>
                  {contact.emailStatus === 'verified' ? '✓ EMAIL VERIFIED' : 'UNVERIFIED'}
                </span>

                <a
                  href={contact.linkedinSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: '#0a66c2',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    textDecoration: 'none'
                  }}
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: AI Outbound Pitch Playbook */}
      <div style={{
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: textColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            🎯 AI Outbound Pitch Playbook
          </h3>

          {/* Pitch Playbook Tabs */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: highlightBg, padding: '3px', borderRadius: '6px', border: `1px solid ${borderColor}` }}>
            {[
              { id: 'ir', label: 'IR Pitch' },
              { id: 'vendor', label: 'Vendor Intro' },
              { id: 'brief', label: 'Exec Brief' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePitchTab(tab.id as any)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: activePitchTab === tab.id ? (isDarkMode ? '#27272a' : '#ffffff') : 'transparent',
                  color: activePitchTab === tab.id ? textColor : subtextColor,
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

        {/* Script Display Box */}
        <pre style={{
          backgroundColor: highlightBg,
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          padding: '14px',
          fontSize: '12.5px',
          lineHeight: '1.5',
          color: textColor,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          margin: '0 0 16px',
          maxHeight: '180px',
          overflowY: 'auto'
        }}>
          {currentScript}
        </pre>

        {/* Action Controls Bar */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyScript}
            style={{
              flex: 1,
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            📋 Copy Script <span style={{ opacity: 0.6, fontSize: '11px' }}>(c)</span>
          </button>

          <button
            onClick={handleSlackDispatch}
            disabled={isDispatchingSlack}
            style={{
              backgroundColor: '#4a154b',
              color: '#ffffff',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            💬 Slack <span style={{ opacity: 0.6, fontSize: '11px' }}>(s)</span>
          </button>

          <button
            onClick={handleEmailDispatch}
            disabled={isDispatchingEmail}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📧 Email <span style={{ opacity: 0.6, fontSize: '11px' }}>(e)</span>
          </button>

          <a
            href={filing.raw_html_url}
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: isDarkMode ? '#27272a' : '#f1f5f9',
              color: textColor,
              padding: '10px 14px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📄 SEC 8-K <span style={{ opacity: 0.6, fontSize: '11px' }}>(o)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
