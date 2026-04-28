"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  summary: string;
  flashcards: any[];
  quiz: any[];
  created_at: string;
}

export default function SummaryPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "flashcards" | "quiz">(
    "summary"
  );
  const [copied, setCopied] = useState(false);

  // Flashcard state
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (params.id === "temp") {
        const temp = sessionStorage.getItem("temp_result");
        if (temp) {
          const data = JSON.parse(temp);
          setProject({
            id: "temp",
            title: "Material procesado",
            summary: data.summary,
            flashcards: data.flashcards || [],
            quiz: data.quiz || [],
            created_at: new Date().toISOString(),
          });
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/app");
        return;
      }

      setProject(data);
      setLoading(false);
    };

    loadProject();
  }, [params.id, router]);

  const handleCopy = () => {
    if (project) {
      navigator.clipboard.writeText(project.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    setShowExplanation(true);
    if (project && option === project.quiz[currentQuestion]?.correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (project && currentQuestion < project.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#C3F73A]" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/app")}
          className="rounded-xl p-2 text-[#6a6a72] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {project.title}
          </h1>
          <p className="mt-1 text-[13px] text-[#6a6a72]">
            Generado{" "}
            {new Date(project.created_at).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 inline-flex rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-1">
        <TabButton
          active={activeTab === "summary"}
          onClick={() => setActiveTab("summary")}
          label="Resumen"
        />
        <TabButton
          active={activeTab === "flashcards"}
          onClick={() => setActiveTab("flashcards")}
          label={`Flashcards (${project.flashcards.length})`}
          disabled={project.flashcards.length === 0}
        />
        <TabButton
          active={activeTab === "quiz"}
          onClick={() => setActiveTab("quiz")}
          label={`Examen (${project.quiz.length})`}
          disabled={project.quiz.length === 0}
        />
      </div>

      {/* ═══ SUMMARY TAB ═══ */}
      {activeTab === "summary" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[12px] font-medium uppercase tracking-[0.15em] text-[#6a6a72]">
              Resumen generado por IA
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] text-[#8a8a93] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-[#C3F73A]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-8">
            <div
              className="prose prose-invert max-w-none text-[15px] leading-[1.7] text-[#d4d4d8]
              prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white
              prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-xl
              prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-lg
              prose-strong:text-white
              prose-ul:space-y-1
              prose-li:text-[#a8a8b0]"
              dangerouslySetInnerHTML={{
                __html: project.summary
                  .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                  .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/^- (.*$)/gim, '<li>$1</li>')
                  .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
                  .replace(/\n{2,}/g, '</p><p>')
                  .replace(/\n/g, '<br/>'),
              }}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setActiveTab("flashcards")}
              disabled={project.flashcards.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] px-5 py-3 text-[13px] font-medium text-white transition hover:border-[rgba(255,255,255,0.14)] disabled:opacity-40"
            >
              <BookOpen className="h-4 w-4 text-[#5EC8E8]" />
              Practicar flashcards
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              disabled={project.quiz.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] px-5 py-3 text-[13px] font-medium text-white transition hover:border-[rgba(255,255,255,0.14)] disabled:opacity-40"
            >
              <GraduationCap className="h-4 w-4 text-[#8B7FD8]" />
              Tomar examen
            </button>
          </div>
        </div>
      )}

      {/* ═══ FLASHCARDS TAB ═══ */}
      {activeTab === "flashcards" && project.flashcards.length > 0 && (
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 text-center text-[13px] text-[#6a6a72]">
            {currentCard + 1} de {project.flashcards.length}
          </div>

          <div
            onClick={() => setShowAnswer(!showAnswer)}
            className="cursor-pointer rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-10 text-center transition hover:border-[rgba(255,255,255,0.14)]"
            style={{ minHeight: "240px" }}
          >
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6a6a72]">
              {showAnswer ? "Respuesta" : "Pregunta"}
            </span>
            <p className="text-xl font-medium leading-relaxed text-white">
              {showAnswer
                ? project.flashcards[currentCard]?.answer
                : project.flashcards[currentCard]?.question}
            </p>
            {!showAnswer && (
              <p className="mt-6 text-[12px] text-[#6a6a72]">
                Click para ver respuesta
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                setShowAnswer(false);
                setCurrentCard(Math.max(0, currentCard - 1));
              }}
              disabled={currentCard === 0}
              className="rounded-xl border border-[rgba(255,255,255,0.07)] px-5 py-2.5 text-[13px] text-white transition hover:border-[rgba(255,255,255,0.14)] disabled:opacity-30"
            >
              Anterior
            </button>
            <button
              onClick={() => {
                setShowAnswer(false);
                setCurrentCard(
                  Math.min(project.flashcards.length - 1, currentCard + 1)
                );
              }}
              disabled={currentCard === project.flashcards.length - 1}
              className="rounded-xl bg-[#C3F73A] px-5 py-2.5 text-[13px] font-bold text-[#050507] transition hover:shadow-[0_0_20px_-4px_rgba(195,247,58,0.4)] disabled:opacity-30"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* ═══ QUIZ TAB ═══ */}
      {activeTab === "quiz" && project.quiz.length > 0 && (
        <div className="mx-auto max-w-2xl">
          {quizComplete ? (
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(195,247,58,0.1)]">
                <GraduationCap className="h-8 w-8 text-[#C3F73A]" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                {score}/{project.quiz.length}
              </h2>
              <p className="mt-2 text-[15px] text-[#8a8a93]">
                {score >= project.quiz.length * 0.9
                  ? "Excelente. Dominas este material."
                  : score >= project.quiz.length * 0.7
                  ? "Casi llegas. Repasa los temas que fallaste."
                  : score >= project.quiz.length * 0.5
                  ? "En progreso. Practica las flashcards y vuelve a intentar."
                  : "Empecemos por lo básico. Revisa el resumen de nuevo."}
              </p>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setScore(0);
                  setQuizComplete(false);
                }}
                className="mt-6 rounded-xl bg-[#C3F73A] px-6 py-3 text-[14px] font-bold text-[#050507]"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between text-[13px] text-[#6a6a72]">
                <span>
                  Pregunta {currentQuestion + 1} de {project.quiz.length}
                </span>
                <span>{score} correctas</span>
              </div>

              {/* Progress bar */}
              <div className="mb-6 h-1 w-full rounded-full bg-[rgba(255,255,255,0.05)]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / project.quiz.length) * 100
                    }%`,
                    background:
                      "linear-gradient(90deg, #C3F73A, #5EC8E8, #8B7FD8)",
                  }}
                />
              </div>

              <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-8">
                <p className="mb-6 text-lg font-medium leading-relaxed text-white">
                  {project.quiz[currentQuestion]?.question}
                </p>

                <div className="space-y-3">
                  {Object.entries(
                    project.quiz[currentQuestion]?.options || {}
                  ).map(([key, value]) => {
                    const isCorrect =
                      key === project.quiz[currentQuestion]?.correct;
                    const isSelected = selectedAnswer === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleQuizAnswer(key)}
                        disabled={!!selectedAnswer}
                        className={`w-full rounded-xl border px-5 py-4 text-left text-[14px] transition ${
                          selectedAnswer
                            ? isCorrect
                              ? "border-[#C3F73A] bg-[rgba(195,247,58,0.1)] text-white"
                              : isSelected
                              ? "border-red-500/50 bg-red-500/10 text-red-300"
                              : "border-[rgba(255,255,255,0.05)] text-[#6a6a72]"
                            : "border-[rgba(255,255,255,0.07)] text-white hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)]"
                        }`}
                      >
                        <span className="mr-3 font-semibold text-[#6a6a72]">
                          {key.toUpperCase()}.
                        </span>
                        {value as string}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="mt-6 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-5">
                    <p className="text-[13px] leading-relaxed text-[#a8a8b0]">
                      <span className="font-semibold text-white">
                        Explicación:{" "}
                      </span>
                      {project.quiz[currentQuestion]?.explanation}
                    </p>
                  </div>
                )}

                {selectedAnswer && (
                  <button
                    onClick={nextQuestion}
                    className="mt-6 w-full rounded-xl bg-[#C3F73A] py-3 text-[14px] font-bold text-[#050507] transition hover:shadow-[0_0_20px_-4px_rgba(195,247,58,0.4)]"
                  >
                    {currentQuestion < project.quiz.length - 1
                      ? "Siguiente pregunta"
                      : "Ver resultados"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-[13px] font-medium transition ${
        active
          ? "bg-[rgba(195,247,58,0.1)] text-[#C3F73A]"
          : disabled
          ? "cursor-not-allowed text-[#4a4a52]"
          : "text-[#8a8a93] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
