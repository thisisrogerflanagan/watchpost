const test = require('node:test');
const assert = require('node:assert');

// Mock Slack Service Format Test
function formatSlackBlockKit(data) {
  const is105 = data.itemType === 'Item 1.05';
  const emoji = is105 ? '🚨' : '👔';
  const titleText = is105 
    ? '*SEC 8-K Item 1.05: Material Cybersecurity Incident*'
    : '*SEC 8-K Item 5.02: C-Suite Executive Transition*';

  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} CyberSec-8K Alert: ${data.companyName} ($${data.ticker.toUpperCase()})`,
          emoji: true
        }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: titleText }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Ticker:* $${data.ticker.toUpperCase()}` },
          { type: 'mrkdwn', text: `*Filing Time:* ${new Date(data.filingDate).toUTCString()}` }
        ]
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Filing Summary:*\n>${data.summary}` }
      }
    ]
  };
}

// Mock Resend Email HTML Generator Test
function generateEmailHtml(payload) {
  const isBreach = payload.itemType === 'Item 1.05';
  const badgeColor = isBreach ? '#dc2626' : '#2563eb';
  return `
    <div class="badge" style="background-color: ${badgeColor}">
      ${isBreach ? 'ITEM 1.05 BREACH' : 'ITEM 5.02 SHIFT'}
    </div>
    <h1>${payload.companyName} ($${payload.ticker})</h1>
    <p>${payload.summary}</p>
  `;
}

test('Slack Block Kit Payload Generator for Item 1.05 Breach', () => {
  const payload = formatSlackBlockKit({
    ticker: 'CRWD',
    companyName: 'CrowdStrike Holdings',
    itemType: 'Item 1.05',
    summary: 'Material cloud breach identified',
    secUrl: 'https://sec.gov/105',
    filingDate: '2026-09-20T14:15:00Z'
  });

  assert.strictEqual(payload.blocks[0].text.text.includes('🚨 CyberSec-8K Alert: CrowdStrike Holdings ($CRWD)'), true);
  assert.strictEqual(payload.blocks[1].text.text.includes('Material Cybersecurity Incident'), true);
  assert.strictEqual(payload.blocks[2].fields[0].text, '*Ticker:* $CRWD');
});

test('Resend Email HTML Generator for Item 5.02 Executive Transition', () => {
  const html = generateEmailHtml({
    toEmail: 'test@irfirm.com',
    ticker: 'MSFT',
    companyName: 'Microsoft Corp',
    itemType: 'Item 5.02',
    summary: 'New CISO appointed',
    secUrl: 'https://sec.gov/502',
    appUrl: 'https://cybersec8k.com',
    filingDate: '2026-09-20T13:40:00Z'
  });

  assert.strictEqual(html.includes('#2563eb'), true); // Blue badge for Item 5.02
  assert.strictEqual(html.includes('ITEM 5.02 SHIFT'), true);
  assert.strictEqual(html.includes('Microsoft Corp ($MSFT)'), true);
});
