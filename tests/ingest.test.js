const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const SEC_HEADERS = {
  'User-Agent': 'CyberSec8K-Radar/1.0 (contact@cybersec8k-radar.com)',
  'Accept-Encoding': 'gzip, deflate',
  'Host': 'www.sec.gov'
};

class SECIngestionEngine {
  parseXmlFeed(xmlContent) {
    const entryBlocks = xmlContent.split('<entry>').slice(1);
    const extractedSignals = [];

    for (const block of entryBlocks) {
      const entryXml = block.split('</entry>')[0];
      const signal = this.parseEntryBlock(entryXml);
      if (signal && (signal.isItem105 || signal.isItem502)) {
        extractedSignals.push(signal);
      }
    }

    return extractedSignals;
  }

  parseEntryBlock(entryXml) {
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
}

test('SEC User-Agent Header Compliance', () => {
  assert.ok(SEC_HEADERS['User-Agent'].includes('contact@cybersec8k-radar.com'));
  assert.strictEqual(SEC_HEADERS['User-Agent'].includes('axios'), false);
});

test('Parse Item 1.05 Material Cybersecurity Incident from XML Feed', () => {
  const xmlPath = path.join(__dirname, 'fixtures/sec_105_sample.xml');
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  const engine = new SECIngestionEngine();
  const signals = engine.parseXmlFeed(xmlContent);

  assert.strictEqual(signals.length, 2);

  const breachSignal = signals.find(s => s.cik === '0001535527');
  assert.ok(breachSignal !== undefined);
  assert.strictEqual(breachSignal.companyName, 'CROWDSTRIKE HOLDINGS, INC.');
  assert.strictEqual(breachSignal.isItem105, true);
  assert.strictEqual(breachSignal.isItem502, false);
  assert.ok(breachSignal.summaryText.includes('Item 1.05 Material Cybersecurity Incident'));
});

test('Parse Item 5.02 C-Suite Executive Transition from XML Feed', () => {
  const xmlPath = path.join(__dirname, 'fixtures/sec_105_sample.xml');
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  const engine = new SECIngestionEngine();
  const signals = engine.parseXmlFeed(xmlContent);

  const execSignal = signals.find(s => s.cik === '0000789019');
  assert.ok(execSignal !== undefined);
  assert.strictEqual(execSignal.companyName, 'MICROSOFT CORP');
  assert.strictEqual(execSignal.isItem502, true);
  assert.ok(execSignal.summaryText.includes('Item 5.02 Departure of Directors'));
});

test('Filter out routine non-breach 8-K filings', () => {
  const xmlPath = path.join(__dirname, 'fixtures/sec_105_sample.xml');
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  const engine = new SECIngestionEngine();
  const signals = engine.parseXmlFeed(xmlContent);

  const routineSignal = signals.find(s => s.cik === '0000123456');
  assert.strictEqual(routineSignal, undefined);
});
