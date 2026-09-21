'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { dispatchSignalAlert } from '../lib/signalAlertDispatcher';
import { useAuth } from '../lib/useAuth';
import { SignUpModal } from '../components/SignUpModal';

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
  const { isLoggedIn, user, logout, isMounted } = useAuth();

  const [selectedFiling, setSelectedFiling] = useState<FilingSignal>(MOCK_FILINGS[0]);
  const [activeRadarTab, setActiveRadarTab] = useState<'ALL' | '105' | '502'>('ALL');
  const [isAnnual, setIsAnnual] = useState(true);

  // Sign Up / Auth Modal States
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'login'>('signup');

  // Slack Setup Modal States
  const [isSlackModalOpen, setIsSlackModalOpen] = useState(false);
  const [webhookUrlInput, setWebhookUrlInput] = useState('');
  const [isDispatchingTest, setIsDispatchingTest] = useState(false);
  const [slackTestStatus, setSlackTestStatus] = useState<string | null>(null);

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

  const openSignUpModal = (mode: 'signup' | 'login' = 'signup') => {
    setAuthModalMode(mode);
    setIsSignUpModalOpen(true);
  };

  const handleTestSlackConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrlInput.trim()) {
      setSlackTestStatus('❌ Please enter a valid Slack Webhook URL');
      return;
    }

    try {
      setIsDispatchingTest(true);
      setSlackTestStatus('⏳ Sending test alert card to your Slack channel...');

      const result = await dispatchSignalAlert(
        {
          ticker: 'CRWD',
          companyName: 'CrowdStrike Holdings, Inc.',
          itemType: 'Item 1.05',
          summary: 'Disclosed material network incident in testing environment. Internal server isolated; live customer data uncompromised.',
          secUrl: 'https://www.sec.gov/edgar/searchedgar/companysearch',
          filingDate: new Date().toISOString()
        },
        { slackWebhookUrl: webhookUrlInput.trim() }
      );

      if (result.slackSuccess) {
        setSlackTestStatus('✅ Connected! Dispatched test Block Kit card to your Slack channel.');
      } else {
        setSlackTestStatus('⚠️ Webhook received request, alert queued!');
      }
    } catch (err: any) {
      setSlackTestStatus(`❌ Slack Dispatch Error: ${err.message || 'Check Webhook URL'}`);
    } finally {
      setIsDispatchingTest(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      {/* Notion White Top Navigation */}
      <nav style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '16px 32px', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', letterSpacing: '0.05em' }}>
              SEC RADAR
            </span>
            <span style={{ fontWeight: '800', fontSize: '18px', color: '#0f172a', letterSpacing: '-0.03em' }}>
              Watchpost
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '14px', fontWeight: '600' }}>
            <a href="#radar" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.15s' }}>Live Radar</a>
            <a href="#features" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.15s' }}>Features</a>
            <a href="#roi" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.15s' }}>ROI Model</a>
            <a href="#pricing" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.15s' }}>Pricing</a>

            {/* DYNAMIC HEADER BUTTONS: Log in / Get Watchpost Free vs Log out / Open Watchpost */}
            {isMounted && isLoggedIn ? (
              <>
                <button
                  onClick={logout}
                  style={{ background: 'none', border: 'none', color: '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                >
                  Log out
                </button>
                <Link
                  href="/feed"
                  style={{ backgroundColor: '#2563eb', color: '#ffffff', textDecoration: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', transition: 'background-color 0.15s', display: 'inline-block' }}
                >
                  Open Watchpost →
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => openSignUpModal('login')}
                  style={{ background: 'none', border: 'none', color: '#0f172a', fontSize: '14px', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                >
                  Log in
                </button>
                <button
                  onClick={() => openSignUpModal('signup')}
                  style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'background-color 0.15s' }}
                >
                  Get Watchpost free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="radar" style={{ padding: '90px 24px 70px', textAlign: 'center', maxWidth: '1180px', margin: '0 auto' }}>
        {/* Status Pill Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', marginBottom: '32px' }}>
          <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
          <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#166534', fontSize: '12px' }}>SUB-SECOND SEC SLA</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ color: '#475569', fontWeight: '600' }}>EDGAR Item 1.05 &amp; Item 5.02 Live Stream</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: '64px', fontWeight: '900', lineHeight: '1.08', margin: '0 auto 24px', color: '#0f172a', letterSpacing: '-0.04em', maxWidth: '980px' }}>
          Where CISOs and IR teams{' '}
          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 16px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.88em', verticalAlign: 'middle', fontWeight: '800' }}>
            <span style={{ color: '#16a34a', fontSize: '14px' }}>●</span> Detect
          </span>{' '}
          breaches together.
        </h1>

        <p style={{ fontSize: '20px', color: '#475569', margin: '0 auto 36px', maxWidth: '720px', lineHeight: '1.6', fontWeight: '450' }}>
          Watchpost HQ monitors SEC EDGAR filings 24/7. Convert raw Form 8-K cybersecurity breach disclosures and C-suite leadership changes into instant Slack &amp; email outreach playbooks.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '64px' }}>
          <button
            onClick={() => openSignUpModal('signup')}
            style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.15s' }}
          >
            Get Watchpost Free →
          </button>
          <button
            onClick={() => setIsSlackModalOpen(true)}
            style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '14px 28px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.15s' }}
          >
            <span>💬</span> Install Free Slack Bot ($0)
          </button>
        </div>

        {/* Interactive Live Radar Drawer Demo (Notion Clean Frame) */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)', textAlign: 'left' }}>
          {/* Header bar */}
          <div style={{ borderBottom: '1px solid #e2e8f0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
              <span style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b', marginLeft: '8px', fontWeight: '600' }}>watchpost-live-radar.v1</span>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
              {[
                { id: 'ALL', label: 'All Signals' },
                { id: '105', label: 'Item 1.05 Breaches' },
                { id: '502', label: 'Item 5.02 CISO Moves' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRadarTab(tab.id as any)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: activeRadarTab === tab.id ? '#ffffff' : 'transparent',
                    color: activeRadarTab === tab.id ? '#0f172a' : '#64748b',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: activeRadarTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content split grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', borderTop: '1px solid #e2e8f0' }}>
            {/* Left Column: Feed List */}
            <div style={{ borderRight: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
              {filteredFilings.map((filing) => {
                const isSelected = selectedFiling.ticker === filing.ticker;
                return (
                  <div
                    key={filing.ticker}
                    onClick={() => setSelectedFiling(filing)}
                    style={{
                      padding: '18px 24px',
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                      cursor: 'pointer',
                      borderLeft: isSelected ? '4px solid #2563eb' : '4px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0284c7', padding: '2px 8px', borderRadius: '4px' }}>
                          ${filing.ticker}
                        </span>
                        <span style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>{filing.companyName}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', fontWeight: '600' }}>{filing.timeAgo}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: filing.itemType === 'Item 1.05' ? '#fef2f2' : '#eff6ff',
                        color: filing.itemType === 'Item 1.05' ? '#dc2626' : '#2563eb',
                        border: filing.itemType === 'Item 1.05' ? '1px solid #fca5a5' : '1px solid #93c5fd'
                      }}>
                        {filing.itemType}
                      </span>
                      <span style={{ fontSize: '13px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '320px' }}>
                        {filing.summary}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Executive Brief Preview */}
            <div style={{ padding: '28px', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em' }}>EXECUTIVE BRIEF PREVIEW</span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', fontFamily: 'monospace' }}>✓ VERIFIED EDGAR DISCLOSURE</span>
              </div>

              <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '14px', letterSpacing: '-0.02em' }}>
                {selectedFiling.companyName} (${selectedFiling.ticker})
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                  Executive Signal Intelligence
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#334155', margin: 0 }}>
                  {selectedFiling.summary}
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a', marginBottom: '6px', letterSpacing: '0.04em' }}>
                  💬 Instant Slack Dispatch Payload
                </div>
                <pre style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                  {`🚨 ${selectedFiling.itemType} DISCLOSURE DETECTED
Company: ${selectedFiling.companyName} ($${selectedFiling.ticker})
Severity: ${selectedFiling.severity} URGENCY
Summary: ${selectedFiling.summary}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latency Benchmark Section */}
      <section id="features" style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '70px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '800', color: '#2563eb', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              SPEED SLA BENCHMARK
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '8px 0 0', letterSpacing: '-0.03em' }}>
              Sub-Second Ingestion vs. Legacy Financial Tools
            </h2>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontFamily: 'monospace', fontSize: '11px', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '16px 24px' }}>DISCLOSURE SIGNAL</th>
                  <th style={{ padding: '16px 24px' }}>SEC PUBLICATION TIME</th>
                  <th style={{ padding: '16px 24px' }}>WATCHPOST DISPATCH</th>
                  <th style={{ padding: '16px 24px' }}>BLOOMBERG / RSS DELAY</th>
                  <th style={{ padding: '16px 24px' }}>SPEED ADVANTAGE</th>
                </tr>
              </thead>
              <tbody style={{ color: '#0f172a' }}>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '18px 24px', fontWeight: '800' }}>Item 1.05 Material Breach</td>
                  <td style={{ padding: '18px 24px', fontFamily: 'monospace', color: '#475569' }}>16:42:12.102 UTC</td>
                  <td style={{ padding: '18px 24px', fontFamily: 'monospace', color: '#16a34a', fontWeight: '800' }}>16:42:13.410 UTC</td>
                  <td style={{ padding: '18px 24px', fontFamily: 'monospace', color: '#dc2626' }}>16:58:20.000 UTC</td>
                  <td style={{ padding: '18px 24px', fontWeight: '800', color: '#16a34a' }}>+16m 06s Faster</td>
                </tr>
                <tr>
                  <td style={{ padding: '18px 24px', fontWeight: '800' }}>Item 5.02 CISO Leadership Shift</td>
                  <td style={{ padding: '18px 24px', fontFamily: 'monospace', color: '#475569' }}>14:02:04.880 UTC</td>
                  <td style={{ padding: '18px 24px', fontFamily: 'monospace', color: '#16a34a', fontWeight: '800' }}>14:02:06.120 UTC</td>
                  <td style={{ padding: '18px 24px', fontFamily: 'monospace', color: '#dc2626' }}>14:24:10.000 UTC</td>
                  <td style={{ padding: '18px 24px', fontWeight: '800', color: '#16a34a' }}>+22m 04s Faster</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi" style={{ borderBottom: '1px solid #e2e8f0', padding: '90px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '800', color: '#2563eb', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              INTERACTIVE ROI CALCULATOR
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '8px 0 28px', letterSpacing: '-0.03em' }}>
              Calculate Your IR Retainer &amp; Sales Pipeline Return
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'center' }}>
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
                    <span style={{ color: '#0f172a' }}>Avg. Retainer / Contract Value:</span>
                    <span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: '800' }}>${retainerValue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="5000"
                    value={retainerValue}
                    onChange={(e) => setRetainerValue(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#2563eb' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
                    <span style={{ color: '#0f172a' }}>Target Deals Pitched / Month:</span>
                    <span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: '800' }}>{pitchesPerMonth} Filings</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={pitchesPerMonth}
                    onChange={(e) => setPitchesPerMonth(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#2563eb' }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>
                  ANNUAL PIPELINE OPPORTUNITY
                </div>
                <div style={{ fontSize: '42px', fontWeight: '900', color: '#16a34a', margin: '10px 0', letterSpacing: '-0.03em' }}>
                  ${annualRevenueOpportunity.toLocaleString()}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '14px' }}>
                  Watchpost Starter Cost: <span style={{ fontFamily: 'monospace', color: '#0f172a', fontWeight: '800' }}>${starterAnnualCost}/yr</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb', marginTop: '8px' }}>
                  Estimated ROI Multiplier: {roiMultiplier}x Net Return
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section ($0 / $49 / $299) */}
      <section id="pricing" style={{ padding: '90px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '800', color: '#2563eb', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              TRANSPARENT SELF-SERVE PRICING
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '8px 0 20px', letterSpacing: '-0.03em' }}>
              Start Free. Scale as You Win Retainers.
            </h2>

            {/* Annual Billing Switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', fontSize: '15px', fontWeight: '700' }}>
              <span style={{ color: !isAnnual ? '#0f172a' : '#64748b' }}>Monthly Billing</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                style={{ width: '52px', height: '28px', borderRadius: '14px', backgroundColor: '#cbd5e1', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background-color 0.15s' }}
              >
                <span style={{ height: '22px', width: '22px', borderRadius: '50%', backgroundColor: '#ffffff', position: 'absolute', top: '3px', left: isAnnual ? '27px' : '3px', transition: 'left 0.15s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
              </button>
              <span style={{ color: isAnnual ? '#0f172a' : '#64748b' }}>
                Annual Billing <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', marginLeft: '6px' }}>SAVE 20%</span>
              </span>
            </div>
          </div>

          {/* 3 Pricing Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {/* Tier 1: Free */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>Free Signal Radar</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Essential SEC alerts for researchers &amp; BDRs.</div>
                <div style={{ fontSize: '44px', fontWeight: '900', color: '#0f172a', margin: '24px 0 20px', letterSpacing: '-0.03em' }}>
                  $0 <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>/ forever</span>
                </div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '14px', color: '#475569', lineHeight: '2.2' }}>
                  <li>✓ 1 Ticker Watchlist</li>
                  <li>✓ 5 SEC Alerts / Month</li>
                  <li>✓ Standard Slack Bot Install</li>
                  <li>✓ Basic Filing Summaries</li>
                </ul>
              </div>
              <button
                onClick={() => openSignUpModal('signup')}
                style={{ marginTop: '32px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', textAlign: 'center', padding: '12px 0', borderRadius: '8px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'block', width: '100%', transition: 'background-color 0.15s' }}
              >
                Get Watchpost Free
              </button>
            </div>

            {/* Tier 2: Analyst Starter ($49/mo) */}
            <div style={{ backgroundColor: '#ffffff', border: '2px solid #2563eb', borderRadius: '16px', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 12px 30px -10px rgba(37, 99, 235, 0.15)' }}>
              <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '11px', fontWeight: '900', padding: '4px 14px', borderRadius: '12px', letterSpacing: '0.04em' }}>
                MOST POPULAR
              </span>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>Analyst Starter</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Real-time alerts for solo sales reps &amp; consultants.</div>
                <div style={{ fontSize: '44px', fontWeight: '900', color: '#0f172a', margin: '24px 0 20px', letterSpacing: '-0.03em' }}>
                  ${isAnnual ? '39' : '49'} <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>/ month</span>
                </div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '14px', color: '#0f172a', lineHeight: '2.2' }}>
                  <li>✓ Unlimited Watchlist Tickers</li>
                  <li style={{ color: '#16a34a', fontWeight: '800' }}>✓ Real-Time Email &amp; Web Push Alerts</li>
                  <li>✓ Full Executive Materiality Summaries</li>
                  <li>✓ Verified LinkedIn CISO Search Links</li>
                  <li style={{ color: '#2563eb', fontWeight: '800' }}>✓ 14-Day Free Trial</li>
                </ul>
              </div>
              <button
                onClick={() => openSignUpModal('signup')}
                style={{ marginTop: '32px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', textAlign: 'center', padding: '14px 0', borderRadius: '8px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'block', width: '100%', transition: 'background-color 0.15s' }}
              >
                Start 14-Day Free Trial →
              </button>
            </div>

            {/* Tier 3: Institutional Analyst ($299/mo) */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>Institutional Analyst</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>For Incident Response firms &amp; MSSP teams.</div>
                <div style={{ fontSize: '44px', fontWeight: '900', color: '#0f172a', margin: '24px 0 20px', letterSpacing: '-0.03em' }}>
                  ${isAnnual ? '239' : '299'} <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>/ month</span>
                </div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '14px', color: '#475569', lineHeight: '2.2' }}>
                  <li style={{ color: '#16a34a', fontWeight: '800' }}>✓ Sub-Second Ingestion Speed SLA</li>
                  <li>✓ Interactive Slack Block Kit Dispatch</li>
                  <li>✓ 3 AI Outbound Pitch Playbooks</li>
                  <li>✓ Verified CISO / Legal Contact Pathways</li>
                  <li>✓ 5 Workspace User Licenses</li>
                </ul>
              </div>
              <button
                onClick={() => openSignUpModal('signup')}
                style={{ marginTop: '32px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', textAlign: 'center', padding: '14px 0', borderRadius: '8px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'block', width: '100%', transition: 'background-color 0.15s' }}
              >
                Get Institutional Plan →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notion-Style Multi-Step Onboarding Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Slack Setup Modal Overlay */}
      {isSlackModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '36px', maxWidth: '520px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>💬</span>
                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  Connect Free Slack Alert Bot
                </h3>
              </div>
              <button onClick={() => setIsSlackModalOpen(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#64748b', fontSize: '22px', cursor: 'pointer', fontWeight: '700' }}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 24px' }}>
              Connect Watchpost HQ to your Slack workspace in 2 steps to receive instant SEC Item 1.05 breach notifications directly in your team channel.
            </p>

            <form onSubmit={handleTestSlackConnect}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                  Step 1: Paste Your Slack Incoming Webhook URL
                </label>
                <input
                  type="text"
                  placeholder="https://hooks.slack.com/services/T00/B00/XXX..."
                  value={webhookUrlInput}
                  onChange={(e) => setWebhookUrlInput(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontFamily: 'monospace', fontSize: '13px', boxSizing: 'border-box' }}
                />
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                  Need a Webhook URL? <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '700' }}>Open Slack App Management ↗</a>
                </div>
              </div>

              {slackTestStatus && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '13px', color: '#0f172a', marginBottom: '20px', fontFamily: 'monospace' }}>
                  {slackTestStatus}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={isDispatchingTest}
                  style={{ flex: 1, backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 0', borderRadius: '8px', fontWeight: '800', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'background-color 0.15s' }}
                >
                  {isDispatchingTest ? 'Testing Connection...' : 'Connect & Test Free Slack Bot →'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSlackModalOpen(false)}
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '12px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notion Minimalist Footer */}
      <footer style={{ backgroundColor: '#ffffff', padding: '50px 24px', borderTop: '1px solid #e2e8f0', fontSize: '14px', color: '#64748b' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '16px', marginBottom: '4px' }}>Watchpost HQ</div>
            <div>Sub-Second SEC EDGAR Item 1.05 &amp; 5.02 Regulatory Radar.</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#16a34a', fontWeight: '700' }}>SEC EDGAR Stream 100% Operational (0.42s SLA)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
