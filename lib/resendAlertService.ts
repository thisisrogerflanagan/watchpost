import { Resend } from 'resend';

export interface EmailAlertPayload {
  toEmail: string;
  ticker: string;
  companyName: string;
  itemType: 'Item 1.05' | 'Item 5.02';
  filingDate: string;
  summary: string;
  secUrl: string;
  appUrl: string;
}

export class ResendAlertService {
  private resend: Resend;

  constructor(apiKey?: string) {
    this.resend = new Resend(apiKey || process.env.RESEND_API_KEY || 're_mock_key');
  }

  public generateHtml(payload: EmailAlertPayload): string {
    const isBreach = payload.itemType === 'Item 1.05';
    const badgeColor = isBreach ? '#dc2626' : '#2563eb';
    const badgeText = isBreach ? 'CRITICAL: CYBERSECURITY BREACH DISCLOSURE (ITEM 1.05)' : 'SIGNAL: EXECUTIVE C-SUITE TRANSITION (ITEM 5.02)';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 24px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 24px; }
            .badge { display: inline-block; background-color: ${badgeColor}; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; margin-bottom: 16px; }
            .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0; }
            .subtitle { font-size: 14px; color: #a1a1aa; margin-bottom: 20px; }
            .summary-box { background-color: #09090b; border-left: 3px solid ${badgeColor}; padding: 14px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #d4d4d8; margin-bottom: 24px; }
            .btn { display: inline-block; background-color: #ffffff; color: #000000; font-weight: 600; font-size: 14px; text-decoration: none; padding: 10px 18px; border-radius: 6px; margin-right: 12px; }
            .btn-secondary { background-color: #27272a; color: #ffffff; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="badge">${badgeText}</div>
            <h1 class="title">${payload.companyName} ($${payload.ticker.toUpperCase()})</h1>
            <div class="subtitle">Filed SEC Form 8-K on ${new Date(payload.filingDate).toUTCString()}</div>
            <div class="summary-box">
              <strong>Watchpost HQ Extracted Regulatory Summary:</strong><br/>
              ${payload.summary}
            </div>
            <div>
              <a href="${payload.appUrl}" class="btn">View Signal Radar</a>
              <a href="${payload.secUrl}" class="btn btn-secondary">Raw SEC EDGAR File</a>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  public async sendAlertEmail(payload: EmailAlertPayload) {
    const html = this.generateHtml(payload);
    return await this.resend.emails.send({
      from: 'Watchpost HQ Alerts <alerts@watchposthq.com>',
      to: [payload.toEmail],
      subject: `🚨 [Watchpost HQ Alert] $${payload.ticker.toUpperCase()} - ${payload.itemType}`,
      html
    });
  }
}
