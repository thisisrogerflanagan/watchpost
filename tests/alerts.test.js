const test = require('node:test');
const assert = require('node:assert');
const { SignalAlertDispatcher } = require('../lib/signalAlertDispatcher');

test('Slack Block Kit Payload Generator for Item 1.05 Breach', () => {
  const dispatcher = new SignalAlertDispatcher();
  const payload = dispatcher.formatSlackBlockKit({
    ticker: 'CRWD',
    companyName: 'CrowdStrike Holdings',
    itemType: 'Item 1.05',
    summary: 'Material cloud breach identified',
    secUrl: 'https://sec.gov/105',
    filingDate: '2026-09-20T14:15:00Z'
  });

  assert.strictEqual(payload.blocks[0].text.text.includes('🚨 Watchpost HQ Alert: CrowdStrike Holdings ($CRWD)'), true);
  assert.strictEqual(payload.blocks[1].text.text.includes('Material Cybersecurity Incident'), true);
  assert.strictEqual(payload.blocks[2].fields[0].text, '*Ticker:* $CRWD');
});

test('Resend Email HTML Generator for Item 5.02 Executive Transition', () => {
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

  assert.strictEqual(html.includes('#2563eb'), true); // Blue badge for Item 5.02
  assert.strictEqual(html.includes('SIGNAL: EXECUTIVE C-SUITE TRANSITION (ITEM 5.02)'), true);
  assert.strictEqual(html.includes('Microsoft Corp ($MSFT)'), true);
});
