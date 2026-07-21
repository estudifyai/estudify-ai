"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import Starfield from "./components/Starfield";
import Logo from "./components/Logo";
import Logo3D from "./components/Logo3D";

export default function Home() {
  return (
    <>
      <div className="cosmic-bg" />
      <Starfield />

      <main className="noise relative z-10 min-h-screen text-white">
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
    </>
  );
}

/* ═══════════════════ NAV ═══════════════════ */
function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-4 md:px-10">
        <a href="#" className="group flex items-center transition">
          <Logo
            variant="full"
            size={44}
            className="transition group-hover:opacity-90"
          />
        </a>

        <div className="hidden items-center gap-10 text-[13px] font-medium text-[var(--text-dim)] md:flex">
          <a href="#features" className="hover:text-white transition">
            Producto
          </a>
          <a href="#readiness" className="hover:text-white transition">
            Readiness
          </a>
          <a href="#pricing" className="hover:text-white transition">
            Precios
          </a>
          <a href="#faq" className="hover:text-white transition">
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-[13px] font-medium text-[var(--text-dim)] transition hover:text-white"
          >
            Iniciar sesión
          </a>
          <a
            href="/login"
            className="btn-primary group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px]"
          >
            Crear cuenta
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════ HERO ═══════════════════ */
function Hero() {
  return (
    <section className="relative mx-auto max-w-[1320px] px-6 pt-20 pb-32 md:px-10 md:pt-28">
      {/* Cabecera editorial */}
      <div className="mono mb-20 flex items-center justify-between border-b border-[var(--border)] pb-6 text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
        <span>Nº 001 — Vol. 01</span>
        <span className="hidden md:inline">Un laboratorio de estudio</span>
        <span>MX · LATAM</span>
      </div>
{/* Logo flotante estilo OpenClaw — átomo grande centrado */}
      <div
        className="reveal mt-6 flex justify-center"
        style={{ animationDelay: "0.05s" }}
      >
        <Logo3D />
      </div>
      {/* HERO principal: "estudify.ai" con gradiente del logo */}
      <h1
        className="reveal mt-10 text-center"
        style={{ animationDelay: "0.1s" }}
      >
       <span className="editorial block text-[clamp(4.5rem,14vw,12rem)] leading-[1] tracking-[-0.04em] brand-gradient-text">
          estudify.ai
        </span>
      </h1>

      {/* Tagline editorial debajo */}
      <p
        className="reveal mt-10 text-center text-balance"
        style={{ animationDelay: "0.2s" }}
      >
        <span className="editorial block text-[clamp(1.75rem,4vw,3rem)] text-white">
          Estudia <span className="editorial-italic text-[var(--text-dim)]">menos</span>.
          Aprende <span className="editorial-italic text-[var(--text-dim)]">más</span>.
        </span>
      </p>

      <p
        className="reveal mx-auto mt-10 max-w-[640px] text-center text-balance text-[17px] leading-[1.55] text-[var(--text-dim)] md:text-xl"
        style={{ animationDelay: "0.3s" }}
      >
        La plataforma de estudio con IA que convierte tus apuntes en material
        accionable. No hace tu tarea —{" "}
        <span className="text-white">te entrena para dominar el examen.</span>
      </p>

      <div
        className="reveal mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        style={{ animationDelay: "0.4s" }}
      >
        <a
          href="/login"
          className="btn-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px]"
        >
          <Sparkles className="h-4 w-4" />
          Empezar gratis
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
        <a
          href="#how"
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)]/60 px-7 py-3.5 text-[14px] text-white backdrop-blur transition hover:border-white/30 hover:bg-[var(--surface-2)]/80"
        >
          Ver cómo funciona
          <span className="text-[var(--brand-lime)]">↓</span>
        </a>
      </div>

      <div
        className="reveal mx-auto mt-32 grid max-w-5xl grid-cols-2 gap-10 border-t border-[var(--border)] pt-12 md:grid-cols-4"
        style={{ animationDelay: "0.5s" }}
      >
        <DataPoint number="60s" label="Primer resumen" />
        <DataPoint number="100%" label="Basado en tu material" />
        <DataPoint number="0" label="Respuestas servidas" />
        <DataPoint number="∞" label="Práctica con sentido" />
      </div>
    </section>
  );
}

function DataPoint({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-left">
      <div className="editorial text-6xl text-white md:text-7xl">{number}</div>
      <div className="mono mt-4 text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
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
    <div className="relative overflow-hidden border-y border-[var(--border)] bg-black/40 py-6 backdrop-blur">
      <div className="marquee-track flex gap-16 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="editorial-italic flex items-center gap-16 text-3xl text-[var(--text-dim)]"
          >
            {item}
            <span
              className="inline-block h-2 w-2 rounded-full brand-gradient-bg"
              aria-hidden
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ MANIFESTO ═══════════════════ */
function Manifesto() {
  return (
    <section className="relative mx-auto max-w-[1320px] px-6 py-32 md:px-10 md:py-48">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionTag number="01" label="Tesis" />
        </div>
        <div className="lg:col-span-8">
          <p className="editorial text-balance text-3xl leading-[1.2] md:text-5xl md:leading-[1.15]">
            Estudify no hace tu{" "}
            <span className="editorial-italic text-[var(--text-muted)] line-through decoration-[var(--brand-lime)] decoration-2">
              tarea
            </span>
            . Te entrena para{" "}
            <span className="editorial-italic brand-gradient-text">
              dominar el examen
            </span>
            .{" "}
            <span className="mt-4 block text-[var(--text-dim)]">
              Otras herramientas compiten por quién da mejores respuestas.{" "}
              <span className="editorial-italic text-white">
                Nosotros, por quién forma mejores estudiantes.
              </span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionTag({ number, label }: { number: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-3">
      <span className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand-lime)]">
        {number}
      </span>
      <span className="h-px w-8 bg-[var(--brand-lime)]/40" />
      <span className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-dim)]">
        {label}
      </span>
    </div>
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
    <section id="features" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8 border-b border-[var(--border)] py-12">
          <div className="col-span-12 md:col-span-4">
            <SectionTag number="02" label="Producto" />
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2 className="editorial text-balance text-4xl md:text-7xl">
              Cinco piezas.
              <br />
              <span className="editorial-italic brand-gradient-text">
                Un objetivo.
              </span>
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
      className={`group relative grid grid-cols-12 gap-6 py-12 transition ${
        !last ? "border-b border-[var(--border)]" : ""
      }`}
    >
      <div className="pointer-events-none absolute inset-0 -mx-6 bg-gradient-to-r from-transparent via-white/[0.015] to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="col-span-2 md:col-span-1">
        <span className="mono text-sm text-[var(--text-muted)]">{n}</span>
      </div>
      <div className="col-span-10 md:col-span-6">
        <h3 className="editorial text-4xl md:text-6xl">
          {title}{" "}
          <span className="editorial-italic brand-gradient-text">{italic}</span>
        </h3>
      </div>
      <div className="col-span-12 md:col-span-5 md:pt-3">
        <p className="text-[15px] leading-[1.65] text-[var(--text-dim)] md:text-[17px]">
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
      className="relative border-t border-[var(--border)] bg-[var(--surface)]/40 backdrop-blur-sm"
    >
      <div className="relative mx-auto max-w-[1320px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12 gap-10 lg:gap-20">
          <div className="col-span-12 lg:col-span-6">
            <SectionTag number="03" label="Métrica única" />
            <h2 className="editorial mt-10 text-balance text-4xl md:text-7xl">
              Deja de estudiar hasta{" "}
              <span className="editorial-italic text-[var(--text-muted)]">
                sentirte
              </span>{" "}
              listo.
              <br />
              Estudia hasta{" "}
              <span className="editorial-italic brand-gradient-text">
                estarlo
              </span>
              .
            </h2>

            <p className="mt-10 max-w-xl text-[15px] leading-[1.65] text-[var(--text-dim)] md:text-[17px]">
              Exam Readiness Score es la métrica que nadie más mide. No cuenta
              horas. No cuenta tarjetas vistas. Mide tu dominio real combinando
              cuatro señales en tiempo real.
            </p>

            <div className="mt-12 space-y-4 border-l border-[var(--border-strong)] pl-6">
              <RangeRow range="90–100%" label="Listo para dominar" accent />
              <RangeRow range="70–89%" label="Casi llegas, repasa lo débil" />
              <RangeRow range="50–69%" label="En progreso, 5 preguntas más" />
              <RangeRow range="0–49%" label="Empecemos por lo básico" />
            </div>
          </div>

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
        className={`mono text-sm ${
          accent ? "brand-gradient-text" : "text-white"
        }`}
      >
        {range}
      </span>
      <span className="editorial-italic text-lg text-[var(--text-dim)]">
        {label}
      </span>
    </div>
  );
}

function ReadinessCard() {
  return (
    <div className="surface relative p-8 md:p-10">
      <div className="mono mb-10 flex items-center justify-between border-b border-[var(--border)] pb-4 text-[10px] uppercase tracking-[0.22em] text-[var(--text-dim)]">
        <span>Biología · Mitosis</span>
        <span>Estudiante #4421</span>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative h-36 w-36 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C3F73A" />
                <stop offset="33%" stopColor="#7EE8C6" />
                <stop offset="66%" stopColor="#5EC8E8" />
                <stop offset="100%" stopColor="#8B7FD8" />
              </linearGradient>
              <filter id="scoreGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * 72) / 100}
              filter="url(#scoreGlow)"
              style={{
                transition: "stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="editorial text-5xl">
              72<span className="text-[var(--text-muted)]">%</span>
            </span>
          </div>
        </div>
        <div className="flex-1">
          <p className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--brand-lime)]">
            Estado
          </p>
          <p className="editorial-italic mt-2 text-xl leading-tight md:text-2xl">
            Casi listo. Cinco minutos en ciclo celular y subes a 85%.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-5">
        <BarRow label="Fases de la mitosis" value={95} />
        <BarRow label="División celular" value={82} />
        <BarRow label="Ciclo celular" value={58} weak />
      </div>

      <div className="mono mt-10 flex items-center justify-between border-t border-[var(--border)] pt-4 text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
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
        <span className="editorial-italic text-base text-white md:text-lg">
          {label}
        </span>
        <span
          className={`mono text-sm ${
            weak ? "brand-gradient-text" : "text-[var(--text-dim)]"
          }`}
        >
          {value}%
        </span>
      </div>
      <div className="mt-2 h-[2px] w-full bg-[var(--border)]">
        <div
          className={`h-full transition-all duration-1000 ${
            weak ? "brand-gradient-bg" : "bg-white/40"
          }`}
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
    <section id="how" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-[1320px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12 gap-10 lg:gap-20">
          <div className="col-span-12 lg:col-span-4">
            <SectionTag number="04" label="Proceso" />
            <h2 className="editorial mt-10 text-balance text-5xl md:text-7xl">
              Tres
              <br />
              <span className="editorial-italic brand-gradient-text">
                pasos.
              </span>
              <br />
              Sin vueltas.
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="relative border-l border-[var(--border-strong)]">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="relative pl-10 pb-16 last:pb-0 md:pl-16"
                >
                  <div
                    className="absolute left-[-6px] top-2 h-3 w-3 rounded-full brand-gradient-bg"
                    style={{
                      boxShadow: "0 0 20px rgba(195,247,58,0.6)",
                    }}
                  />
                  <div className="flex items-baseline gap-6">
                    <span className="mono text-sm text-[var(--text-muted)]">
                      {s.n}
                    </span>
                    <h3 className="editorial text-4xl tracking-tight md:text-6xl">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-4 max-w-lg text-[15px] leading-[1.65] text-[var(--text-dim)] md:pl-12 md:text-[17px]">
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
    <section className="border-t border-[var(--border)] bg-[var(--surface)]/40 backdrop-blur-sm">
      <div className="mx-auto max-w-[1320px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12 gap-10 lg:gap-20">
          <div className="col-span-12 mb-8 lg:col-span-4 lg:mb-0">
            <SectionTag number="05" label="Voces" />
            <h2 className="editorial mt-10 text-5xl md:text-7xl">
              Beta
              <br />
              <span className="editorial-italic brand-gradient-text">
                testers.
              </span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="border-t border-[var(--border)]">
              {items.map((t, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-6 border-b border-[var(--border)] py-12"
                >
                  <div className="col-span-12 md:col-span-8">
                    <p className="editorial text-2xl leading-[1.3] md:text-3xl">
                      <span className="editorial-italic brand-gradient-text text-4xl leading-none">
                        &ldquo;
                      </span>
                      {t.text}
                      <span className="editorial-italic brand-gradient-text text-4xl leading-none">
                        &rdquo;
                      </span>
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-4 md:text-right">
                    <p className="mono text-xs uppercase tracking-wider text-white">
                      {t.name}
                    </p>
                    <p className="mono mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
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
    <section id="pricing" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-[1320px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12 gap-8 border-b border-[var(--border)] pb-12">
          <div className="col-span-12 md:col-span-4">
            <SectionTag number="06" label="Precios" />
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2 className="editorial text-4xl md:text-7xl">
              Simple.
              <br />
              <span className="editorial-italic brand-gradient-text">
                Sin sorpresas.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-[20px] p-8 ${
                p.featured ? "brand-border bg-[var(--surface-2)]" : "surface"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-8">
                  <div className="btn-primary mono inline-flex items-center gap-1 rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.2em]">
                    <Sparkles className="h-2.5 w-2.5" />
                    Recomendado
                  </div>
                </div>
              )}

              <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-dim)]">
                {p.tag}
              </p>
              <h3 className="editorial mt-3 text-4xl">{p.name}</h3>

              <div className="mt-8 flex items-baseline gap-1">
                <span className="mono text-sm text-[var(--text-muted)]">$</span>
                <span className="editorial text-7xl">{p.price}</span>
              </div>
              <p className="mono mt-2 text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {p.currency}
              </p>

              <div className="mt-8 space-y-3 border-t border-[var(--border)] pt-6">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-lime)]" />
                    <span className="text-[14px] text-white">{f}</span>
                  </div>
                ))}
              </div>

              <a
                href="#waitlist"
                className={`group mt-10 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-5 py-3.5 text-sm font-semibold transition ${
                  p.featured
                    ? "btn-primary"
                    : "border border-[var(--border-strong)] bg-[var(--surface)] text-white hover:border-white/30 hover:bg-[var(--surface-hover)]"
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
    <section
      id="faq"
      className="border-t border-[var(--border)] bg-[var(--surface)]/40 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-[1320px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-12 gap-10 lg:gap-20">
          <div className="col-span-12 lg:col-span-4">
            <SectionTag number="07" label="Dudas" />
            <h2 className="editorial mt-10 text-5xl md:text-7xl">
              Preguntas
              <br />
              <span className="editorial-italic brand-gradient-text">
                frecuentes.
              </span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="border-t border-[var(--border)]">
              {faqs.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setOpen(open === i ? null : i)}
                  className="block w-full border-b border-[var(--border)] py-6 text-left transition hover:bg-white/[0.015]"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="editorial text-xl md:text-2xl">{f.q}</span>
                    <span
                      className={`text-2xl text-[var(--brand-lime)] transition-transform duration-500 ${
                        open === i ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>
                  {open === i && (
                    <p className="mt-4 max-w-2xl text-[15px] leading-[1.65] text-[var(--text-dim)]">
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
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden border-t border-[var(--border)]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(195,247,58,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-6 py-32 md:px-10 md:py-48">
        <div className="mx-auto max-w-4xl text-center">
          <SectionTag number="08" label="Empieza ahora" />

          <h2 className="editorial mt-10 text-balance text-6xl md:text-[8rem]">
            Sé de los
            <br />
            <span className="editorial-italic brand-gradient-text">
              primeros
            </span>
            .
          </h2>
          <p className="mx-auto mt-10 max-w-xl text-[15px] leading-[1.65] text-[var(--text-dim)] md:text-[17px]">
            Sé parte de la próxima generación de estudio.
            <span className="text-white"> Acceso anticipado para los que se unan ahora.</span>
          </p>

          <a
            href="/login"
            className="btn-primary group mt-12 inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px]"
          >
            <Sparkles className="h-4 w-4" />
            Crear cuenta gratis
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ FOOTER ═══════════════════ */
function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-black">
      <div className="mx-auto max-w-[1320px] px-6 py-16 md:px-10 md:py-20">
        <div className="mb-16 flex items-center justify-center">
          <Logo variant="full" size={72} glow />
        </div>

        <p className="editorial-italic mx-auto mb-16 max-w-2xl text-center text-2xl text-[var(--text-dim)] md:text-3xl">
          Estudia <span className="brand-gradient-text">menos</span>. Aprende{" "}
          <span className="brand-gradient-text">más</span>.
        </p>

        <div className="grid grid-cols-12 gap-8 border-t border-[var(--border)] pt-12">
          <div className="col-span-12 md:col-span-6">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
              El proyecto
            </p>
            <p className="mt-4 max-w-md text-[14px] leading-[1.6] text-[var(--text-dim)]">
              Plataforma de estudio con IA construida para estudiantes
              hispanohablantes. No hace tu tarea. Te forma.
            </p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
              Navegación
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Producto", "Readiness", "Precios", "FAQ"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-[var(--text-dim)] transition hover:text-[var(--brand-lime)]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
              Legal
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Privacidad", "Términos", "Contacto"].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[var(--text-dim)] transition hover:text-[var(--brand-lime)]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mono mt-16 flex flex-col items-start justify-between gap-2 border-t border-[var(--border)] pt-6 text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)] md:flex-row md:items-center">
          <span>© 2026 estudify.ai</span>
          <span>Hecho en México · Para LATAM</span>
          <span className="text-[var(--brand-lime)]">
            ● v0.1 — Beta pública
          </span>
        </div>
      </div>
    </footer>
  );
}
