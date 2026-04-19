import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import WaitlistCTA from "../components/WaitlistCTA";

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Planes simples y transparentes. Empieza gratis, mejora cuando quieras. Sin contratos ni letras chicas.",
};

const plans = [
  {
    name: "Free",
    priceMonthly: "$0",
    priceAnnual: "$0",
    period: "/mes",
    tagline: "Para probar Estudify sin compromiso.",
    features: [
      { text: "3 resúmenes al mes", included: true },
      { text: "20 flashcards", included: true },
      { text: "1 examen de práctica", included: true },
      { text: "Exam Readiness básico", included: true },
      { text: "Tutor socrático", included: false },
      { text: "Resúmenes ilimitados", included: false },
      { text: "Generación prioritaria", included: false },
    ],
    cta: "Empezar gratis",
    ctaHref: "/#waitlist",
    highlight: false,
  },
  {
    name: "Pro",
    priceMonthly: "$199 MXN",
    priceAnnual: "$133 MXN",
    annualTotal: "$1,599 MXN/año",
    period: "/mes",
    tagline: "Para estudiantes que van en serio.",
    features: [
      { text: "Resúmenes ilimitados", included: true },
      { text: "Flashcards ilimitadas", included: true },
      { text: "Exámenes ilimitados", included: true },
      { text: "Exam Readiness con desglose", included: true },
      { text: "Tutor socrático completo", included: true },
      { text: "Generación prioritaria", included: true },
      { text: "Soporte prioritario", included: true },
    ],
    cta: "Únete a la beta",
    ctaHref: "/#waitlist",
    highlight: true,
    badge: "Más popular",
  },
  {
    name: "Team",
    priceMonthly: "$299 MXN",
    priceAnnual: "$199 MXN",
    annualTotal: "$2,388 MXN/año",
    period: "/mes",
    tagline: "Todo lo de Pro para hasta 5 estudiantes.",
    features: [
      { text: "Todo lo de Pro", included: true },
      { text: "5 estudiantes incluidos", included: true },
      { text: "Grupos de estudio compartidos", included: true },
      { text: "Progreso grupal visible", included: true },
      { text: "Admin simple (invitar/quitar)", included: true },
      { text: "Soporte prioritario", included: true },
    ],
    cta: "Unirse a la beta",
    ctaHref: "/#waitlist",
    highlight: false,
  },
];

const faqs = [
  {
    q: "¿Puedo cambiar de plan en cualquier momento?",
    a: "Sí. Puedes upgradear o cancelar cuando quieras desde tu cuenta. Sin penalizaciones.",
  },
  {
    q: "¿Hay descuento para el plan anual?",
    a: "Sí. El plan Pro Anual cuesta $1,599 MXN, lo que equivale a $133 MXN/mes —un ahorro del 33% frente al precio mensual.",
  },
  {
    q: "¿Cómo funciona el plan Team?",
    a: "El propietario de la cuenta invita hasta 4 personas adicionales. Todos tienen acceso completo a Pro más los grupos de estudio compartidos.",
  },
  {
    q: "¿Aceptan otras monedas?",
    a: "Próximamente aceptamos MXN, COP, ARS, EUR y USD con pricing regional ajustado al poder adquisitivo de cada país.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-24">
        {/* Header */}
        <section className="py-16 md:py-20 px-6 md:px-8 text-center">
          <div className="max-w-[640px] mx-auto">
            <div className="text-[12px] font-semibold text-[var(--purple-light)] uppercase tracking-[0.12em] mb-4">
              Precios
            </div>
            <h1 className="text-[38px] md:text-[52px] font-black text-white tracking-[-0.03em] leading-[1.05] mb-5">
              Simple y transparente.
            </h1>
            <p className="text-[17px] text-[var(--text2)] leading-relaxed">
              Empieza gratis. Mejora cuando quieras. Sin contratos, sin letra chica.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="pb-16 md:pb-24 px-6 md:px-8">
          <div className="max-w-[1120px] mx-auto">
            <div className="grid md:grid-cols-3 gap-5 items-stretch mb-16">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`flex flex-col rounded-2xl p-6 relative ${
                    plan.highlight
                      ? "border border-[rgba(108,63,160,0.5)]"
                      : "bg-[var(--surface)] border border-[var(--border)]"
                  }`}
                  style={
                    plan.highlight
                      ? {
                          background:
                            "linear-gradient(180deg, rgba(108,63,160,0.1) 0%, rgba(8,5,26,0.6) 60%)",
                        }
                      : undefined
                  }
                >
                  {plan.badge && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 h-6 inline-flex items-center rounded-full text-[11px] font-semibold text-white"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--purple), var(--purple-light))",
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-5">
                    <h2 className="text-[20px] font-bold text-white mb-1">
                      {plan.name}
                    </h2>
                    <p className="text-[13.5px] text-[var(--text2)]">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="pb-5 mb-5 border-b border-[var(--border)]">
                    <div>
                      <span className="text-[36px] font-bold text-white tracking-tight">
                        {plan.priceMonthly}
                      </span>
                      <span className="text-[14px] text-[var(--text2)]">
                        {plan.period}
                      </span>
                    </div>
                    {plan.annualTotal && (
                      <div className="text-[12px] text-[var(--purple-light)] mt-1">
                        Anual: {plan.annualTotal} (ahorra 33%)
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2.5 text-[13.5px]"
                        style={{
                          color: f.included
                            ? plan.highlight
                              ? "var(--text)"
                              : "var(--text2)"
                            : "rgba(139,131,168,0.4)",
                        }}
                      >
                        <svg
                          className="w-4 h-4 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={
                            f.included
                              ? plan.highlight
                                ? "var(--green)"
                                : "var(--text2)"
                              : "rgba(139,131,168,0.3)"
                          }
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          {f.included ? (
                            <polyline points="20 6 9 17 4 12" />
                          ) : (
                            <line x1="5" y1="12" x2="19" y2="12" />
                          )}
                        </svg>
                        {f.text}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.ctaHref}
                    className={`h-11 inline-flex items-center justify-center rounded-full text-[14px] font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-white text-[var(--bg)] hover:bg-[rgba(255,255,255,0.88)]"
                        : "bg-[var(--surface)] border border-[var(--border)] text-white hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>

            {/* B2B callout */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="text-[11px] font-semibold text-[var(--purple-light)] uppercase tracking-wider mb-2">
                  Instituciones y escuelas
                </div>
                <h3 className="text-[18px] font-bold text-white mb-1">
                  Estudify for Schools
                </h3>
                <p className="text-[14px] text-[var(--text2)] max-w-[480px]">
                  Panel para maestros, progreso por grupo, compliance y soporte
                  dedicado. Disponible en 2026 para pilotos gratuitos.
                </p>
              </div>
              <a
                href="/#waitlist"
                className="h-10 px-5 inline-flex items-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-white text-[13.5px] font-semibold hover:bg-[var(--surface-hover)] transition-colors shrink-0"
              >
                Contactar
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="py-16 md:py-20 px-6 md:px-8 border-t border-[var(--border)]"
          style={{ background: "var(--bg2)" }}
        >
          <div className="max-w-[720px] mx-auto">
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-[-0.02em] mb-10">
              Preguntas frecuentes
            </h2>
            <div className="space-y-5">
              {faqs.map((f, i) => (
                <div key={i} className="border-b border-[var(--border)] pb-5">
                  <h3 className="text-[15px] font-semibold text-white mb-2">
                    {f.q}
                  </h3>
                  <p className="text-[14px] text-[var(--text2)] leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/"
                className="text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </section>

        <WaitlistCTA />
      </main>
      <Footer />
    </>
  );
}
