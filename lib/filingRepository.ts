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
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  public async getFilingsByTicker(ticker: string, limit: number = 20): Promise<FilingRecord[]> {
    try {
      const formattedTicker = ticker.toUpperCase();
      const endpoint = `${this.url}/rest/v1/filings?select=*,companies!inner(*)&companies.ticker=eq.${formattedTicker}&order=filing_date.desc&limit=${limit}`;
      const res = await fetch(endpoint, {
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`
        },
        cache: 'no-store'
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
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
