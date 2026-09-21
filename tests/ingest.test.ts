import { describe, it, expect } from 'vitest';
import { SECFeedIngestionEngine, SEC_HEADERS, cleanSummaryText } from '../lib/secFeedIngestionEngine';
import fs from 'fs';
import path from 'path';

describe('CyberSec-8K SEC EDGAR Ingestion Engine (TDD Suite)', () => {
  const engine = new SECFeedIngestionEngine();

  it('should include compliant SEC User-Agent header', () => {
    expect(SEC_HEADERS['User-Agent']).toContain('contact@watchposthq.com');
    expect(SEC_HEADERS['User-Agent']).not.toContain('axios');
  });

  it('should clean HTML entities and EDGAR metadata header from summary text', () => {
    const dirty = '&lt;b&gt;Filed:&lt;/b&gt; 2026-09-18 &lt;b&gt;AccNo:&lt;/b&gt; 0001069202-26-000091 &lt;b&gt;Size:&lt;/b&gt; 256 KB &lt;br&gt;Item 5.02: Departure of Directors or Certain Officers; Election of Directors &lt;br&gt;Item 9.01: Financial Statements and Exhibits';
    const cleaned = cleanSummaryText(dirty);

    expect(cleaned).not.toContain('&lt;b&gt;');
    expect(cleaned).not.toContain('Filed:');
    expect(cleaned).not.toContain('AccNo:');
    expect(cleaned).not.toContain('Size:');
    expect(cleaned).toContain('Item 5.02: Departure of Directors or Certain Officers');
    expect(cleaned).toContain('Item 9.01: Financial Statements and Exhibits');
  });

  it('should correctly parse Item 1.05 Material Cybersecurity Breach signals from XML feed', () => {
    const xmlPath = path.join(__dirname, 'fixtures/sec_105_sample.xml');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');

    const signals = engine.parseXmlFeed(xmlContent);

    expect(signals.length).toBe(2);

    const breachSignal = signals.find(s => s.cik === '0001535527');
    expect(breachSignal).toBeDefined();
    expect(breachSignal?.companyName).toBe('CROWDSTRIKE HOLDINGS, INC.');
    expect(breachSignal?.isItem105).toBe(true);
    expect(breachSignal?.isItem502).toBe(false);
    expect(breachSignal?.summaryText).toContain('Item 1.05 Material Cybersecurity Incident');
  });

  it('should correctly parse Item 5.02 C-Suite Executive Transition signals from XML feed', () => {
    const xmlPath = path.join(__dirname, 'fixtures/sec_105_sample.xml');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');

    const signals = engine.parseXmlFeed(xmlContent);

    const execSignal = signals.find(s => s.cik === '0000789019');
    expect(execSignal).toBeDefined();
    expect(execSignal?.companyName).toBe('MICROSOFT CORP');
    expect(execSignal?.isItem502).toBe(true);
    expect(execSignal?.summaryText).toContain('Item 5.02 Departure of Directors');
  });

  it('should filter out routine non-breach 8-K filings', () => {
    const xmlPath = path.join(__dirname, 'fixtures/sec_105_sample.xml');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');

    const signals = engine.parseXmlFeed(xmlContent);

    const routineSignal = signals.find(s => s.cik === '0000123456');
    expect(routineSignal).toBeUndefined();
  });
});
