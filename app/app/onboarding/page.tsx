"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Upload, BookOpen, GraduationCap, Sparkles, Target } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    title: "Bienvenido a estudify.ai",
    description:
      "Tu laboratorio de estudio con inteligencia artificial. Convierte cualquier material en herramientas para dominar tu examen.",
    color: "#C3F73A",
  },
  {
    icon: Upload,
    title: "Sube tu material",
    description:
      "PDF, foto de apuntes o texto pegado. La IA analiza el contenido y lo estructura para ti. Solo acepta lo que tú subes — nunca inventa.",
    color: "#7EE8C6",
  },
  {
    icon: BookOpen,
    title: "Resumen + Flashcards + Examen",
    description:
      "En menos de 60 segundos obtienes un resumen claro, flashcards con spaced repetition y un examen de práctica con explicaciones.",
    color: "#5EC8E8",
  },
  {
    icon: GraduationCap,
    title: "Tutor socrático",
    description:
      "Cuando no entiendas algo, Orbi te guía con preguntas hasta que descubras la respuesta tú mismo. No te la da — te la enseña.",
    color: "#8B7FD8",
  },
  {
    icon: Target,
    title: "Exam Readiness Score",
    description:
      "La métrica que nadie más tiene. Mide tu dominio real — no horas estudiadas. Cuando llegas a 90%, estás listo para arrasar.",
    color: "#C3F73A",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      // Marcar onboarding completo en localStorage
      localStorage.setItem("estudify_onboarding_done", "true");
      router.push("/app/upload");
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("estudify_onboarding_done", "true");
    router.push("/app");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      {/* Nebula background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 40%, ${current.color}08 0%, transparent 60%)`,
          transition: "background 0.8s ease",
        }}
      />

      <div className="relative w-full max-w-lg text-center">
        {/* Progress dots */}
        <div className="mb-12 flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === step ? "32px" : "8px",
                background:
                  i === step
                    ? current.color
                    : i < step
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500"
          style={{ background: `${current.color}15` }}
        >
          <current.icon
            className="h-9 w-9 transition-all duration-500"
            style={{ color: current.color }}
          />
        </div>

        {/* Content */}
        <h1
          className="text-3xl font-semibold tracking-tight text-white transition-all duration-500"
          key={`title-${step}`}
        >
          {current.title}
        </h1>
        <p
          className="mx-auto mt-4 max-w-md text-[16px] leading-[1.6] text-[#8a8a93] transition-all duration-500"
          key={`desc-${step}`}
        >
          {current.description}
        </p>

        {/* Actions */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={handleNext}
            className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[14px] font-bold transition"
            style={{
              background: current.color,
              color: "#050507",
            }}
          >
            {isLast ? "Empezar a estudiar" : "Siguiente"}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>

          {!isLast && (
            <button
              onClick={handleSkip}
              className="text-[13px] text-[#6a6a72] transition hover:text-white"
            >
              Saltar intro
            </button>
          )}
        </div>

        {/* Step counter */}
        <p className="mt-12 text-[11px] text-[#4a4a52]">
          {step + 1} de {STEPS.length}
        </p>
      </div>
    </div>
  );
}
