import { NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();
    const { plan, price } = body; 

    const userSession = await auth.api.getSession({
        headers: await headers()
    });
    const user = userSession?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "buyer") {
      return NextResponse.json({ error: "Only buyers can subscribe." }, { status: 403 });
    }

    const headersList = await headers();
    const origin = headersList.get('origin');

    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email, 
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Arthub ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
              description: plan === "premium" ? "Unlimited paintings" : "Up to 9 paintings",
            },
            unit_amount: Math.round(price * 100), 
          
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription', 
      metadata: {
        userId: user.id || user._id, 
        newPlan: plan 
      },
      success_url: `${origin}/dashboard/buyer/subscription/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}&userId=${user.id || user._id}`,
      cancel_url: `${origin}/dashboard/buyer/subscription`, 
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}