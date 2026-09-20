const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const { createClient } = require('@supabase/supabase-js');

const SEC_HEADERS = {
  'User-Agent': process.env.SEC_USER_AGENT || 'WatchpostHQ-Radar/1.0 (contact@watchposthq.com)',
  'Accept-Encoding': 'gzip, deflate',
  'Host': 'www.sec.gov'
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bfebpgfguqkciohauetg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_724z32yG9Y1t10fLRkhWjg_V_504oxl';
const supabase = createClient(supabaseUrl, supabaseKey);

class SECIngestionEngine {
  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  parseXmlFeed(xmlContent) {
    const parsedXml = this.parser.parse(xmlContent);
    const entries = Array.isArray(parsedXml.feed?.entry)
      ? parsedXml.feed.entry
      : parsedXml.feed?.entry
      ? [parsedXml.feed.entry]
      : [];

    const extractedSignals = [];

    for (const entry of entries) {
      const signal = this.parseEntry(entry);
      if (signal && (signal.isItem105 || signal.isItem502)) {
        extractedSignals.push(signal);
      }
    }

    return extractedSignals;
  }

  parseEntry(entry) {
    const title = entry.title || '';
    const summary = entry.summary || '';
    
    let href = '';
    if (Array.isArray(entry.link)) {
      href = entry.link[0]?.['@_href'] || '';
    } else if (entry.link) {
      href = entry.link['@_href'] || '';
    }

    const cikMatch = title.match(/\((\d{10})\)/);
    const accessionMatch = href.match(/\/data\/\d+\/(\d{18})\//) || (entry.id && entry.id.match(/(\d{10}-\d{2}-\d{6})/));

    if (!cikMatch) return null;

    const cik = cikMatch[1];
    const accessionNumber = accessionMatch ? accessionMatch[1].replace(/-/g, '') : `${cik}-${Date.now()}`;

    const isItem105 = /Item\s+1\.05/i.test(summary) || /Cybersecurity Incident/i.test(summary) || /Item\s+1\.05/i.test(title);
    const isItem502 = /Item\s+5\.02/i.test(summary) || /Departure of Directors/i.test(summary) || /Appointment of Certain Officers/i.test(summary) || /Item\s+5\.02/i.test(title);

    const itemsDetected = [];
    if (isItem105) itemsDetected.push('Item 1.05');
    if (isItem502) itemsDetected.push('Item 5.02');

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

  async fetchLiveEDGARFeed() {
    const rssUrl = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&company=&dateb=&owner=include&start=0&count=100&output=atom';
    
    const response = await axios.get(rssUrl, { headers: SEC_HEADERS, timeout: 10000 });
    return this.parseXmlFeed(response.data);
  }

  async saveSignalsToSupabase(signals) {
    let savedCount = 0;
    for (const signal of signals) {
      await supabase.from('companies').upsert({
        cik: signal.cik,
        company_name: signal.companyName,
        is_active: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'cik' });

      const { error } = await supabase.from('filings').upsert({
        accession_number: signal.accessionNumber,
        cik: signal.cik,
        form_type: '8-K',
        filing_date: signal.filingDate,
        item_105_flag: signal.isItem105,
        item_502_flag: signal.isItem502,
        items_detected: signal.itemsDetected,
        title: `${signal.companyName} (${signal.isItem105 ? 'Item 1.05 Cyber Incident' : 'Item 5.02 C-Suite Shift'})`,
        summary_text: signal.summaryText,
        raw_html_url: signal.filingUrl
      }, { onConflict: 'accession_number' });

      if (!error) savedCount++;
      else console.error('[Supabase Error]:', error.message);
    }
    return savedCount;
  }
}

async function run() {
  const engine = new SECIngestionEngine();
  console.log('[Watchpost HQ] Fetching live 8-K filings from SEC EDGAR...');
  
  try {
    const signals = await engine.fetchLiveEDGARFeed();
    console.log(`[Watchpost HQ] Scanned 100 recent 8-Ks. Found ${signals.length} high-value signals (Item 1.05 / 5.02).`);
    
    if (signals.length > 0) {
      const saved = await engine.saveSignalsToSupabase(signals);
      console.log(`[Watchpost HQ] Successfully saved ${saved} live filing signals into Supabase!`);
    } else {
      console.log('[Watchpost HQ] No new Item 1.05 or 5.02 signals in the most recent 100 8-K batch.');
    }
  } catch (err) {
    console.error('[Watchpost HQ Live Ingest Error]:', err.message);
  }
}

run();
