import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const PRICES: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO!,
  team: process.env.STRIPE_PRICE_TEAM!,
};

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, email } = await request.json();

    if (!plan || !PRICES[plan]) {
      return NextResponse.json({ error: "Plan inválido." }, { status: 400 });
    }

    if (!userId || !email) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const baseUrl = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: PRICES[plan],
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        plan,
      },
      success_url: `${baseUrl}/app/account?payment=success`,
      cancel_url: `${baseUrl}/app/account?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Error creando sesión de pago." },
      { status: 500 }
    );
  }
}
