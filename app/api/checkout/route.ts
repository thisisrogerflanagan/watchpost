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

    // Dynamic import to support Server Actions / Edge API routes
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20' as any
    });

    // Create Stripe Checkout session with credit-card-upfront 7-day trial
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email || undefined,
      line_items: [
        {
          price: priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
          quantity: 1
        }
      ],
      subscription_data: {
        trial_period_days: 7 // 7-day free trial requirement
      },
      success_url: `${req.headers.get('origin') || 'https://watchposthq.com'}/feed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || 'https://watchposthq.com'}/#pricing`
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe Checkout Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
