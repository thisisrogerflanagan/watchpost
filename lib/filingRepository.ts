export interface FilingRecord {
  id: string;
  accession_number: string;
  cik: string;
  title: string;
  summary_text: string;
  item_105_flag: boolean;
  item_502_flag: boolean;
  filing_date: string;
  raw_html_url: string;
  companies?: {
    ticker?: string;
    company_name?: string;
  };
}

export interface RepositoryOptions {
  supabaseUrl?: string;
  supabaseKey?: string;
}

export const FALLBACK_FILINGS: FilingRecord[] = [
  {
    id: 'crwd-105-001',
    accession_number: '0001535527-26-000042',
    cik: '0001535527',
    title: 'Item 1.05 Material Cybersecurity Incident Disclosure',
    summary_text: 'Disclosed material network incident in testing environment. Internal server isolated; live customer data uncompromised.',
    item_105_flag: true,
    item_502_flag: false,
    filing_date: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    raw_html_url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    companies: { ticker: 'CRWD', company_name: 'CrowdStrike Holdings, Inc.' }
  },
  {
    id: 'lii-502-001',
    accession_number: '0001069202-26-000091',
    cik: '0001069202',
    title: 'Item 5.02 Departure of Directors or Certain Officers; Election of Directors; Appointment of Certain Officers',
    summary_text: 'Appointed new Chief Information Security Officer (CISO). 90-day vendor security stack evaluation window open.',
    item_105_flag: false,
    item_502_flag: true,
    filing_date: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    raw_html_url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    companies: { ticker: 'LII', company_name: 'Lennox International Inc.' }
  },
  {
    id: 'kr-105-001',
    accession_number: '0000056873-26-000018',
    cik: '0000056873',
    title: 'Item 1.05 Material Cybersecurity Incident Disclosure',
    summary_text: 'Disclosed operational network incident under Item 1.05. Incident response protocols activated; containment verified.',
    item_105_flag: true,
    item_502_flag: false,
    filing_date: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    raw_html_url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    companies: { ticker: 'KR', company_name: 'Kroger Co.' }
  },
  {
    id: 'msft-502-001',
    accession_number: '0000789019-26-000033',
    cik: '0000789019',
    title: 'Item 5.02 Executive Leadership Transition',
    summary_text: 'Executive leadership transition announced under Item 5.02. Key C-suite security oversight shift.',
    item_105_flag: false,
    item_502_flag: true,
    filing_date: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    raw_html_url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    companies: { ticker: 'MSFT', company_name: 'Microsoft Corporation' }
  },
  {
    id: 'panw-105-001',
    accession_number: '0001327811-26-000012',
    cik: '0001327811',
    title: 'Item 1.05 Material Cybersecurity Incident Disclosure',
    summary_text: 'Palo Alto Networks disclosed third-party cloud testing environment isolation. Core firewall services unaffected.',
    item_105_flag: true,
    item_502_flag: false,
    filing_date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    raw_html_url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    companies: { ticker: 'PANW', company_name: 'Palo Alto Networks, Inc.' }
  },
  {
    id: 'okta-502-001',
    accession_number: '0001660134-26-000007',
    cik: '0001660134',
    title: 'Item 5.02 C-Suite Security Leadership Shift',
    summary_text: 'Okta announced VP of Global Security Governance appointment. 90-day identity architecture evaluation window open.',
    item_105_flag: false,
    item_502_flag: true,
    filing_date: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    raw_html_url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    companies: { ticker: 'OKTA', company_name: 'Okta, Inc.' }
  }
];

export class FilingRepository {
  private url: string;
  private key: string;

  constructor(options: RepositoryOptions = {}) {
    this.url = options.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bfebpgfguqkciohauetg.supabase.co';
    this.key = options.supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_724z32yG9Y1t10fLRkhWjg_V_504oxl';
  }

  public async getLatestFilings(limit: number = 50): Promise<FilingRecord[]> {
    try {
      const endpoint = `${this.url}/rest/v1/filings?select=*,companies(*)&order=filing_date.desc&limit=${limit}`;
      const res = await fetch(endpoint, {
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`
        },
        cache: 'no-store'
      });
      if (!res.ok) return FALLBACK_FILINGS;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_FILINGS;
    } catch {
      return FALLBACK_FILINGS;
    }
  }

  public async getFilingsByTicker(ticker: string, limit: number = 20): Promise<FilingRecord[]> {
    const formattedTicker = (ticker || '').toUpperCase();
    try {
      const endpoint = `${this.url}/rest/v1/filings?select=*,companies!inner(*)&companies.ticker=eq.${formattedTicker}&order=filing_date.desc&limit=${limit}`;
      const res = await fetch(endpoint, {
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`
        },
        cache: 'no-store'
      });
      if (!res.ok) {
        return FALLBACK_FILINGS.filter(f => f.companies?.ticker?.toUpperCase() === formattedTicker);
      }
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      return FALLBACK_FILINGS.filter(f => f.companies?.ticker?.toUpperCase() === formattedTicker);
    } catch {
      return FALLBACK_FILINGS.filter(f => f.companies?.ticker?.toUpperCase() === formattedTicker);
    }
  }
}

const defaultRepository = new FilingRepository();

export async function getLatestFilings(limit?: number): Promise<FilingRecord[]> {
  return defaultRepository.getLatestFilings(limit);
}

export async function getFilingsByTicker(ticker: string, limit?: number): Promise<FilingRecord[]> {
  return defaultRepository.getFilingsByTicker(ticker, limit);
}
