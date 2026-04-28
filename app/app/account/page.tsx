"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";
import {
  User,
  CreditCard,
  Check,
  Sparkles,
  Loader2,
  Crown,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import type { User as SupaUser } from "@supabase/supabase-js";

interface UserPlan {
  plan: string;
  status: string;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0",
    currency: "MXN",
    tag: "Plan actual",
    features: [
      "3 resúmenes al mes",
      "20 flashcards",
      "1 examen de práctica",
      "Exam Readiness básico",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "199",
    currency: "MXN / mes",
    tag: "Individual",
    features: [
      "Resúmenes ilimitados",
      "Flashcards ilimitadas",
      "Exámenes ilimitados",
      "Tutor socrático completo",
      "Readiness con desglose",
      "Generación prioritaria",
    ],
    featured: true,
  },
  {
    id: "team",
    name: "Team",
    price: "299",
    currency: "MXN / mes",
    tag: "Hasta 5 estudiantes",
    features: [
      "Todo lo de Pro",
      "Grupos compartidos",
      "Progreso grupal visible",
      "Admin simple",
    ],
  },
];

export default function AccountPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [userPlan, setUserPlan] = useState<UserPlan>({
    plan: "free",
    status: "active",
  });
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      setPaymentMessage("Pago exitoso. Tu plan se activó.");
    } else if (payment === "cancelled") {
      setPaymentMessage("Pago cancelado. No se realizó ningún cargo.");
    }
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);

      // Check plan
      const { data } = await supabase
        .from("user_plans")
        .select("plan, status")
        .eq("user_id", session.user.id)
        .single();

      if (data) {
        setUserPlan(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleCheckout = async (plan: string) => {
    if (!user) return;
    setCheckoutLoading(plan);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect a Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setPaymentMessage("Error iniciando el pago. Intenta de nuevo.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#C3F73A]" />
      </div>
    );
  }

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Estudiante";

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Mi cuenta
        </h1>
        <p className="mt-2 text-[15px] text-[#8a8a93]">
          Administra tu perfil y plan de suscripción.
        </p>
      </div>

      {/* Payment message */}
      {paymentMessage && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px] ${
            paymentMessage.includes("exitoso")
              ? "border-[#C3F73A]/20 bg-[#C3F73A]/10 text-[#C3F73A]"
              : paymentMessage.includes("cancelado")
              ? "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#8a8a93]"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {paymentMessage.includes("exitoso") ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {paymentMessage}
        </div>
      )}

      {/* Profile card */}
      <div className="mb-8 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#C3F73A] via-[#5EC8E8] to-[#8B7FD8] text-lg font-bold text-black">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[16px] font-medium text-white">{userName}</p>
            <p className="mt-0.5 text-[13px] text-[#6a6a72]">{user?.email}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Crown
              className={`h-4 w-4 ${
                userPlan.plan === "free" ? "text-[#6a6a72]" : "text-[#C3F73A]"
              }`}
            />
            <span
              className={`rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wider ${
                userPlan.plan === "free"
                  ? "bg-[rgba(255,255,255,0.05)] text-[#8a8a93]"
                  : "bg-[rgba(195,247,58,0.1)] text-[#C3F73A]"
              }`}
            >
              {userPlan.plan}
            </span>
          </div>
        </div>
      </div>

      {/* Plans */}
      <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#6a6a72]">
        Planes disponibles
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = userPlan.plan === p.id;
          return (
            <div
              key={p.id}
              className={`relative rounded-2xl p-6 ${
                p.featured
                  ? "border-2 border-[#C3F73A]/30 bg-[rgba(195,247,58,0.03)]"
                  : "border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c]"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-2.5 left-6">
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#C3F73A] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
                    <Sparkles className="h-2.5 w-2.5" />
                    Recomendado
                  </div>
                </div>
              )}

              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6a6a72]">
                {p.tag}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {p.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-[12px] text-[#6a6a72]">$</span>
                <span className="text-4xl font-semibold text-white">
                  {p.price}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#6a6a72]">{p.currency}</p>

              <div className="mt-5 space-y-2 border-t border-[rgba(255,255,255,0.07)] pt-4">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#C3F73A]" />
                    <span className="text-[13px] text-white">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => !isCurrent && p.id !== "free" && handleCheckout(p.id)}
                disabled={isCurrent || checkoutLoading !== null}
                className={`group mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-3 text-[13px] font-semibold transition ${
                  isCurrent
                    ? "cursor-default border border-[#C3F73A]/30 bg-[#C3F73A]/10 text-[#C3F73A]"
                    : p.id === "free"
                    ? "cursor-default border border-[rgba(255,255,255,0.07)] text-[#6a6a72]"
                    : p.featured
                    ? "bg-[#C3F73A] text-[#050507] hover:shadow-[0_0_20px_-4px_rgba(195,247,58,0.4)]"
                    : "border border-[rgba(255,255,255,0.07)] text-white hover:border-[rgba(255,255,255,0.2)]"
                }`}
              >
                {checkoutLoading === p.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isCurrent ? (
                  <>
                    <Check className="h-4 w-4" />
                    Plan actual
                  </>
                ) : p.id === "free" ? (
                  "Plan básico"
                ) : (
                  <>
                    Mejorar a {p.name}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
