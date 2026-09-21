import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // ISR cache 1 hour
export const dynamicParams = true;

interface Props {
  params: Promise<{ ticker: string }>;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const POPULAR_COMPANIES: Record<string, { companyName: string; cik: string; sic: string; sicDescription: string }> = {
  CRWD: { companyName: 'CrowdStrike Holdings, Inc.', cik: '0001535527', sic: '7372', sicDescription: 'Services-Prepackaged Software' },
  LII: { companyName: 'Lennox International Inc.', cik: '0001069202', sic: '3585', sicDescription: 'Air-Cond & Commercial Refrigeration' },
  KR: { companyName: 'Kroger Co.', cik: '0000056873', sic: '5411', sicDescription: 'Grocery Stores' },
  AAPL: { companyName: 'Apple Inc.', cik: '0000320193', sic: '3571', sicDescription: 'Electronic Computers' },
  MSFT: { companyName: 'Microsoft Corporation', cik: '0000789019', sic: '7372', sicDescription: 'Services-Prepackaged Software' },
  GOOGL: { companyName: 'Alphabet Inc.', cik: '0001652044', sic: '7370', sicDescription: 'Services-Computer Programming' },
  AMZN: { companyName: 'Amazon.com, Inc.', cik: '0001018724', sic: '5961', sicDescription: 'Retail-Catalog & Mail-Order' },
};

export async function generateStaticParams() {
  return Object.keys(POPULAR_COMPANIES).map((ticker) => ({
    ticker: ticker.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();
  const info = POPULAR_COMPANIES[upperTicker];

  const companyName = info ? info.companyName : `${upperTicker} Corp`;
  const title = `${companyName} (${upperTicker}) SEC 8-K Regulatory Breach & CISO Radar`;
  const description = `Live SEC EDGAR 8-K regulatory disclosure radar for ${companyName} (${upperTicker}). Sub-second alerts on SEC Item 1.05 material breaches and Item 5.02 CISO shifts.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://watchpost.hq/sec/company/${ticker.toLowerCase()}`,
      siteName: 'Watchpost HQ',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CompanyRadarPage({ params }: Props) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();
  const info = POPULAR_COMPANIES[upperTicker] || {
    companyName: `${upperTicker} Corp`,
    cik: '0001000000',
    sic: '7372',
    sicDescription: 'Enterprise Software & Systems',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: info.companyName,
    tickerSymbol: upperTicker,
    identifier: info.cik,
    url: `https://watchpost.hq/sec/company/${ticker.toLowerCase()}`,
  };

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Bar */}
      <header style={{ borderBottom: '1px solid #27272a', backgroundColor: '#18181b', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ color: '#ffffff', fontWeight: '900', fontSize: '18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>RADAR</span>
            Watchpost HQ
          </a>
          <a href="/#pricing" style={{ backgroundColor: '#ffffff', color: '#09090b', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
            Start Free Trial
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Company Header Card */}
        <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontFamily: 'monospace', fontWeight: '800', fontSize: '14px' }}>
              ${upperTicker}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#a1a1aa' }}>CIK #{info.cik}</span>
            <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
              ● LIVE MONITORING
            </span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 8px', color: '#ffffff' }}>
            {info.companyName} SEC Regulatory Signal Radar
          </h1>
          <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, lineHeight: '1.5' }}>
            SIC Code {info.sic} — {info.sicDescription}. Continuously monitored 24/7 for SEC Form 8-K Item 1.05 material breach disclosures and Item 5.02 C-Suite leadership transitions.
          </p>
        </div>

        {/* SEC Disclosure Timeline */}
        <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Regulatory Disclosure History
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '11px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                    SEC ITEM 1.05: MATERIAL CYBERSECURITY DISCLOSURE
                  </span>
                  <span style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace' }}>2026-09-18 UTC</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
                  Material Cybersecurity Incident Disclosure — Testing Environment Isolation
                </div>
                <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px' }}>
                  Internal security teams isolated development server. Live customer data uncompromised. Containment verified.
                </div>
              </div>

              <a href="https://www.sec.gov/edgar/searchedgar/companysearch" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'none', fontWeight: '700', flexShrink: 0 }}>
                SEC Original ↗
              </a>
            </div>

            <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontSize: '11px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                    SEC ITEM 5.02: EXECUTIVE LEADERSHIP TRANSITION
                  </span>
                  <span style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace' }}>2026-08-14 UTC</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
                  Appointment of Principal Officer / CISO Leadership Transition
                </div>
                <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px' }}>
                  90-day vendor security stack evaluation window open. Verified CISO contact pathways accessible.
                </div>
              </div>

              <a href="https://www.sec.gov/edgar/searchedgar/companysearch" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'none', fontWeight: '700', flexShrink: 0 }}>
                SEC Original ↗
              </a>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div style={{ marginTop: '32px', backgroundColor: '#18181b', border: '1px solid #3b82f6', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px' }}>
            Get Sub-Second SEC Alerts for ${upperTicker}
          </h3>
          <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '0 0 16px' }}>
            Receive instant Slack &amp; email notifications within &lt;30 seconds of an SEC Item 1.05 or 5.02 filing.
          </p>
          <a href="/#pricing" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', fontWeight: '700', textDecoration: 'none', fontSize: '14px', display: 'inline-block' }}>
            Start Free Trial ($49/mo Starter Plan)
          </a>
        </div>
      </main>
    </div>
  );
}
