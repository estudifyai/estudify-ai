const ranges = [
  {
    range: "90–100%",
    label: "Listo para dominar",
    action: "Simula el examen final.",
    color: "var(--green)",
    bg: "rgba(168,224,110,0.08)",
    border: "rgba(168,224,110,0.2)",
  },
  {
    range: "70–89%",
    label: "Casi listo",
    action: "Repasa los puntos débiles específicos.",
    color: "var(--cyan)",
    bg: "rgba(0,212,255,0.08)",
    border: "rgba(0,212,255,0.2)",
  },
  {
    range: "50–69%",
    label: "En progreso",
    action: "Haz 5 preguntas más sobre temas débiles.",
    color: "var(--amber)",
    bg: "rgba(245,200,66,0.08)",
    border: "rgba(245,200,66,0.2)",
  },
  {
    range: "0–49%",
    label: "Necesita base",
    action: "Revisa el resumen simplificado primero.",
    color: "#C084FC",
    bg: "rgba(192,132,252,0.08)",
    border: "rgba(192,132,252,0.2)",
  },
];

export default function ReadinessSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: description */}
          <div className="fade-up">
            <div className="text-[12px] font-semibold text-[var(--purple-light)] uppercase tracking-[0.12em] mb-4">
              Exam Readiness Score
            </div>
            <h2 className="text-[32px] md:text-[40px] font-bold text-white tracking-[-0.02em] leading-[1.1] mb-5">
              Sabes exactamente cuándo estás listo.
            </h2>
            <p className="text-[16px] text-[var(--text2)] leading-relaxed mb-8">
              Otras plataformas miden cuántas horas estudiaste. Estudify mide
              cuánto dominas realmente —con una métrica construida sobre tu
              práctica real, no sobre el tiempo invertido.
            </p>

            <div className="space-y-3">
              {ranges.map((r) => (
                <div
                  key={r.range}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{
                    background: r.bg,
                    borderColor: r.border,
                  }}
                >
                  <div
                    className="text-[12px] font-bold tabular-nums px-2 h-6 rounded-md flex items-center shrink-0 mt-0.5"
                    style={{
                      color: r.color,
                      background: r.bg,
                      border: `1px solid ${r.border}`,
                    }}
                  >
                    {r.range}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white mb-0.5">
                      {r.label}
                    </div>
                    <div className="text-[12.5px] text-[var(--text2)]">
                      {r.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: score UI */}
          <div className="fade-up">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-7">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-[11px] font-semibold text-[var(--text2)] uppercase tracking-wider mb-1">
                    Biología · Mitosis
                  </div>
                  <div className="text-[12px] text-[var(--text2)]">
                    Última práctica: hace 2 horas
                  </div>
                </div>
                <div
                  className="text-[11px] font-semibold px-2.5 h-6 inline-flex items-center rounded-full"
                  style={{
                    color: "var(--green)",
                    background: "rgba(168,224,110,0.1)",
                    border: "1px solid rgba(168,224,110,0.2)",
                  }}
                >
                  Casi listo
                </div>
              </div>

              {/* Big score */}
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-[72px] font-black leading-none bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--green), var(--cyan))",
                  }}
                >
                  72
                </span>
                <span className="text-[28px] font-bold text-[var(--text2)]">
                  %
                </span>
              </div>
              <p className="text-[13px] text-[var(--text2)] mb-5">
                Necesitas 18 puntos más para estar listo.
              </p>

              {/* Progress bar */}
              <div className="relative h-2 bg-[var(--bg3)] rounded-full overflow-hidden mb-6">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: "72%",
                    background:
                      "linear-gradient(90deg, var(--grad-start), var(--grad-mid), var(--cyan))",
                  }}
                />
              </div>

              {/* Subtopics */}
              <div className="space-y-3 mb-6">
                {[
                  { label: "Fases de la mitosis", pct: 95, status: "Dominado" },
                  { label: "División celular", pct: 82, status: "Dominado" },
                  { label: "Ciclo celular", pct: 58, status: "Repasar" },
                ].map((t) => (
                  <div key={t.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[var(--text2)]">{t.label}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-medium"
                          style={{
                            color:
                              t.status === "Dominado"
                                ? "var(--green)"
                                : "var(--amber)",
                          }}
                        >
                          {t.status}
                        </span>
                        <span className="text-white font-semibold tabular-nums">
                          {t.pct}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-1 bg-[var(--bg3)] rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${t.pct}%`,
                          background:
                            t.status === "Dominado"
                              ? "var(--green)"
                              : "var(--amber)",
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-[11px] font-semibold text-[var(--purple-light)] uppercase tracking-wider mb-1.5">
                  Recomendación
                </div>
                <p className="text-[13px] text-[var(--text2)] leading-relaxed">
                  El ciclo celular te está costando. Haz 5 preguntas enfocadas
                  en eso y tu score sube a{" "}
                  <span className="text-white font-semibold">85%</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
