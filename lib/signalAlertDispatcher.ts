import { Resend } from 'resend';

export interface SignalAlert {
  ticker: string;
  companyName: string;
  itemType: 'Item 1.05' | 'Item 5.02';
  summary: string;
  secUrl: string;
  filingDate: string;
  toEmail?: string;
  appUrl?: string;
}

export interface AlertDispatchResult {
  slackSuccess: boolean;
  emailSuccess: boolean;
  errors: string[];
}

export interface DispatcherOptions {
  slackWebhookUrl?: string;
  resendApiKey?: string;
  defaultEmail?: string;
  appUrl?: string;
}

export class SignalAlertDispatcher {
  private slackWebhookUrl: string;
  private resendClient: Resend | null;
  private defaultEmail: string;
  private appUrl: string;

  constructor(options: DispatcherOptions = {}) {
    this.slackWebhookUrl = options.slackWebhookUrl || process.env.SLACK_WEBHOOK_URL || '';
    
    const apiKey = options.resendApiKey || process.env.RESEND_API_KEY;
    this.resendClient = apiKey ? new Resend(apiKey) : null;
    
    this.defaultEmail = options.defaultEmail || process.env.ALERT_EMAIL_RECIPIENT || 'security-alerts@watchposthq.com';
    this.appUrl = options.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://watchposthq.com';
  }

  public formatSlackBlockKit(alert: SignalAlert) {
    const is105 = alert.itemType === 'Item 1.05';
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
            text: `${emoji} Watchpost HQ Alert: ${alert.companyName} ($${alert.ticker.toUpperCase()})`,
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
            { type: 'mrkdwn', text: `*Ticker:* $${alert.ticker.toUpperCase()}` },
            { type: 'mrkdwn', text: `*Filing Time:* ${new Date(alert.filingDate).toUTCString()}` }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Filing Summary:*\n>${alert.summary}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Watchpost Analysis' },
              style: is105 ? 'danger' : 'primary',
              url: `${this.appUrl}/sec/company/${alert.ticker.toLowerCase()}`
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Official SEC EDGAR File' },
              url: alert.secUrl
            }
          ]
        }
      ]
    };
  }

  public formatResendHtml(alert: SignalAlert): string {
    const isBreach = alert.itemType === 'Item 1.05';
    const badgeColor = isBreach ? '#dc2626' : '#2563eb';
    const badgeText = isBreach ? 'CRITICAL: CYBERSECURITY BREACH DISCLOSURE (ITEM 1.05)' : 'SIGNAL: EXECUTIVE C-SUITE TRANSITION (ITEM 5.02)';
    const companyTicker = alert.ticker.toUpperCase();
    const appLink = `${this.appUrl}/sec/company/${alert.ticker.toLowerCase()}`;

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
            <h1 class="title">${alert.companyName} ($${companyTicker})</h1>
            <div class="subtitle">Filed SEC Form 8-K on ${new Date(alert.filingDate).toUTCString()}</div>
            <div class="summary-box">
              <strong>Watchpost HQ Extracted Regulatory Summary:</strong><br/>
              ${alert.summary}
            </div>
            <div>
              <a href="${appLink}" class="btn">View Signal Radar</a>
              <a href="${alert.secUrl}" class="btn btn-secondary">Raw SEC EDGAR File</a>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  public async dispatchSlack(alert: SignalAlert): Promise<boolean> {
    if (!this.slackWebhookUrl) return false;
    const payload = this.formatSlackBlockKit(alert);
    const res = await fetch(this.slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  }

  public async dispatchEmail(alert: SignalAlert): Promise<boolean> {
    if (!this.resendClient) return false;
    const targetEmail = alert.toEmail || this.defaultEmail;
    const html = this.formatResendHtml(alert);
    const res = await this.resendClient.emails.send({
      from: 'Watchpost HQ Alerts <alerts@watchposthq.com>',
      to: [targetEmail],
      subject: `🚨 [Watchpost HQ Alert] $${alert.ticker.toUpperCase()} - ${alert.itemType}`,
      html
    });
    return Boolean(res && !res.error);
  }

  public async dispatchAlert(alert: SignalAlert): Promise<AlertDispatchResult> {
    const errors: string[] = [];
    let slackSuccess = false;
    let emailSuccess = false;

    if (this.slackWebhookUrl) {
      try {
        slackSuccess = await this.dispatchSlack(alert);
      } catch (err: any) {
        errors.push(`Slack Dispatch Error: ${err.message}`);
      }
    }

    if (this.resendClient) {
      try {
        emailSuccess = await this.dispatchEmail(alert);
      } catch (err: any) {
        errors.push(`Email Dispatch Error: ${err.message}`);
      }
    }

    return {
      slackSuccess,
      emailSuccess,
      errors
    };
  }
}

export async function dispatchSignalAlert(
  alert: SignalAlert,
  options?: DispatcherOptions
): Promise<AlertDispatchResult> {
  const dispatcher = new SignalAlertDispatcher(options);
  return dispatcher.dispatchAlert(alert);
}
