import { MetadataRoute } from 'next';
import { FilingRepository } from '../lib/filingRepository';

const POPULAR_TICKERS = [
  // Cybersecurity & Enterprise Tech
  'crwd', 'panw', 'okta', 'zs', 'net', 'ftnt', 's', 'msft', 'aapl', 'googl', 'amzn', 'tsla', 'nvda', 'meta',
  'nflx', 'amd', 'intc', 'crm', 'orcl', 'ibm', 'now', 'snow', 'ddog', 'mdb', 'pltr', 'u', 'path', 'twlo',
  'shop', 'sq', 'pypl', 'coin', 'hood', 'dis', 'cmcsa', 'nke', 'sbux', 'mcd', 'wmt', 'tgt', 'cost', 'hd',
  'low', 'bac', 'jpm', 'c', 'wfc', 'gs', 'ms', 'blk', 'schw', 'v', 'ma', 'axp', 'pfe', 'jnj', 'unh', 'abbv',
  'lly', 'mrk', 't', 'vz', 'tmus', 'cat', 'de', 'ge', 'hon', 'mmm', 'lmt', 'noc', 'ba', 'rtx', 'lii', 'kr',
  'uber', 'lyft', 'dash', 'abnb', 'bkng', 'expe', 'snap', 'pins', 'spot', 'roku', 'rblx', 'unity', 'zi',
  'zs', 'sent', 'cybr', 'rpde', 'vrns', 'tenb', 'qlys', 'feyr', 'chkp', 'avgo', 'qcom', 'mu', 'txn', 'adi',
  'amat', 'lrcx', 'klac', 'asml', 'smci', 'arm', 'dell', 'hpe', 'stx', 'wdc', 'wday', 'team', 'docu', 'zm'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchposthq.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#features`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/feed`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ];

  // Dynamic Ticker Company pSEO Pages
  const companyRoutes: MetadataRoute.Sitemap = POPULAR_TICKERS.map((ticker) => ({
    url: `${baseUrl}/sec/company/${ticker}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  // Dynamic Supabase SEC Breach Filings
  let breachRoutes: MetadataRoute.Sitemap = [];
  try {
    const repo = new FilingRepository();
    const liveFilings = await repo.getLatestFilings(200);

    if (Array.isArray(liveFilings) && liveFilings.length > 0) {
      breachRoutes = liveFilings.map((filing) => {
        const year = filing.filing_date ? new Date(filing.filing_date).getFullYear().toString() : '2026';
        const accession = filing.accession_number || filing.id;
        return {
          url: `${baseUrl}/sec/breaches/${year}/${accession}`,
          lastModified: filing.filing_date ? new Date(filing.filing_date) : new Date(),
          changeFrequency: 'never',
          priority: 0.9,
        };
      });
    }
  } catch (err) {
    console.warn('Sitemap Supabase fetch error, using sample breach fallback:', err);
  }

  // Fallback breach routes if database returns 0
  if (breachRoutes.length === 0) {
    const sampleBreaches = ['0001535527-26-000042', '0001069202-26-000091'];
    breachRoutes = sampleBreaches.map((id) => ({
      url: `${baseUrl}/sec/breaches/2026/${id}`,
      lastModified: new Date(),
      changeFrequency: 'never',
      priority: 0.9,
    }));
  }

  return [...staticRoutes, ...companyRoutes, ...breachRoutes];
}
