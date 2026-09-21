let XMLParser;
try {
  XMLParser = require('fast-xml-parser').XMLParser;
} catch {
  XMLParser = null;
}

const SEC_HEADERS = {
  'User-Agent': process.env.SEC_USER_AGENT || 'WatchpostHQ-Radar/1.0 (contact@watchposthq.com)',
  'Accept-Encoding': 'gzip, deflate',
  'Host': 'www.sec.gov'
};

function cleanSummaryText(rawText) {
  if (!rawText) return '';

  let text = rawText
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  text = text.replace(/<b>Filed:<\/b>.*?<b>Size:<\/b>.*?(?:<br\s*\/?>|$)/gi, '');
  text = text.replace(/Filed:.*?AccNo:.*?Size:.*?(?:<br\s*\/?>|$)/gi, '');
  text = text.replace(/<br\s*\/?>/gi, ' ').replace(/<\/?[^>]+(>|$)/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

class SECFeedIngestionEngine {
  constructor() {
    if (XMLParser) {
      this.xmlParser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
      });
    } else {
      this.xmlParser = null;
    }
  }

  parseXmlFeed(xmlContent) {
    const extractedSignals = [];

    if (this.xmlParser) {
      try {
        const parsedXml = this.xmlParser.parse(xmlContent);
        const entries = Array.isArray(parsedXml.feed?.entry)
          ? parsedXml.feed.entry
          : parsedXml.feed?.entry
          ? [parsedXml.feed.entry]
          : [];

        for (const entry of entries) {
          const title = entry.title || '';
          const summary = entry.summary || '';
          let href = '';
          if (Array.isArray(entry.link)) {
            href = entry.link[0]?.['@_href'] || '';
          } else if (entry.link) {
            href = entry.link['@_href'] || '';
          }

          const signal = this.buildSignal(title, summary, href, entry.updated, entry.id);
          if (signal && (signal.isItem105 || signal.isItem502)) {
            extractedSignals.push(signal);
          }
        }
        if (extractedSignals.length > 0) return extractedSignals;
      } catch {
        // Fall back to regex parsing below
      }
    }

    const entryBlocks = xmlContent.split('<entry>').slice(1);
    for (const block of entryBlocks) {
      const entryXml = block.split('</entry>')[0];
      const titleMatch = entryXml.match(/<title[^>]*>(.*?)<\/title>/s);
      const summaryMatch = entryXml.match(/<summary[^>]*>(.*?)<\/summary>/s);
      const linkMatch = entryXml.match(/href="(.*?)"/);
      const idMatch = entryXml.match(/<id>(.*?)<\/id>/);
      const updatedMatch = entryXml.match(/<updated>(.*?)<\/updated>/);

      const title = titleMatch ? titleMatch[1].trim() : '';
      const summary = summaryMatch ? summaryMatch[1].trim() : '';
      const href = linkMatch ? linkMatch[1] : '';

      const signal = this.buildSignal(
        title,
        summary,
        href,
        updatedMatch ? updatedMatch[1] : undefined,
        idMatch ? idMatch[1] : undefined
      );

      if (signal && (signal.isItem105 || signal.isItem502)) {
        extractedSignals.push(signal);
      }
    }

    return extractedSignals;
  }

  buildSignal(title, summary, href, updated, entryId) {
    const cikMatch = title.match(/\((\d{10})\)/);
    if (!cikMatch) return null;

    const cik = cikMatch[1];
    const accessionMatch = href.match(/\/data\/\d+\/(\d{18})\//) || (entryId && entryId.match(/(\d{10}-\d{2}-\d{6})/));
    const accessionNumber = accessionMatch ? accessionMatch[1].replace(/-/g, '') : `${cik}-${Date.now()}`;

    const isItem105 = /Item\s+1\.05/i.test(summary) || /Cybersecurity Incident/i.test(summary) || /Item\s+1\.05/i.test(title);
    const isItem502 = /Item\s+5\.02/i.test(summary) || /Departure of Directors/i.test(summary) || /Appointment of Certain Officers/i.test(summary) || /Item\s+5\.02/i.test(title);

    const itemsDetected = [];
    if (isItem105) itemsDetected.push('Item 1.05');
    if (isItem502) itemsDetected.push('Item 5.02');

    const companyNameMatch = title.match(/8-K\s+-\s+(.*?)\s+\(\d{10}\)/);
    const companyName = companyNameMatch ? companyNameMatch[1].trim() : 'Unknown Filer';

    const cleanedSummary = cleanSummaryText(summary);

    return {
      accessionNumber,
      cik,
      companyName,
      filingDate: updated || new Date().toISOString(),
      itemsDetected,
      isItem105,
      isItem502,
      filingUrl: href || `https://www.sec.gov/edgar/browse/?CIK=${cik}`,
      summaryText: cleanedSummary || summary
    };
  }

  async fetchLiveFeed(url) {
    const targetUrl = url || 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&company=&dateb=&owner=include&start=0&count=100&output=atom';
    const res = await fetch(targetUrl, { headers: SEC_HEADERS });
    if (!res.ok) {
      throw new Error(`Failed to fetch SEC RSS feed: ${res.status} ${res.statusText}`);
    }
    return res.text();
  }

  async saveSignalsToSupabase(signals, supabaseUrl, supabaseKey) {
    const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bfebpgfguqkciohauetg.supabase.co';
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_724z32yG9Y1t10fLRkhWjg_V_504oxl';

    let savedCount = 0;
    for (const signal of signals) {
      await fetch(`${url}/rest/v1/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          cik: signal.cik,
          company_name: signal.companyName,
          is_active: true,
          updated_at: new Date().toISOString()
        })
      });

      const res = await fetch(`${url}/rest/v1/filings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
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
        })
      });

      if (res.ok) savedCount++;
    }
    return savedCount;
  }
}

async function ingestLatestFilings(options = {}) {
  const engine = new SECFeedIngestionEngine();
  const xmlContent = options.feedXml || await engine.fetchLiveFeed(options.rssUrl);
  const signals = engine.parseXmlFeed(xmlContent);

  let savedCount = 0;
  if (signals.length > 0 && !options.feedXml) {
    savedCount = await engine.saveSignalsToSupabase(
      signals,
      options.supabaseUrl,
      options.supabaseKey
    );
  }

  return {
    scannedCount: signals.length,
    signals,
    savedCount
  };
}

module.exports = {
  SECFeedIngestionEngine,
  SEC_HEADERS,
  cleanSummaryText,
  ingestLatestFilings
};
