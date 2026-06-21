import { NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();
    const { artwork } = body; 

    
    const userSession = await auth.api.getSession({
        headers: await headers()
    });

    const user = userSession?.user;

    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized! Please login first." }, { status: 401 });
    }

    
    if (user.role !== "buyer") {
      return NextResponse.json(
        { error: `Access denied! Your role is '${user.role}'. Only users with the 'buyer' role can purchase artworks.` }, 
        { status: 403 }
      );
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
              name: artwork.title,
              images: artwork.imageUrl ? [artwork.imageUrl] : [],
            },
            unit_amount: Math.round(artwork.price * 100), 
          },
          quantity: 1,
        },
      ],
      metadata: {
        artworkId: artwork._id,
        userId: user.id || user._id, 
        userRole: user.role 
      },
      mode: 'payment', 
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&artworkId=${artwork._id}&userId=${user.id || user._id}`,
      cancel_url: `${origin}/artwork/${artwork._id}`, 
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}

export async function GET(){
    return NextResponse.json({message: "Hello from Stripe payment api route"})
}