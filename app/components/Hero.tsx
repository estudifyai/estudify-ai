export default function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-20 px-6 md:px-8 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[-180px] right-[-80px] w-[560px] h-[560px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(108,63,160,0.28), transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-[-280px] left-[-180px] w-[700px] h-[700px] rounded-full opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(0,212,255,0.12), transparent 60%)",
          }}
        />
      </div>

      <div className="max-w-[1120px] mx-auto relative z-10">
        {/* Headline block */}
        <div className="text-center max-w-[820px] mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-6 px-3 h-7 rounded-full bg-[var(--surface)] border border-[var(--border)]">
            <span className="w-1.5 h-1.5 bg-[var(--green)] rounded-full animate-pulse" />
            <span className="text-[12px] text-[var(--text2)] font-medium">
              Beta próximamente
            </span>
          </div>

          <h1 className="text-[42px] md:text-[62px] font-black text-white leading-[1.05] tracking-[-0.03em] mb-5">
            Estudia menos.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--grad-start), var(--grad-mid), var(--grad-end))",
              }}
            >
              Aprende más.
            </span>
          </h1>

          <p className="text-[17px] md:text-[18px] text-[var(--text2)] leading-[1.65] max-w-[600px] mx-auto mb-9">
            Convierte tus apuntes en resúmenes, flashcards y exámenes —con{" "}
            <span className="text-white font-medium">Exam Readiness Score</span>{" "}
            que mide cuánto dominas de verdad.
          </p>

          <div className="flex gap-3 justify-center items-center flex-wrap">
            <a
              href="#waitlist"
              className="h-12 px-7 inline-flex items-center rounded-full bg-white text-[var(--bg)] text-[15px] font-semibold hover:bg-[rgba(255,255,255,0.88)] transition-all"
            >
              Únete a la beta
            </a>
            <a
              href="#how"
              className="h-12 px-7 inline-flex items-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-white text-[15px] font-semibold hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-all"
            >
              Ver cómo funciona
              <svg
                className="ml-2 w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Product mock */}
        <div className="fade-up relative max-w-[960px] mx-auto">
          <div
            className="absolute inset-0 rounded-3xl opacity-40 blur-3xl -z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(108,63,160,0.5), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 md:p-8 shadow-2xl">
            <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-4">
              {/* Readiness card */}
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[12px] text-[var(--text2)] mb-1 font-medium">
                      Exam Readiness Score
                    </div>
                    <div className="text-[14px] text-white font-semibold">
                      Biología Celular · Mitosis
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--green)] bg-[rgba(168,224,110,0.1)] border border-[rgba(168,224,110,0.2)] px-2.5 h-6 inline-flex items-center rounded-full shrink-0">
                    En camino
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <div
                    className="text-[60px] font-black leading-none bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, var(--green), var(--cyan))",
                    }}
                  >
                    87
                  </div>
                  <div className="text-[22px] font-bold text-[var(--text2)]">
                    %
                  </div>
                </div>

                <div className="relative h-1.5 bg-[var(--bg3)] rounded-full overflow-hidden mb-5">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: "87%",
                      background:
                        "linear-gradient(90deg, var(--grad-start), var(--grad-mid), var(--cyan))",
                    }}
                  />
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Fases de la mitosis", pct: 95 },
                    { label: "División celular", pct: 82 },
                    { label: "Ciclo celular", pct: 68 },
                  ].map((t) => (
                    <div
                      key={t.label}
                      className="flex items-center justify-between text-[13px]"
                    >
                      <div className="flex items-center gap-2 text-[var(--text2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shrink-0" />
                        {t.label}
                      </div>
                      <div className="text-white font-semibold tabular-nums">
                        {t.pct}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-3">
                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5 flex-1">
                  <div className="text-[11px] font-semibold text-[var(--purple-light)] uppercase tracking-wider mb-3">
                    Flashcard 4 / 20
                  </div>
                  <div className="text-[13px] text-white font-semibold mb-2 leading-snug">
                    ¿Qué ocurre durante la anafase?
                  </div>
                  <div className="text-[12px] text-[var(--text2)] leading-relaxed">
                    Las cromátidas hermanas se separan y migran hacia polos
                    opuestos de la célula.
                  </div>
                </div>

                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
                  <div className="text-[12px] font-semibold text-white mb-2">
                    Resumen generado
                  </div>
                  <div className="text-[12px] text-[var(--text2)] leading-relaxed">
                    La mitosis produce dos células hijas idénticas. Consta de
                    cuatro fases: profase, metafase, anafase y telofase.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="max-w-[600px] mx-auto mt-14 grid grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-[var(--border)]">
          {[
            { num: "60s", label: "Primer resumen" },
            { num: "100%", label: "Basado en tu material" },
            { num: "0%", label: "Trampa" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-[28px] md:text-[32px] font-bold bg-clip-text text-transparent tracking-tight"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
                }}
              >
                {s.num}
              </div>
              <div className="text-[13px] text-[var(--text2)] mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
