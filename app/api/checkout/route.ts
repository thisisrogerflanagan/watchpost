import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { priceId, email } = await req.json();

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe API key is not configured.' },
        { status: 500 }
      );
    }

    // Direct Stripe API REST call (100% dependency-free & zero type errors)
    const targetPriceId = priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || 'prod_VIUfQQaf8yf5f7';
    const origin = req.headers.get('origin') || 'https://watchposthq.com';

    const params = new URLSearchParams();
    params.append('payment_method_types[]', 'card');
    params.append('mode', 'subscription');
    params.append('line_items[0][price]', targetPriceId);
    params.append('line_items[0][quantity]', '1');
    params.append('subscription_data[trial_period_days]', '7');
    params.append('success_url', `${origin}/feed?session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${origin}/#pricing`);
    if (email) {
      params.append('customer_email', email);
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await stripeRes.json();

    if (data.url) {
      return NextResponse.json({ url: data.url });
    } else {
      console.error('[Stripe API Error]:', data);
      return NextResponse.json({ error: data.error?.message || 'Failed to create checkout session' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[Stripe Route Catch Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
