import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mes",
    tagline: "Para probar Estudify.",
    features: [
      "3 resúmenes al mes",
      "20 flashcards",
      "1 examen de práctica",
      "Exam Readiness básico",
    ],
    cta: "Empezar gratis",
    ctaHref: "#waitlist",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$199",
    period: " MXN/mes",
    annualNote: "Anual: $1,599 MXN (ahorra 33%)",
    tagline: "Para estudiantes que van en serio.",
    features: [
      "Resúmenes ilimitados",
      "Flashcards ilimitadas",
      "Exámenes ilimitados",
      "Tutor socrático completo",
      "Exam Readiness con desglose",
      "Generación prioritaria",
    ],
    cta: "Únete a la beta",
    ctaHref: "#waitlist",
    highlight: true,
    badge: "Más popular",
  },
  {
    name: "Team",
    price: "$299",
    period: " MXN/mes",
    tagline: "Hasta 5 estudiantes.",
    features: [
      "Todo lo de Pro",
      "5 estudiantes incluidos",
      "Grupos de estudio compartidos",
      "Progreso grupal visible",
      "Admin simple",
    ],
    cta: "Ver detalles",
    ctaHref: "/pricing",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-16 md:py-24 px-6 md:px-8 border-y border-[var(--border)]"
      style={{ background: "var(--bg2)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center max-w-[560px] mx-auto mb-14 fade-up">
          <div className="text-[12px] font-semibold text-[var(--purple-light)] uppercase tracking-[0.12em] mb-4">
            Precios
          </div>
          <h2 className="text-[32px] md:text-[42px] font-bold text-white tracking-[-0.02em] leading-[1.1] mb-4">
            Simple y transparente.
          </h2>
          <p className="text-[16px] md:text-[17px] text-[var(--text2)] leading-relaxed">
            Empieza gratis. Mejora cuando quieras. Sin contratos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`fade-up flex flex-col rounded-2xl p-5 md:p-6 relative ${
                plan.highlight
                  ? "border border-[rgba(108,63,160,0.5)]"
                  : "bg-[var(--bg)] border border-[var(--border)]"
              }`}
              style={
                plan.highlight
                  ? {
                      background:
                        "linear-gradient(180deg, rgba(108,63,160,0.1) 0%, var(--bg) 60%)",
                    }
                  : undefined
              }
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 h-6 inline-flex items-center rounded-full text-[11px] font-semibold text-white"
                  style={{
                    background: "linear-gradient(90deg, var(--purple), var(--purple-light))",
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-[18px] font-semibold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-[13.5px] text-[var(--text2)]">
                  {plan.tagline}
                </p>
              </div>

              <div className="pb-6 mb-6 border-b border-[var(--border)]">
                <div>
                  <span className="text-[38px] font-bold text-white tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-[14px] text-[var(--text2)]">
                    {plan.period}
                  </span>
                </div>
                {plan.annualNote && (
                  <div className="text-[12px] text-[var(--purple-light)] mt-1">
                    {plan.annualNote}
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-[13.5px]"
                    style={{
                      color: plan.highlight ? "var(--text)" : "var(--text2)",
                    }}
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={plan.highlight ? "var(--green)" : "var(--text2)"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.ctaHref.startsWith("/") ? (
                <Link
                  href={plan.ctaHref}
                  className={`h-11 inline-flex items-center justify-center rounded-full text-[14px] font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-white text-[var(--bg)] hover:bg-[rgba(255,255,255,0.88)]"
                      : "bg-[var(--surface)] border border-[var(--border)] text-white hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  {plan.cta}
                </Link>
              ) : (
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
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
