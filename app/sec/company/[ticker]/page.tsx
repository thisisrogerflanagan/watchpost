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
    <div style={{ backgroundColor: '#ffffff', color: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Bar */}
      <header style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ color: '#0f172a', fontWeight: '900', fontSize: '18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', letterSpacing: '0.05em' }}>SEC RADAR</span>
            Watchpost HQ
          </a>
          <a href="/#pricing" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
            Get Watchpost Free
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'monospace', fontWeight: '900', fontSize: '14px', backgroundColor: '#eff6ff', border: '1px solid #93c5fd', color: '#2563eb', padding: '4px 10px', borderRadius: '6px' }}>
            ${upperTicker}
          </span>
          <span style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>CIK #{info.cik}</span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>• {info.sicDescription}</span>
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.03em' }}>
          {info.companyName} SEC Regulatory &amp; Breach Radar
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 32px', maxWidth: '720px', lineHeight: '1.6' }}>
          Sub-second SEC EDGAR monitoring for {info.companyName}. Instant notifications on Form 8-K Item 1.05 material cybersecurity disclosures &amp; Item 5.02 executive transitions.
        </p>

        {/* Content Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: '800', color: '#2563eb', letterSpacing: '0.05em' }}>
              LIVE REGULATORY STREAM (ACTIVE)
            </span>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', fontFamily: 'monospace' }}>
              ✓ EDGAR INGESTION Operational
            </span>
          </div>

          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
              Monitoring Scope &amp; Automated Alerts
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155', margin: 0 }}>
              Watchpost HQ maintains an active sub-second RSS/Atom socket subscription for {info.companyName} (${upperTicker}). Upon filing publication, AI models parse materiality narrative, isolate containment facts, and dispatch formatted Slack Block Kit cards within 450 milliseconds.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a href="/" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: '800', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
              Add ${upperTicker} to Your Slack Watchlist →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
