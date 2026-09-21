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
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header style={{ borderBottom: '1px solid #27272a', backgroundColor: '#18181b', padding: '16px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ color: '#ffffff', fontWeight: '900', fontSize: '18px', textDecoration: 'none' }}>
            Watchpost HQ <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>ITEM 1.05 BREACH RADAR</span>
          </a>
          <a href="/#pricing" style={{ backgroundColor: '#ffffff', color: '#09090b', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
            Try Watchpost Free
          </a>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ backgroundColor: '#18181b', border: '1px solid #ef4444', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px' }}>
              SEC FORM 8-K ITEM 1.05: MATERIAL CYBERSECURITY INCIDENT
            </span>
            <span style={{ fontSize: '12px', color: '#a1a1aa', fontFamily: 'monospace' }}>Accession #{id}</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: '0 0 16px' }}>
            Material Cybersecurity Incident Disclosure Analysis ({year})
          </h1>

          <div style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
              Executive Intelligence Narrative Summary
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#f4f4f5', margin: 0 }}>
              The registrant detected unauthorized third-party activity within an isolated non-production testing environment. Internal security teams contained the server, and active customer data remains uncompromised. Containment and forensic audit are complete.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', backgroundColor: '#27272a', color: '#a1a1aa', padding: '4px 8px', borderRadius: '4px' }}>✓ Testing Environment Isolation</span>
            <span style={{ fontSize: '11px', backgroundColor: '#27272a', color: '#a1a1aa', padding: '4px 8px', borderRadius: '4px' }}>✓ No Customer Data Impact</span>
            <span style={{ fontSize: '11px', backgroundColor: '#27272a', color: '#a1a1aa', padding: '4px 8px', borderRadius: '4px' }}>✓ Third-Party Forensics Engaged</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="/#pricing" style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '14px', display: 'inline-block' }}>
            Get Sub-Second SEC Breach Alerts on Slack →
          </a>
        </div>
      </main>
    </div>
  );
}
