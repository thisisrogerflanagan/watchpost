const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { SECFeedIngestionEngine, SEC_HEADERS, cleanSummaryText } = require('../lib/secFeedIngestionEngine');

test('SEC User-Agent Header Compliance', () => {
  assert.ok(SEC_HEADERS['User-Agent'].includes('contact@watchposthq.com'));
  assert.strictEqual(SEC_HEADERS['User-Agent'].includes('axios'), false);
});

test('Clean HTML entities and EDGAR metadata header from summary text', () => {
  const dirty = '&lt;b&gt;Filed:&lt;/b&gt; 2026-09-18 &lt;b&gt;AccNo:&lt;/b&gt; 0001069202-26-000091 &lt;b&gt;Size:&lt;/b&gt; 256 KB &lt;br&gt;Item 5.02: Departure of Directors or Certain Officers; Election of Directors &lt;br&gt;Item 9.01: Financial Statements and Exhibits';
  const cleaned = cleanSummaryText(dirty);
  
  assert.strictEqual(cleaned.includes('&lt;b&gt;'), false);
  assert.strictEqual(cleaned.includes('Filed:'), false);
  assert.strictEqual(cleaned.includes('AccNo:'), false);
  assert.strictEqual(cleaned.includes('Size:'), false);
  assert.ok(cleaned.includes('Item 5.02: Departure of Directors or Certain Officers'));
  assert.ok(cleaned.includes('Item 9.01: Financial Statements and Exhibits'));
});

test('Parse Item 1.05 Material Cybersecurity Incident from XML Feed', () => {
  const xmlPath = path.join(__dirname, 'fixtures/sec_105_sample.xml');
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  const engine = new SECFeedIngestionEngine();
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

  const engine = new SECFeedIngestionEngine();
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

  const engine = new SECFeedIngestionEngine();
  const signals = engine.parseXmlFeed(xmlContent);

  const routineSignal = signals.find(s => s.cik === '0000123456');
  assert.strictEqual(routineSignal, undefined);
});
