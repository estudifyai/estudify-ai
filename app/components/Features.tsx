const features = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
    title: "Resúmenes inteligentes",
    desc: "Sube PDFs, fotos de apuntes o texto. La IA extrae los conceptos clave y arma un resumen estructurado en segundos.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: "Flashcards automáticas",
    desc: "Genera entre 10 y 40 tarjetas de estudio con pregunta y respuesta, balanceadas por dificultad.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    ),
    title: "Exámenes de práctica",
    desc: "Preguntas de opción múltiple hechas desde tu material. Practica exactamente lo que entra en tu examen.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="10" x2="15" y2="10" />
        <line x1="12" y1="7" x2="12" y2="13" />
      </svg>
    ),
    title: "Tutor socrático",
    desc: "No te da la respuesta. Te guía con preguntas hasta que tú la descubras. Así se aprende de verdad.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
    title: "Exam Readiness Score",
    desc: "Mide cuánto dominas cada tema con precisión real —no cuánto tiempo estudiaste, sino cuánto aprendiste.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center max-w-[600px] mx-auto mb-16 fade-up">
          <div className="text-[12px] font-semibold text-[var(--purple-light)] uppercase tracking-[0.12em] mb-4">
            Funciones
          </div>
          <h2 className="text-[32px] md:text-[42px] font-bold text-white tracking-[-0.02em] leading-[1.1] mb-4">
            Todo lo que necesitas para dominar tu examen
          </h2>
          <p className="text-[16px] md:text-[17px] text-[var(--text2)] leading-relaxed">
            Sube tu material y la IA hace el resto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="fade-up group bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 md:p-6 transition-all duration-200 hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)]"
            >
              <div className="w-9 h-9 rounded-xl bg-[rgba(155,109,215,0.12)] border border-[rgba(155,109,215,0.2)] flex items-center justify-center text-[var(--purple-light)] mb-4 group-hover:bg-[rgba(155,109,215,0.18)] transition-colors">
                {f.icon}
              </div>
              <h3 className="text-[16px] font-semibold text-white mb-2 tracking-tight">
                {f.title}
              </h3>
              <p className="text-[14px] text-[var(--text2)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}

          {/* Wide card — anti-trampa positioning */}
          <div className="fade-up bg-gradient-to-br from-[rgba(108,63,160,0.08)] to-transparent border border-[rgba(108,63,160,0.2)] rounded-2xl p-5 md:p-6 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[var(--purple-light)] uppercase tracking-wider mb-3">
                Nuestro compromiso
              </div>
              <h3 className="text-[16px] font-semibold text-white mb-2 tracking-tight">
                Formación, no trampa
              </h3>
              <p className="text-[14px] text-[var(--text2)] leading-relaxed">
                Estudify no hace tu tarea ni genera respuestas para copiar.{" "}
                <span className="text-white">
                  Te entrena para dominar el examen.
                </span>{" "}
                Maestros y escuelas lo adoptan porque refuerza el aprendizaje real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
