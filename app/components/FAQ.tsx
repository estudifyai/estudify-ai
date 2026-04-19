"use client";

import { useState } from "react";

const faqs = [
  {
    q: "¿Estudify hace mi tarea?",
    a: "No. Estudify no genera respuestas para entregar. Te crea material de estudio —resúmenes, flashcards, exámenes— para que tú domines el tema. La diferencia es fundamental: te forma, no te suplanta.",
  },
  {
    q: "¿Qué formatos acepta?",
    a: "PDF, imágenes de apuntes (JPG, PNG), y texto pegado directamente. Próximamente: audio y video de clases grabadas con transcripción automática.",
  },
  {
    q: "¿Sirve para prepa y universidad?",
    a: "Sí. Funciona para cualquier materia y nivel desde secundaria hasta posgrado. Matemáticas, Biología, Historia, Química, Derecho, Economía —si tienes el material, Estudify lo convierte.",
  },
  {
    q: "¿Mis archivos son privados?",
    a: "100%. Todos los archivos se encriptan en tránsito y en reposo (AES-256). Se eliminan automáticamente después de 30 días. Nunca se venden ni comparten con terceros.",
  },
  {
    q: "¿Qué es el Exam Readiness Score?",
    a: "Es un porcentaje que mide cuánto dominas un tema basado en tu práctica real. Combina tu precisión en quizzes (40%), retención en flashcards (30%), cobertura del material (15%) y consistencia temporal (15%). No mide cuánto tiempo estudiaste, mide cuánto aprendiste.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. Sin contratos ni letras chicas. Cancelas cuando quieras desde tu cuenta y no se hace ningún cobro adicional.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-[720px] mx-auto">
        <div className="text-center mb-14 fade-up">
          <div className="text-[12px] font-semibold text-[var(--purple-light)] uppercase tracking-[0.12em] mb-4">
            FAQ
          </div>
          <h2 className="text-[32px] md:text-[42px] font-bold text-white tracking-[-0.02em] leading-[1.1]">
            Todo lo que quieres saber
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-colors hover:border-[var(--border-hover)]"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 md:px-6 md:py-5 flex justify-between items-center text-left gap-4"
                aria-expanded={open === i}
              >
                <span className="text-[15px] font-semibold text-white leading-snug">
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 w-6 h-6 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--text2)] transition-transform duration-200 ${
                    open === i ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? "max-h-64" : "max-h-0"
                }`}
              >
                <p className="px-5 pb-5 md:px-6 md:pb-5 text-[14px] text-[var(--text2)] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
