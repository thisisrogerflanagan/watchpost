import { SignalAlertDispatcher, SignalAlert } from './signalAlertDispatcher';

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
    const dispatcher = new SignalAlertDispatcher();
    return dispatcher.formatSlackBlockKit(data);
  }

  public static async sendWebhookAlert(webhookUrl: string, data: SlackAlertData): Promise<boolean> {
    const dispatcher = new SignalAlertDispatcher({ slackWebhookUrl: webhookUrl });
    return dispatcher.dispatchSlack(data);
  }
}
