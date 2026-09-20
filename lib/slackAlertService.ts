import axios from 'axios';

export interface SlackAlertData {
  ticker: string;
  companyName: string;
  itemType: 'Item 1.05' | 'Item 5.02';
  summary: string;
  secUrl: string;
  filingDate: string;
}

export class SlackAlertService {
  public static formatBlockKitPayload(data: SlackAlertData) {
    const is105 = data.itemType === 'Item 1.05';
    const emoji = is105 ? '🚨' : '👔';
    const titleText = is105 
      ? `*SEC 8-K Item 1.05: Material Cybersecurity Incident*`
      : `*SEC 8-K Item 5.02: C-Suite Executive Transition*`;

    return {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${emoji} Watchpost HQ Alert: ${data.companyName} ($${data.ticker.toUpperCase()})`,
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: titleText
          }
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
          text: {
            type: 'mrkdwn',
            text: `*Filing Summary:*\n>${data.summary}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Watchpost Analysis' },
              style: is105 ? 'danger' : 'primary',
              url: `https://watchposthq.com/sec/company/${data.ticker.toLowerCase()}`
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Official SEC EDGAR File' },
              url: data.secUrl
            }
          ]
        }
      ]
    };
  }

  public static async sendWebhookAlert(webhookUrl: string, data: SlackAlertData): Promise<boolean> {
    const payload = this.formatBlockKitPayload(data);
    const response = await axios.post(webhookUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    return response.status === 200;
  }
}
