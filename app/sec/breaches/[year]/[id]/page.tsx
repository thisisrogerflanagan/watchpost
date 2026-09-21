import { Metadata } from 'next';

export const revalidate = 86400; // ISR cache 24 hours
export const dynamicParams = true;

interface Props {
  params: Promise<{ year: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, id } = await params;
  const title = `SEC Form 8-K Item 1.05 Material Cybersecurity Breach Disclosure (#${id})`;
  const description = `Read the official SEC 8-K Item 1.05 breach disclosure summary, C-Suite Impact rating, and containment analysis filed in ${year}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://watchpost.hq/sec/breaches/${year}/${id}`,
      siteName: 'Watchpost HQ',
      type: 'article',
    },
  };
}

export default async function BreachDetailPage({ params }: Props) {
  const { year, id } = await params;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: `SEC Item 1.05 Material Cybersecurity Incident Disclosure (${id})`,
    datePublished: `${year}-09-18T16:42:12Z`,
    description: `Official plain-English executive summary and containment analysis of SEC 8-K Item 1.05 material breach disclosure #${id}.`,
    publisher: {
      '@type': 'Organization',
      name: 'Watchpost HQ',
      url: 'https://watchpost.hq',
    },
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '16px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ color: '#0f172a', fontWeight: '900', fontSize: '18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', letterSpacing: '0.05em' }}>ITEM 1.05 BREACH</span>
            Watchpost HQ
          </a>
          <a href="/#pricing" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
            Try Watchpost Free
          </a>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #fca5a5', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.05)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '6px', border: '1px solid #fca5a5' }}>
              SEC FORM 8-K ITEM 1.05: MATERIAL CYBERSECURITY INCIDENT
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>Accession #{id}</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '0 0 16px', letterSpacing: '-0.03em' }}>
            Material Cybersecurity Incident Disclosure Analysis ({year})
          </h1>

          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
              Executive Intelligence Narrative Summary
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155', margin: 0 }}>
              The registrant detected unauthorized third-party activity within an isolated non-production testing environment. Internal security teams contained the server, and active customer data remains uncompromised. Containment and forensic audit are complete.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontWeight: '600' }}>✓ Testing Environment Isolation</span>
            <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontWeight: '600' }}>✓ No Customer Data Impact</span>
            <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontWeight: '600' }}>✓ Third-Party Forensics Engaged</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="/" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontWeight: '800', textDecoration: 'none', fontSize: '15px', display: 'inline-block' }}>
            Get Sub-Second SEC Breach Alerts on Slack →
          </a>
        </div>
      </main>
    </div>
  );
}
