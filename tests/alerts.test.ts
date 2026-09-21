import { describe, it, expect } from 'vitest';
import { SignalAlertDispatcher } from '../lib/signalAlertDispatcher';

describe('SignalAlertDispatcher', () => {
  it('Slack Block Kit Payload Generator for Item 1.05 Breach', () => {
    const dispatcher = new SignalAlertDispatcher();
    const payload = dispatcher.formatSlackBlockKit({
      ticker: 'CRWD',
      companyName: 'CrowdStrike Holdings',
      itemType: 'Item 1.05',
      summary: 'Material cloud breach identified',
      secUrl: 'https://sec.gov/105',
      filingDate: '2026-09-20T14:15:00Z'
    });

    expect(payload.blocks[0].text.text).toContain('🚨 Watchpost HQ Alert: CrowdStrike Holdings ($CRWD)');
    expect(payload.blocks[1].text.text).toContain('Material Cybersecurity Incident');
    expect(payload.blocks[2].fields[0].text).toBe('*Ticker:* $CRWD');
  });

  it('Resend Email HTML Generator for Item 5.02 Executive Transition', () => {
    const dispatcher = new SignalAlertDispatcher();
    const html = dispatcher.formatResendHtml({
      toEmail: 'test@irfirm.com',
      ticker: 'MSFT',
      companyName: 'Microsoft Corp',
      itemType: 'Item 5.02',
      summary: 'New CISO appointed',
      secUrl: 'https://sec.gov/502',
      appUrl: 'https://watchposthq.com',
      filingDate: '2026-09-20T13:40:00Z'
    });

    expect(html).toContain('#2563eb'); // Blue badge for Item 5.02
    expect(html).toContain('SIGNAL: EXECUTIVE C-SUITE TRANSITION (ITEM 5.02)');
    expect(html).toContain('Microsoft Corp ($MSFT)');
  });
});
