const steps = [
  {
    num: "1",
    tag: "Upload",
    title: "Sube tu material",
    desc: "PDF, fotos de apuntes, texto pegado o audio de clase. En cualquier formato.",
    detail: "Menos de 30 segundos para subir y procesar.",
  },
  {
    num: "2",
    tag: "Generación",
    title: "La IA lo analiza",
    desc: "Extrae conceptos clave, construye tu resumen y genera flashcards y examen de práctica.",
    detail: "Todo listo en menos de 60 segundos.",
  },
  {
    num: "3",
    tag: "Dominio",
    title: "Practica hasta dominar",
    desc: "Responde flashcards y exámenes. Tu Exam Readiness Score sube con cada respuesta correcta.",
    detail: "Sabes exactamente cuándo estás listo.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="py-16 md:py-24 px-6 md:px-8 border-y border-[var(--border)]"
      style={{ background: "var(--bg2)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center max-w-[600px] mx-auto mb-16 fade-up">
          <div className="text-[12px] font-semibold text-[var(--purple-light)] uppercase tracking-[0.12em] mb-4">
            Cómo funciona
          </div>
          <h2 className="text-[32px] md:text-[42px] font-bold text-white tracking-[-0.02em] leading-[1.1] mb-4">
            Tres pasos. Menos de 90 segundos.
          </h2>
          <p className="text-[16px] md:text-[17px] text-[var(--text2)] leading-relaxed">
            De apuntes desordenados a material de estudio listo para examen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {steps.map((s) => (
            <div
              key={s.num}
              className="fade-up bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:border-[var(--border-hover)] transition-all"
            >
              {/* Step number background */}
              <div
                className="absolute top-4 right-4 text-[64px] font-black leading-none select-none pointer-events-none opacity-[0.04] text-white"
                aria-hidden="true"
              >
                {s.num}
              </div>

              <div className="flex items-center gap-3 mb-5 relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--purple), var(--purple-light))",
                  }}
                >
                  {s.num}
                </div>
                <span className="text-[11px] font-semibold text-[var(--text2)] uppercase tracking-wider">
                  {s.tag}
                </span>
              </div>

              <h3 className="text-[16px] font-semibold text-white mb-2 tracking-tight">
                {s.title}
              </h3>
              <p className="text-[14px] text-[var(--text2)] leading-relaxed mb-4">
                {s.desc}
              </p>
              <div className="text-[12px] text-[var(--purple-light)] font-medium">
                {s.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
