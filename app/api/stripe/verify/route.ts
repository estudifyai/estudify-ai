import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });

    const { sessionId } = await request.json();
    if (!sessionId) return NextResponse.json({ error: "Falta sessionId." }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" || session.metadata?.userId !== user.id) {
      return NextResponse.json({ error: "Pago no verificable." }, { status: 400 });
    }

    const plan = session.metadata?.plan === "team" ? "team" : "pro";

    await supabase.from("user_plans").upsert(
      {
        user_id: user.id,
        plan,
        status: "active",
        stripe_customer_id: (session.customer as string) || null,
        stripe_subscription_id: (session.subscription as string) || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    return NextResponse.json({ plan });
  } catch (e: any) {
    console.error("Verify error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
