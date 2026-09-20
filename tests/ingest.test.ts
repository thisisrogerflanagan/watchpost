import { describe, it, expect } from 'vitest';
import { SECIngestionEngine, SEC_HEADERS } from '../scripts/ingest-sec';
import fs from 'fs';
import path from 'path';

describe('CyberSec-8K SEC EDGAR Ingestion Engine (TDD Suite)', () => {
  const engine = new SECIngestionEngine();

  it('should include compliant SEC User-Agent header', () => {
    expect(SEC_HEADERS['User-Agent']).toContain('contact@cybersec8k-radar.com');
    expect(SEC_HEADERS['User-Agent']).not.toContain('axios');
  });

  it('should correctly parse Item 1.05 Material Cybersecurity Breach signals from XML feed', () => {
    const xmlPath = path.join(__dirname, 'fixtures/sec_105_sample.xml');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');

    const signals = engine.parseXmlFeed(xmlContent);

    // Out of 3 entries in fixture, 2 are high-value signals (1.05 and 5.02), 1 is routine noise
    expect(signals.length).toBe(2);

    // Verify CrowdStrike Item 1.05 Breach Signal
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

    // Verify Microsoft Item 5.02 Executive Signal
    const execSignal = signals.find(s => s.cik === '0000789019');
    expect(execSignal).toBeDefined();
    expect(execSignal?.companyName).toBe('MICROSOFT CORP');
    expect(execSignal?.isItem502).toBe(true);
    expect(execSignal?.summaryText).toContain('Item 5.02 Departure of Directors');
  });

  it('should filter out routine non-breach 8-K filings (e.g. Item 2.02 Earnings)', () => {
    const xmlPath = path.join(__dirname, 'fixtures/sec_105_sample.xml');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');

    const signals = engine.parseXmlFeed(xmlContent);

    // Routine ACME Corp (CIK 0000123456) should be filtered out completely
    const routineSignal = signals.find(s => s.cik === '0000123456');
    expect(routineSignal).toBeUndefined();
  });
});
