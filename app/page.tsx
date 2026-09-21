'use client';

import React, { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { getLatestFilings, FilingRecord } from '../lib/filingRepository';

export default function WatchpostLandingPage() {
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const [liveSignals, setLiveSignals] = useState<FilingRecord[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(true);

  useEffect(() => {
    async function fetchLiveSignals() {
      try {
        setLoadingSignals(true);
        const data = await getLatestFilings(4);
        setLiveSignals(data);
      } catch (err) {
        console.error('Failed to fetch live database signals:', err);
      } finally {
        setLoadingSignals(false);
      }
    }

    fetchLiveSignals();
  }, []);

  const handleCheckout = async (priceId: string, planName: string) => {
    try {
      setLoadingCheckout(planName);
      posthog.capture('checkout_initiated', { plan: planName, price_id: priceId });
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = '/feed';
      }
    } catch (err) {
      console.error(err);
      window.location.href = '/feed';
    } finally {
      setLoadingCheckout(null);
    }
  };

  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || 'prod_VIUfQQaf8yf5f7';
  const enterprisePriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE || 'prod_VIUfkNhR1k5XTw';

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
          <button 
            onClick={() => handleCheckout(proPriceId, 'pro')}
            style={{ backgroundColor: '#ffffff', color: '#000000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
          >
            {loadingCheckout === 'pro' ? 'Loading Stripe...' : 'Start 7-Day Trial'}
          </button>
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
          <button 
            onClick={() => handleCheckout(proPriceId, 'pro')}
            style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}
          >
            {loadingCheckout === 'pro' ? 'Connecting to Stripe...' : 'Get Instant Slack Alerts ($199/mo)'}
          </button>
          <a href="#feed-preview" style={{ backgroundColor: '#27272a', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontWeight: '600', fontSize: '16px', textDecoration: 'none' }}>
            View Live Signal Radar ↓
          </a>
        </div>
      </section>

      {/* Live Signal Feed Social Proof Section (Dynamic Supabase Query) */}
      <section id="feed-preview" style={{ maxWidth: '900px', margin: '40px auto 80px', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #27272a', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
              <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Watchpost HQ Live Database Stream</h2>
            </div>
            <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Verified SEC EDGAR Data</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loadingSignals ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#a1a1aa', fontSize: '14px' }}>Connecting to live database...</div>
            ) : liveSignals.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#a1a1aa', fontSize: '14px' }}>No recent 8-K signals in database. Monitoring live SEC feed 24/7.</div>
            ) : (
              liveSignals.map((sig) => (
                <div key={sig.id} style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '16px', color: sig.item_105_flag ? '#ef4444' : '#3b82f6' }}>
                        {sig.companies?.ticker ? `$${sig.companies.ticker}` : `CIK:${sig.cik}`}
                      </span>
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>{sig.companies?.company_name || sig.title}</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: sig.item_105_flag ? 'rgba(220, 38, 38, 0.2)' : 'rgba(37, 99, 235, 0.2)', color: sig.item_105_flag ? '#ef4444' : '#3b82f6' }}>
                        {sig.item_105_flag ? 'ITEM 1.05 BREACH' : 'ITEM 5.02 SHIFT'}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#71717a' }}>{new Date(sig.filing_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa', lineHeight: '1.5' }}>
                    {sig.summary_text}
                  </p>
                </div>
              ))
            )}
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
            <button 
              onClick={() => handleCheckout(proPriceId, 'pro')}
              style={{ display: 'block', width: '100%', border: 'none', textAlign: 'center', backgroundColor: '#ffffff', color: '#000000', padding: '12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              {loadingCheckout === 'pro' ? 'Redirecting to Stripe...' : 'Start 7-Day Trial'}
            </button>
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
            <button 
              onClick={() => handleCheckout(enterprisePriceId, 'enterprise')}
              style={{ display: 'block', width: '100%', border: 'none', textAlign: 'center', backgroundColor: '#dc2626', color: '#ffffff', padding: '12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              {loadingCheckout === 'enterprise' ? 'Redirecting to Stripe...' : 'Start Enterprise Trial'}
            </button>
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
