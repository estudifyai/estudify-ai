"use client";

import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";

export default function Home() {
  return (
    <main className="grain min-h-screen bg-ink text-paper">
      <Nav />
      <Hero />
      <Marquee />
      <Manifesto />
      <Features />
      <ReadinessSection />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Waitlist />
      <Footer />
    </main>
  );
}

/* ═══════════════════ NAV ═══════════════════ */
function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--rule)] bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-serif text-xl tracking-tight">Estudify</span>
          <span className="mono text-[10px] text-[var(--muted)]">v0.1 BETA</span>
        </a>

        <div className="mono hidden items-center gap-8 text-xs uppercase tracking-[0.2em] text-[var(--muted)] md:flex">
          <a href="#features" className="hover:text-paper transition">
            Producto
          </a>
          <a href="#readiness" className="hover:text-paper transition">
            Readiness
          </a>
          <a href="#pricing" className="hover:text-paper transition">
            Precios
          </a>
          <a href="#faq" className="hover:text-paper transition">
            FAQ
          </a>
        </div>

        <a
          href="#waitlist"
          className="group mono inline-flex items-center gap-2 rounded-none border border-paper bg-paper px-4 py-2 text-xs uppercase tracking-wider text-ink transition hover:bg-[var(--accent)] hover:border-[var(--accent)]"
        >
          Únete
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </nav>
  );
}

function LogoMark() {
  return (
    <div className="relative h-7 w-7">
      <div className="absolute inset-0 border border-paper" />
      <div className="absolute left-1 top-1 h-5 w-5 bg-[var(--accent)]" />
      <div className="absolute left-2 top-2 h-3 w-3 border border-ink" />
    </div>
  );
}

/* ═══════════════════ HERO ═══════════════════ */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-paper absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1400px] px-6 pt-20 pb-32 md:px-10 md:pt-32">
        {/* Metadata editorial */}
        <div className="mono mb-16 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
          <span>Nº 001 · Vol. I</span>
          <span className="hidden md:inline">Abril 2026 · Beta pública</span>
          <span>México / LATAM</span>
        </div>

        <div className="grid gap-16 lg:grid-cols-12">
          {/* Headline */}
          <div className="lg:col-span-8">
            <h1 className="reveal font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-[-0.04em]">
              Estudia
              <br />
              <span className="serif-ital text-[var(--accent)]">menos.</span>
              <br />
              Aprende
              <br />
              <span className="serif-ital">más.</span>
            </h1>
          </div>

          {/* Sidebar editorial */}
          <div className="reveal lg:col-span-4 lg:pt-6" style={{ animationDelay: "0.2s" }}>
            <div className="border-l border-[var(--rule-strong)] pl-6">
              <p className="mono mb-6 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                Premisa
              </p>
              <p className="text-lg leading-relaxed text-paper">
                Una plataforma de estudio con inteligencia artificial que convierte
                tus apuntes, clases y temarios en{" "}
                <span className="serif-ital text-[var(--accent)]">material accionable</span>
                —no en respuestas para copiar.
              </p>

              <div className="mt-10 flex flex-col gap-3">
                <a
                  href="#waitlist"
                  className="group mono inline-flex items-center justify-between border border-paper bg-paper px-5 py-4 text-xs uppercase tracking-wider text-ink transition hover:bg-[var(--accent)] hover:border-[var(--accent)]"
                >
                  Únete a la beta
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#how"
                  className="mono inline-flex items-center justify-between border border-[var(--rule-strong)] px-5 py-4 text-xs uppercase tracking-wider text-paper transition hover:border-paper"
                >
                  Cómo funciona
                  <span className="text-[var(--accent)]">↓</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Datos editoriales debajo del headline */}
        <div className="mt-24 grid grid-cols-2 gap-8 border-t border-[var(--rule-strong)] pt-8 md:grid-cols-4">
          <DataPoint number="60s" label="Hasta el primer resumen" />
          <DataPoint number="100%" label="Basado en tu material" />
          <DataPoint number="0" label="Respuestas servidas" />
          <DataPoint number="∞" label="Práctica con sentido" />
        </div>
      </div>
    </section>
  );
}

function DataPoint({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-5xl leading-none tracking-tight md:text-6xl">
        {number}
      </div>
      <div className="mono mt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════ MARQUEE ═══════════════════ */
function Marquee() {
  const items = [
    "Biología",
    "Cálculo",
    "Historia",
    "Química orgánica",
    "Física",
    "Literatura",
    "Álgebra lineal",
    "Derecho",
    "Anatomía",
    "Economía",
    "Programación",
    "Filosofía",
  ];
  return (
    <div className="overflow-hidden border-y border-[var(--rule-strong)] bg-[var(--ink-soft)] py-6">
      <div className="marquee-track flex gap-12 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="serif-ital flex items-center gap-12 text-3xl text-[var(--muted)]"
          >
            {item}
            <span className="text-[var(--accent)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ MANIFESTO ═══════════════════ */
function Manifesto() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-48">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
            § 01 — Tesis
          </p>
        </div>
        <div className="lg:col-span-8">
          <p className="font-serif text-3xl leading-[1.15] tracking-tight md:text-5xl md:leading-[1.1]">
            Estudify no hace tu{" "}
            <span className="serif-ital text-[var(--muted)] line-through decoration-[var(--accent)] decoration-2">
              tarea
            </span>
            . Te entrena para{" "}
            <span className="underline-accent text-ink">dominar el examen.</span>{" "}
            Otras herramientas compiten por quién da mejores respuestas.{" "}
            <span className="serif-ital">Nosotros, por quién forma mejores estudiantes.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ FEATURES ═══════════════════ */
function Features() {
  const items = [
    {
      n: "01",
      title: "Resúmenes",
      italic: "claros",
      body: "Sube PDF, foto o texto. La IA devuelve un resumen con jerarquía, subtemas y conceptos clave. En menos de 60 segundos.",
    },
    {
      n: "02",
      title: "Flashcards",
      italic: "automáticas",
      body: "De 10 a 40 tarjetas con spaced repetition. Varía entre definición, aplicación, comparación y ejemplo.",
    },
    {
      n: "03",
      title: "Exámenes",
      italic: "de práctica",
      body: "Opción múltiple con distractores plausibles. Dificultad progresiva. Explicación de la respuesta correcta.",
    },
    {
      n: "04",
      title: "Tutor",
      italic: "socrático",
      body: "No te da la respuesta. Te guía con preguntas hasta que la descubres tú. Así se retiene lo aprendido.",
    },
    {
      n: "05",
      title: "Readiness",
      italic: "Score",
      body: "Mide tu dominio real: precisión, retención, cobertura, consistencia. Sabes cuándo estás listo, no cuándo te sientes listo.",
    },
  ];

  return (
    <section id="features" className="border-t border-[var(--rule-strong)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 border-b border-[var(--rule-strong)] py-10">
          <div className="col-span-12 md:col-span-4">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
              § 02 — Producto
            </p>
          </div>
          <div className="col-span-12 mt-4 md:col-span-8 md:mt-0">
            <h2 className="font-serif text-5xl leading-[0.95] tracking-tight md:text-6xl">
              Cinco piezas.
              <br />
              <span className="serif-ital">Un solo objetivo.</span>
            </h2>
          </div>
        </div>

        {items.map((item, i) => (
          <FeatureRow key={i} {...item} last={i === items.length - 1} />
        ))}
      </div>
    </section>
  );
}

function FeatureRow({
  n,
  title,
  italic,
  body,
  last,
}: {
  n: string;
  title: string;
  italic: string;
  body: string;
  last: boolean;
}) {
  return (
    <div
      className={`group grid grid-cols-12 gap-6 py-10 transition hover:bg-[var(--ink-soft)] ${
        !last ? "border-b border-[var(--rule)]" : ""
      }`}
    >
      <div className="col-span-2 md:col-span-1">
        <span className="mono text-sm text-[var(--muted)]">{n}</span>
      </div>
      <div className="col-span-10 md:col-span-5">
        <h3 className="font-serif text-3xl tracking-tight md:text-5xl">
          {title}{" "}
          <span className="serif-ital text-[var(--accent)]">{italic}</span>
        </h3>
      </div>
      <div className="col-span-12 md:col-span-5 md:col-start-8">
        <p className="text-base leading-relaxed text-[var(--muted)] md:text-lg">
          {body}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════ READINESS SECTION ═══════════════════ */
function ReadinessSection() {
  return (
    <section
      id="readiness"
      className="relative border-t border-[var(--rule-strong)] bg-[var(--ink-soft)]"
    >
      <div className="grid-paper-fine absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12 gap-10">
          {/* Left: manifiesto */}
          <div className="col-span-12 lg:col-span-6">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
              § 03 — Métrica única
            </p>
            <h2 className="mt-8 font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
              Deja de estudiar hasta{" "}
              <span className="serif-ital text-[var(--muted)]">sentirte</span>{" "}
              listo.
              <br />
              Estudia hasta <span className="underline-accent text-ink">estarlo</span>.
            </h2>

            <p className="mt-10 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              Exam Readiness Score es la métrica que nadie más mide. No cuenta
              horas. No cuenta tarjetas vistas. Mide tu dominio real combinando
              cuatro señales.
            </p>

            <div className="mt-12 space-y-4 border-l border-[var(--rule-strong)] pl-6">
              <RangeRow range="90–100%" label="Listo para dominar" accent />
              <RangeRow range="70–89%" label="Casi llegas, repasa lo débil" />
              <RangeRow range="50–69%" label="En progreso, 5 preguntas más" />
              <RangeRow range="0–49%" label="Empecemos por lo básico" />
            </div>
          </div>

          {/* Right: visual editorial */}
          <div className="col-span-12 lg:col-span-6">
            <ReadinessCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function RangeRow({
  range,
  label,
  accent,
}: {
  range: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-6">
      <span
        className={`mono text-sm ${accent ? "text-[var(--accent)]" : "text-paper"}`}
      >
        {range}
      </span>
      <span className="serif-ital text-lg text-[var(--muted)]">{label}</span>
    </div>
  );
}

function ReadinessCard() {
  return (
    <div className="relative border border-[var(--rule-strong)] bg-ink p-8 md:p-12">
      {/* Encabezado tipo ficha */}
      <div className="mono mb-10 flex items-center justify-between border-b border-[var(--rule)] pb-4 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
        <span>Biología · Mitosis</span>
        <span>Estudiante #4421</span>
      </div>

      {/* Score principal con círculo */}
      <div className="flex items-center gap-8">
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--rule-strong)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="283"
              strokeDashoffset="79"
              className="draw-circle"
              style={{ strokeDashoffset: 283 - (283 * 72) / 100 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-4xl tracking-tight">72<span className="text-[var(--muted)]">%</span></span>
          </div>
        </div>
        <div className="flex-1">
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
            Estado
          </p>
          <p className="serif-ital mt-2 text-2xl leading-tight">
            Casi listo. Cinco minutos en ciclo celular y subes a 85%.
          </p>
        </div>
      </div>

      {/* Barras */}
      <div className="mt-12 space-y-6">
        <BarRow label="Fases de la mitosis" value={95} />
        <BarRow label="División celular" value={82} />
        <BarRow label="Ciclo celular" value={58} weak />
      </div>

      {/* Firma editorial */}
      <div className="mono mt-10 flex items-center justify-between border-t border-[var(--rule)] pt-4 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
        <span>Actualizado hace 2 min</span>
        <span>ERS v1.0</span>
      </div>
    </div>
  );
}

function BarRow({
  label,
  value,
  weak,
}: {
  label: string;
  value: number;
  weak?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="serif-ital text-lg text-paper">{label}</span>
        <span className={`mono text-sm ${weak ? "text-[var(--accent)]" : "text-paper"}`}>
          {value}%
        </span>
      </div>
      <div className="mt-2 h-[2px] w-full bg-[var(--rule-strong)]">
        <div
          className={`h-full ${weak ? "bg-[var(--accent)]" : "bg-paper"} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════ HOW IT WORKS ═══════════════════ */
function HowItWorks() {
  const steps = [
    {
      n: "I.",
      title: "Subes",
      body: "PDF, foto de apuntes o texto pegado. Audio de clase llega pronto.",
    },
    {
      n: "II.",
      title: "La IA procesa",
      body: "Resumen, flashcards y examen generados solo con tu material. Sin inventar.",
    },
    {
      n: "III.",
      title: "Practicas",
      body: "Tu Readiness sube con cada sesión. La app te dice exactamente qué repasar.",
    },
  ];
  return (
    <section id="how" className="border-t border-[var(--rule-strong)]">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-4">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
              § 04 — Proceso
            </p>
            <h2 className="mt-8 font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
              Tres
              <br />
              <span className="serif-ital">pasos.</span>
              <br />
              Sin vueltas.
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="relative border-l border-[var(--rule-strong)]">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="relative pl-10 pb-16 last:pb-0 md:pl-16"
                >
                  <div className="absolute left-[-9px] top-0 h-4 w-4 rotate-45 bg-[var(--accent)]" />
                  <div className="flex items-baseline gap-6">
                    <span className="mono text-sm text-[var(--muted)]">{s.n}</span>
                    <h3 className="font-serif text-4xl tracking-tight md:text-6xl">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-[var(--muted)] md:pl-12">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ TESTIMONIALS ═══════════════════ */
function Testimonials() {
  const items = [
    {
      text: "Tenía examen de Bio en 48 horas y 80 páginas de apuntes. Lo tuve listo en 10 minutos. Saqué 9.2.",
      name: "Sofía M.",
      role: "Prepa · Monterrey",
    },
    {
      text: "El tutor socrático me hace pensar, no me da la respuesta. Esa diferencia es la que me hizo entender cálculo.",
      name: "Diego L.",
      role: "Universidad · CDMX",
    },
    {
      text: "Ver el Readiness subir engancha más que cualquier red social. Y la diferencia es que estoy aprendiendo de verdad.",
      name: "Mariana R.",
      role: "Prepa · Guadalajara",
    },
  ];

  return (
    <section className="border-t border-[var(--rule-strong)] bg-[var(--ink-soft)]">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12">
          <div className="col-span-12 mb-16 lg:col-span-4">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
              § 05 — Voces
            </p>
            <h2 className="mt-8 font-serif text-5xl leading-[0.95] tracking-tight md:text-6xl">
              Beta
              <br />
              <span className="serif-ital">testers.</span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="grid gap-0 border-t border-[var(--rule-strong)]">
              {items.map((t, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-6 border-b border-[var(--rule-strong)] py-10"
                >
                  <div className="col-span-12 md:col-span-8">
                    <p className="font-serif text-2xl leading-snug tracking-tight md:text-3xl">
                      <span className="serif-ital text-[var(--accent)]">"</span>
                      {t.text}
                      <span className="serif-ital text-[var(--accent)]">"</span>
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-4 md:text-right">
                    <p className="mono text-xs uppercase tracking-wider text-paper">
                      {t.name}
                    </p>
                    <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {t.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ PRICING ═══════════════════ */
function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      currency: "MXN",
      tag: "Para probar",
      features: [
        "3 resúmenes al mes",
        "20 flashcards",
        "1 examen de práctica",
        "Exam Readiness básico",
      ],
    },
    {
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

  return (
    <section id="pricing" className="border-t border-[var(--rule-strong)]">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12 border-b border-[var(--rule-strong)] pb-10">
          <div className="col-span-12 md:col-span-4">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
              § 06 — Precios
            </p>
          </div>
          <div className="col-span-12 mt-4 md:col-span-8 md:mt-0">
            <h2 className="font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
              Simple.
              <br />
              <span className="serif-ital">Sin sorpresas.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`relative border-b border-[var(--rule-strong)] p-10 md:border-b-0 ${
                i < 2 ? "md:border-r md:border-[var(--rule-strong)]" : ""
              } ${p.featured ? "bg-[var(--ink-soft)]" : ""}`}
            >
              {p.featured && (
                <div className="absolute right-10 top-10">
                  <div className="mono inline-block bg-[var(--accent)] px-2 py-1 text-[9px] uppercase tracking-widest text-ink">
                    Recomendado
                  </div>
                </div>
              )}

              <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                {p.tag}
              </p>
              <h3 className="mt-3 font-serif text-4xl tracking-tight">
                {p.name}
              </h3>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="mono text-sm text-[var(--muted)]">$</span>
                <span className="font-serif text-7xl leading-none tracking-tight">
                  {p.price}
                </span>
              </div>
              <p className="mono mt-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                {p.currency}
              </p>

              <div className="mt-10 space-y-3 border-t border-[var(--rule)] pt-6">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Plus className="mt-1 h-3 w-3 flex-shrink-0 text-[var(--accent)]" />
                    <span className="text-sm text-paper">{f}</span>
                  </div>
                ))}
              </div>

              <a
                href="#waitlist"
                className={`group mono mt-10 inline-flex w-full items-center justify-between border px-5 py-4 text-xs uppercase tracking-wider transition ${
                  p.featured
                    ? "border-paper bg-paper text-ink hover:bg-[var(--accent)] hover:border-[var(--accent)]"
                    : "border-[var(--rule-strong)] text-paper hover:border-paper"
                }`}
              >
                Empezar
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ FAQ ═══════════════════ */
function FAQ() {
  const faqs = [
    {
      q: "¿Estudify hace mi tarea por mí?",
      a: "No. Estudify forma, no suplanta. El tutor responde con preguntas, no respuestas. Resúmenes y flashcards se basan solo en tu material. Es estudio, no trampa.",
    },
    {
      q: "¿Qué tan rápido veo resultados?",
      a: "Menos de 60 segundos desde que subes tu archivo hasta tener resumen, flashcards y examen listos.",
    },
    {
      q: "¿En qué idiomas funciona?",
      a: "Español por defecto. Diseñado desde cero para hispanohablantes, no traducido de otra herramienta.",
    },
    {
      q: "¿La IA inventa información?",
      a: "No. Solo usa el material que subes. Si no hay info sobre un tema, te lo dice y pide más contenido. No rellena con conocimiento general.",
    },
    {
      q: "¿Mis apuntes son privados?",
      a: "Sí. Encriptados en tránsito y reposo (AES-256). Eliminados tras 30 días. Nunca vendemos datos.",
    },
    {
      q: "¿Cuándo sale la app móvil nativa?",
      a: "La web es mobile-first desde día uno. iOS y Android nativos llegan después del MVP.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-[var(--rule-strong)] bg-[var(--ink-soft)]">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-4">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
              § 07 — Dudas
            </p>
            <h2 className="mt-8 font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
              Preguntas
              <br />
              <span className="serif-ital">frecuentes.</span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="border-t border-[var(--rule-strong)]">
              {faqs.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setOpen(open === i ? null : i)}
                  className="block w-full border-b border-[var(--rule-strong)] py-6 text-left transition"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="font-serif text-xl tracking-tight md:text-2xl">
                      {f.q}
                    </span>
                    <span
                      className={`mono text-2xl text-[var(--accent)] transition-transform ${
                        open === i ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>
                  {open === i && (
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
                      {f.a}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ WAITLIST ═══════════════════ */
function Waitlist() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Waitlist:", email);
    setSent(true);
    setEmail("");
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden border-t border-[var(--rule-strong)]"
    >
      <div className="grid-paper absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-48">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
            § 08 — Beta
          </p>
          <h2 className="mt-8 font-serif text-6xl leading-[0.95] tracking-tight md:text-[8rem]">
            Sé de los
            <br />
            <span className="serif-ital text-[var(--accent)]">primeros.</span>
          </h2>
          <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            Los primeros 500 reciben <span className="text-paper">3 meses Pro gratis</span> y
            acceso prioritario a la beta cerrada.
          </p>

          {sent ? (
            <div className="mono mt-12 inline-flex items-center gap-3 border border-[var(--accent)] bg-[var(--accent)] px-8 py-4 text-xs uppercase tracking-widest text-ink">
              <span>✓</span> Te avisamos pronto
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-12 flex max-w-lg flex-col items-stretch gap-2 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mono flex-1 border border-[var(--rule-strong)] bg-transparent px-5 py-4 text-sm text-paper placeholder:text-[var(--muted)] outline-none transition focus:border-paper"
              />
              <button
                type="submit"
                className="mono group inline-flex items-center justify-center gap-2 border border-[var(--accent)] bg-[var(--accent)] px-6 py-4 text-xs uppercase tracking-wider text-ink transition hover:bg-paper hover:border-paper"
              >
                Unirme
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ FOOTER ═══════════════════ */
function Footer() {
  return (
    <footer className="border-t border-[var(--rule-strong)] bg-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-serif text-2xl tracking-tight">Estudify</span>
            </div>
            <p className="serif-ital mt-4 max-w-md text-xl text-[var(--muted)]">
              Estudia menos. Aprende más.
            </p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
              Navegación
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#features" className="hover:text-[var(--accent)] transition">Producto</a></li>
              <li><a href="#readiness" className="hover:text-[var(--accent)] transition">Readiness</a></li>
              <li><a href="#pricing" className="hover:text-[var(--accent)] transition">Precios</a></li>
              <li><a href="#faq" className="hover:text-[var(--accent)] transition">FAQ</a></li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
              Legal
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-[var(--accent)] transition">Privacidad</a></li>
              <li><a href="#" className="hover:text-[var(--accent)] transition">Términos</a></li>
              <li><a href="#" className="hover:text-[var(--accent)] transition">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="mono mt-16 flex flex-col items-start justify-between gap-2 border-t border-[var(--rule)] pt-6 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] md:flex-row md:items-center">
          <span>© 2026 Estudify.ai</span>
          <span>Hecho en México / Para LATAM</span>
          <span>v0.1 — Beta pública</span>
        </div>
      </div>
    </footer>
  );
}
