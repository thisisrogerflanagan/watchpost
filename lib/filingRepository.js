class FilingRepository {
  constructor(options = {}) {
    this.url = options.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bfebpgfguqkciohauetg.supabase.co';
    this.key = options.supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_724z32yG9Y1t10fLRkhWjg_V_504oxl';
  }

  async getLatestFilings(limit = 50) {
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

  async getFilingsByTicker(ticker, limit = 20) {
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

async function getLatestFilings(limit) {
  return defaultRepository.getLatestFilings(limit);
}

async function getFilingsByTicker(ticker, limit) {
  return defaultRepository.getFilingsByTicker(ticker, limit);
}

module.exports = {
  FilingRepository,
  getLatestFilings,
  getFilingsByTicker
};
