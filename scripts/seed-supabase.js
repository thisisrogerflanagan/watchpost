const supabaseUrl = 'https://bfebpgfguqkciohauetg.supabase.co';
const supabaseKey = 'sb_publishable_724z32yG9Y1t10fLRkhWjg_V_504oxl';

const SAMPLE_COMPANIES = [
  { cik: '0001535527', ticker: 'CRWD', company_name: 'CROWDSTRIKE HOLDINGS, INC.', sic: '7372', exchange: 'NASDAQ' },
  { cik: '0000789019', ticker: 'MSFT', company_name: 'MICROSOFT CORP', sic: '7372', exchange: 'NASDAQ' },
  { cik: '0001660134', ticker: 'OKTA', company_name: 'OKTA, INC.', sic: '7372', exchange: 'NASDAQ' },
  { cik: '0001327468', ticker: 'PANW', company_name: 'PALO ALTO NETWORKS, INC.', sic: '7372', exchange: 'NASDAQ' }
];

const SAMPLE_FILINGS = [
  {
    accession_number: '000153552726000042',
    cik: '0001535527',
    form_type: '8-K',
    filing_date: new Date().toISOString(),
    item_105_flag: true,
    item_502_flag: false,
    items_detected: ['Item 1.05'],
    title: 'CrowdStrike Holdings ($CRWD) Item 1.05 Cyber Incident Disclosure',
    summary_text: 'Item 1.05 Material Cybersecurity Incident. Identified unauthorized activity within a secondary cloud testing environment. Materiality determined on Sept 20. Containment completed.',
    raw_html_url: 'https://www.sec.gov/Archives/edgar/data/1535527/000153552726000042/index.htm'
  },
  {
    accession_number: '000078901926000118',
    cik: '0000789019',
    form_type: '8-K',
    filing_date: new Date(Date.now() - 3600000).toISOString(),
    item_105_flag: false,
    item_502_flag: true,
    items_detected: ['Item 5.02'],
    title: 'Microsoft Corp ($MSFT) Item 5.02 C-Suite Shift Disclosure',
    summary_text: 'Item 5.02 Departure of Directors or Certain Officers; Election of Directors; Appointment of Certain Officers. Effective Sept 20, Microsoft appointed a new Chief Information Security Officer (CISO).',
    raw_html_url: 'https://www.sec.gov/Archives/edgar/data/789019/000078901926000118/index.htm'
  },
  {
    accession_number: '000166013426000088',
    cik: '0001660134',
    form_type: '8-K',
    filing_date: new Date(Date.now() - 7200000).toISOString(),
    item_105_flag: true,
    item_502_flag: false,
    items_detected: ['Item 1.05'],
    title: 'Okta, Inc. ($OKTA) Item 1.05 Cyber Incident Disclosure',
    summary_text: 'Item 1.05 Material Cybersecurity Incident. Disclosed credential spray incident impacting an isolated tenant environment. Remediation dispatched.',
    raw_html_url: 'https://www.sec.gov/Archives/edgar/data/1660134/000166013426000088/index.htm'
  },
  {
    accession_number: '000132746826000055',
    cik: '0001327468',
    form_type: '8-K',
    filing_date: new Date(Date.now() - 18000000).toISOString(),
    item_105_flag: false,
    item_502_flag: true,
    items_detected: ['Item 5.02'],
    title: 'Palo Alto Networks ($PANW) Item 5.02 C-Suite Shift Disclosure',
    summary_text: 'Item 5.02 Executive Transition. Announced retirement of Vice President & Chief Information Officer. Executive search initiated.',
    raw_html_url: 'https://www.sec.gov/Archives/edgar/data/1327468/000132746826000055/index.htm'
  }
];

async function seed() {
  console.log('[Watchpost HQ] Inserting sample companies and 8-K filings into Supabase...');

  for (const comp of SAMPLE_COMPANIES) {
    const res = await fetch(`${supabaseUrl}/rest/v1/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(comp)
    });
  }

  let saved = 0;
  for (const filing of SAMPLE_FILINGS) {
    const res = await fetch(`${supabaseUrl}/rest/v1/filings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(filing)
    });
    
    if (res.status === 201 || res.status === 200 || res.status === 204) {
      saved++;
    } else {
      const errText = await res.text();
      console.error('[Supabase Insert Error]:', res.status, errText);
    }
  }

  console.log(`[Watchpost HQ] Seeding complete. Successfully inserted ${saved} 8-K filings into Supabase database!`);
}

seed();
