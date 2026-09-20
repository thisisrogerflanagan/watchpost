const https = require('https');

const SEC_HEADERS = {
  'User-Agent': 'WatchpostHQ-Radar/1.0 (contact@watchposthq.com)',
  'Accept-Encoding': 'gzip, deflate',
  'Host': 'www.sec.gov'
};

const supabaseUrl = 'https://bfebpgfguqkciohauetg.supabase.co';
const supabaseKey = 'sb_publishable_724z32yG9Y1t10fLRkhWjg_V_504oxl';

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    });
    req.on('error', (err) => reject(err));
  });
}

function parseEntryBlock(entryXml) {
  const titleMatch = entryXml.match(/<title[^>]*>(.*?)<\/title>/s);
  const summaryMatch = entryXml.match(/<summary[^>]*>(.*?)<\/summary>/s);
  const linkMatch = entryXml.match(/href="(.*?)"/);
  const idMatch = entryXml.match(/<id>(.*?)<\/id>/);
  const updatedMatch = entryXml.match(/<updated>(.*?)<\/updated>/);

  const title = titleMatch ? titleMatch[1].trim() : '';
  const summary = summaryMatch ? summaryMatch[1].trim() : '';
  const href = linkMatch ? linkMatch[1] : '';

  const cikMatch = title.match(/\((\d{10})\)/);
  if (!cikMatch) return null;

  const cik = cikMatch[1];
  const accessionMatch = href.match(/\/data\/\d+\/(\d{18})\//) || (idMatch && idMatch[1].match(/(\d{10}-\d{2}-\d{6})/));
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
    filingDate: updatedMatch ? updatedMatch[1] : new Date().toISOString(),
    itemsDetected,
    isItem105,
    isItem502,
    filingUrl: href || `https://www.sec.gov/edgar/browse/?CIK=${cik}`,
    summaryText: summary
  };
}

async function postToSupabase(table, payload) {
  const url = `${supabaseUrl}/rest/v1/${table}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

async function run() {
  console.log('[Watchpost HQ] Connecting to SEC EDGAR Atom RSS feed...');
  const rssUrl = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&company=&dateb=&owner=include&start=0&count=100&output=atom';
  
  try {
    const xmlContent = await fetchUrl(rssUrl, SEC_HEADERS);
    const entryBlocks = xmlContent.split('<entry>').slice(1);
    const extractedSignals = [];

    for (const block of entryBlocks) {
      const entryXml = block.split('</entry>')[0];
      const signal = parseEntryBlock(entryXml);
      if (signal && (signal.isItem105 || signal.isItem502)) {
        extractedSignals.push(signal);
      }
    }

    console.log(`[Watchpost HQ] Scanned 100 recent 8-Ks from SEC. Found ${extractedSignals.length} high-value signals (Item 1.05 / 5.02).`);

    let savedCount = 0;
    for (const signal of extractedSignals) {
      // 1. Save company
      await postToSupabase('companies', {
        cik: signal.cik,
        company_name: signal.companyName,
        is_active: true,
        updated_at: new Date().toISOString()
      });

      // 2. Save filing
      const ok = await postToSupabase('filings', {
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
      });

      if (ok) savedCount++;
    }

    console.log(`[Watchpost HQ] Processed signals. Successfully saved ${savedCount} signals into Supabase!`);
  } catch (err) {
    console.error('[Watchpost HQ Error]:', err.message);
  }
}

run();
