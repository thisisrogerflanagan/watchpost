import { NextResponse } from 'next/server';
import { dispatchSignalAlert } from '@/lib/signalAlertDispatcher';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticker, companyName, itemType, summary, secUrl, filingDate, toEmail } = body;

    if (!ticker || !itemType) {
      return NextResponse.json({ error: 'Missing required parameters (ticker, itemType)' }, { status: 400 });
    }

    const result = await dispatchSignalAlert({
      ticker,
      companyName: companyName || ticker,
      itemType,
      summary: summary || 'No summary provided',
      secUrl: secUrl || 'https://www.sec.gov',
      filingDate: filingDate || new Date().toISOString(),
      toEmail
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
