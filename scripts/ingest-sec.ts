import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import pLimit from 'p-limit';
import { createClient } from '@supabase/supabase-js';

// SEC EDGAR Limits: Max 10 requests per second per IP
// Concurrency cap at 8 to remain safely below limit
const secLimit = pLimit(8);

export const SEC_HEADERS = {
  'User-Agent': 'CyberSec8K-Radar/1.0 (contact@cybersec8k-radar.com)',
  'Accept-Encoding': 'gzip, deflate',
  'Host': 'www.sec.gov'
};

export interface SECAtomEntry {
  title?: string;
  link?: { '@_href'?: string } | Array<{ '@_href'?: string }>;
  updated?: string;
  summary?: string;
  id?: string;
}

export interface ParsedFilingSignal {
  accessionNumber: string;
  cik: string;
  companyName: string;
  filingDate: string;
  itemsDetected: string[];
  isItem105: boolean; // Material Cybersecurity Incident
  isItem502: boolean; // C-Suite Departure/Appointment
  filingUrl: string;
  summaryText: string;
}

export class SECIngestionEngine {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  public parseXmlFeed(xmlContent: string): ParsedFilingSignal[] {
    const parsedXml = this.parser.parse(xmlContent);
    const entries: SECAtomEntry[] = Array.isArray(parsedXml.feed?.entry)
      ? parsedXml.feed.entry
      : parsedXml.feed?.entry
      ? [parsedXml.feed.entry]
      : [];

    const extractedSignals: ParsedFilingSignal[] = [];

    for (const entry of entries) {
      const signal = this.parseEntry(entry);
      if (signal && (signal.isItem105 || signal.isItem502)) {
        extractedSignals.push(signal);
      }
    }

    return extractedSignals;
  }

  public parseEntry(entry: SECAtomEntry): ParsedFilingSignal | null {
    const title = entry.title || '';
    const summary = entry.summary || '';
    
    let href = '';
    if (Array.isArray(entry.link)) {
      href = entry.link[0]?.['@_href'] || '';
    } else if (entry.link) {
      href = entry.link['@_href'] || '';
    }

    // Extract CIK number (Padded 10 digits)
    const cikMatch = title.match(/\((\d{10})\)/);
    const accessionMatch = href.match(/\/data\/\d+\/(\d{18})\//) || entry.id?.match(/(\d{10}-\d{2}-\d{6})/);

    if (!cikMatch) return null;

    const cik = cikMatch[1];
    const accessionNumber = accessionMatch ? accessionMatch[1].replace(/-/g, '') : `${cik}-${Date.now()}`;

    // Item 1.05: Material Cybersecurity Incidents
    const isItem105 = /Item\s+1\.05/i.test(summary) || /Cybersecurity Incident/i.test(summary) || /Item\s+1\.05/i.test(title);
    
    // Item 5.02: Departure of Directors or Officers; Appointment of Certain Officers
    const isItem502 = /Item\s+5\.02/i.test(summary) || /Departure of Directors/i.test(summary) || /Appointment of Certain Officers/i.test(summary) || /Item\s+5\.02/i.test(title);

    const itemsDetected: string[] = [];
    if (isItem105) itemsDetected.push('Item 1.05');
    if (isItem502) itemsDetected.push('Item 5.02');

    // Extract Company Name
    const companyNameMatch = title.match(/8-K\s+-\s+(.*?)\s+\(\d{10}\)/);
    const companyName = companyNameMatch ? companyNameMatch[1].trim() : 'Unknown Filer';

    return {
      accessionNumber,
      cik,
      companyName,
      filingDate: entry.updated || new Date().toISOString(),
      itemsDetected,
      isItem105,
      isItem502,
      filingUrl: href || `https://www.sec.gov/edgar/browse/?CIK=${cik}`,
      summaryText: summary
    };
  }

  public async fetchLiveEDGARFeed(): Promise<ParsedFilingSignal[]> {
    const rssUrl = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&company=&dateb=&owner=include&start=0&count=100&output=atom';
    
    const response = await secLimit(() =>
      axios.get(rssUrl, { headers: SEC_HEADERS, timeout: 10000 })
    );

    return this.parseXmlFeed(response.data);
  }
}

// Execution block when run as script
if (require.main === module) {
  const engine = new SECIngestionEngine();
  console.log('[SEC Ingestion] Starting live 8-K polling worker...');
  
  engine.fetchLiveEDGARFeed()
    .then(signals => {
      console.log(`[SEC Ingestion] Successfully scanned 100 recent 8-Ks. Found ${signals.length} high-value signals (Item 1.05 / 5.02):`);
      console.dir(signals, { depth: null });
    })
    .catch(err => {
      console.error('[SEC Ingestion Error]:', err.message);
    });
}
