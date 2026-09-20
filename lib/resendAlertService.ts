import { SignalAlertDispatcher, SignalAlert } from './signalAlertDispatcher';

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
  private dispatcher: SignalAlertDispatcher;

  constructor(apiKey?: string) {
    this.dispatcher = new SignalAlertDispatcher({ resendApiKey: apiKey });
  }

  public generateHtml(payload: EmailAlertPayload): string {
    return this.dispatcher.formatResendHtml({
      ticker: payload.ticker,
      companyName: payload.companyName,
      itemType: payload.itemType,
      summary: payload.summary,
      secUrl: payload.secUrl,
      filingDate: payload.filingDate,
      appUrl: payload.appUrl
    });
  }

  public async sendAlertEmail(payload: EmailAlertPayload) {
    return this.dispatcher.dispatchEmail({
      ticker: payload.ticker,
      companyName: payload.companyName,
      itemType: payload.itemType,
      summary: payload.summary,
      secUrl: payload.secUrl,
      filingDate: payload.filingDate,
      toEmail: payload.toEmail,
      appUrl: payload.appUrl
    });
  }
}
