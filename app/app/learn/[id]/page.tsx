"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { sfx, isMuted, toggleMute } from "../../../lib/feedback";
import {
  BookOpen,
  Layers,
  GraduationCap,
  Check,
  Lock,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Target,
  Volume2,
  VolumeX,
} from "lucide-react";

/* ─── Tipos ─── */
interface Project {
  id: string;
  title: string;
  summary: string;
  flashcards: { question: string; answer: string }[];
  quiz: {
    question: string;
    options: Record<string, string>;
    correct: string;
    explanation: string;
  }[];
}

interface PathNode {
  id: string;
  type: "read" | "flashcards" | "quiz";
  label: string;
  section: number;
  cards?: Project["flashcards"];
  questions?: Project["quiz"];
}

const NODE_ICON = { read: BookOpen, flashcards: Layers, quiz: GraduationCap };
const NODE_COLOR = { read: "#C3F73A", flashcards: "#5EC8E8", quiz: "#8B7FD8" };

export default function LearnPathPage() {
  const params = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeNode, setActiveNode] = useState<PathNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isMuted());
  }, []);

  /* ─── Cargar proyecto + progreso ─── */
  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUserId(session.user.id);

      const [projRes, progRes] = await Promise.all([
        supabase
          .from("projects")
          .select("id, title, summary, flashcards, quiz")
          .eq("id", params.id)
          .single(),
        supabase
          .from("learn_progress")
          .select("completed")
          .eq("project_id", params.id)
          .eq("user_id", session.user.id)
          .maybeSingle(),
      ]);

      if (projRes.error || !projRes.data) {
        router.push("/app");
        return;
      }

      setProject(projRes.data);
      setCompleted((progRes.data?.completed as string[]) || []);
      setLoading(false);
    };
    load();
  }, [params.id, router]);

  /* ─── Construir el camino desde el material existente ─── */
  const nodes: PathNode[] = useMemo(() => {
    if (!project) return [];
    const cards = project.flashcards || [];
    const quiz = project.quiz || [];
    const halfCards = Math.ceil(cards.length / 2);
    const halfQuiz = Math.ceil(quiz.length / 2);

    const n: PathNode[] = [
      { id: "read", type: "read", label: "Lee el resumen", section: 1 },
    ];
    if (cards.length > 0)
      n.push({
        id: "flash-1",
        type: "flashcards",
        label: "Flashcards — parte 1",
        section: 1,
        cards: cards.slice(0, halfCards),
      });
    if (quiz.length > 0)
      n.push({
        id: "quiz-1",
        type: "quiz",
        label: "Mini quiz",
        section: 1,
        questions: quiz.slice(0, halfQuiz),
      });
    if (cards.length > halfCards)
      n.push({
        id: "flash-2",
        type: "flashcards",
        label: "Flashcards — parte 2",
        section: 2,
        cards: cards.slice(halfCards),
      });
    if (quiz.length > halfQuiz)
      n.push({
        id: "quiz-final",
        type: "quiz",
        label: "Examen final",
        section: 2,
        questions: quiz.slice(halfQuiz),
      });
    return n;
  }, [project]);

  const progressPct =
    nodes.length > 0
      ? Math.round((completed.length / nodes.length) * 100)
      : 0;

  const isUnlocked = (index: number) =>
    index === 0 || nodes.slice(0, index).every((n) => completed.includes(n.id));

  /* ─── Guardar progreso ─── */
  const completeNode = async (nodeId: string) => {
    if (!userId || completed.includes(nodeId)) {
      setActiveNode(null);
      return;
    }
    const next = [...completed, nodeId];
    setCompleted(next);
    sfx.complete();
    setActiveNode(null);

    await supabase.from("learn_progress").upsert(
      {
        user_id: userId,
        project_id: params.id as string,
        completed: next,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,project_id" }
    );
  };

  if (loading || !project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#5EC8E8]" />
      </div>
    );
  }

  /* ─── Vista de actividad activa ─── */
  if (activeNode) {
    return (
      <ActivityView
        node={activeNode}
        project={project}
        userId={userId!}
        onExit={() => setActiveNode(null)}
        onComplete={() => completeNode(activeNode.id)}
      />
    );
  }

  /* ─── Vista del camino ─── */
  const sections = [1, 2];

  return (
    <div className="mx-auto max-w-[900px]">
      {/* Header */}
      <div className="app-reveal app-reveal-1 mb-10 flex items-end justify-between gap-6">
        <div>
          <button
            onClick={() => router.push(`/app/summary/${project.id}`)}
            className="mono mb-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#6a6a72] transition hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            {project.title}
          </button>
          <h1 className="editorial text-[clamp(2rem,4vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-white">
            Camino de{" "}
            <span className="editorial-italic brand-gradient-text">
              estudio
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Progreso */}
          <div className="surface-panel hidden min-w-[200px] p-5 md:block">
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-[#C3F73A]" />
              <span className="mono text-[10px] uppercase tracking-[0.16em] text-[#6a6a72]">
                Progreso
              </span>
            </div>
            <div className="editorial mt-2 text-3xl text-white">
              {progressPct}%
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #C3F73A, #5EC8E8, #8B7FD8)",
                }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              const m = toggleMute();
              setMuted(m);
              if (!m) sfx.flip();
            }}
            className="rounded-full border border-[rgba(255,255,255,0.08)] p-2.5 text-[#6a6a72] transition hover:text-white"
            title={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Camino */}
      <div className="app-reveal app-reveal-2 relative pb-16">
        {sections.map((section) => {
          const sectionNodes = nodes.filter((n) => n.section === section);
          if (sectionNodes.length === 0) return null;
          return (
            <div key={section}>
              <div className="mb-8 mt-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-[rgba(255,255,255,0.06)]" />
                <span className="mono text-[10px] uppercase tracking-[0.24em] text-[#6a6a72]">
                  Sección {section} —{" "}
                  {section === 1 ? "Fundamentos" : "Dominio"}
                </span>
                <div className="h-px flex-1 bg-[rgba(255,255,255,0.06)]" />
              </div>

              <div className="flex flex-col items-center gap-3">
                {sectionNodes.map((node, i) => {
                  const globalIndex = nodes.findIndex((n) => n.id === node.id);
                  const done = completed.includes(node.id);
                  const unlocked = isUnlocked(globalIndex);
                  const isNext = unlocked && !done;
                  const Icon = NODE_ICON[node.type];
                  const color = NODE_COLOR[node.type];
                  const offset = (globalIndex % 3) - 1; // -1, 0, 1 zigzag

                  return (
                    <div
                      key={node.id}
                      className="flex w-full flex-col items-center"
                      style={{ transform: `translateX(${offset * 70}px)` }}
                    >
                      <button
                        onClick={() => unlocked && setActiveNode(node)}
                        disabled={!unlocked}
                        className={`group relative flex h-[72px] w-[72px] items-center justify-center rounded-full border transition-all duration-300 ${
                          isNext
                            ? "scale-110 border-transparent"
                            : done
                            ? "border-[rgba(195,247,58,0.35)] bg-[rgba(195,247,58,0.08)]"
                            : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] opacity-40"
                        } ${unlocked ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}`}
                        style={
                          isNext
                            ? {
                                background: `${color}14`,
                                boxShadow: `0 0 0 1.5px ${color}66, 0 0 32px -6px ${color}55`,
                              }
                            : undefined
                        }
                      >
                        {done ? (
                          <Check className="h-6 w-6 text-[#C3F73A]" />
                        ) : unlocked ? (
                          <Icon className="h-6 w-6" style={{ color }} />
                        ) : (
                          <Lock className="h-5 w-5 text-[#4a4a52]" />
                        )}

                        {isNext && (
                          <span
                            className="mono absolute -right-2 top-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#050507]"
                            style={{ background: color }}
                          >
                            Sigue
                          </span>
                        )}
                      </button>
                      <span
                        className={`mt-2 text-[12px] ${
                          isNext ? "font-medium text-white" : "text-[#6a6a72]"
                        }`}
                      >
                        {node.label}
                      </span>
                      {i < sectionNodes.length - 1 && (
                        <div className="my-1 h-6 w-px bg-[rgba(255,255,255,0.08)]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Completado */}
        {progressPct === 100 && (
          <div className="brand-ring mt-12">
            <div className="surface-panel !border-0 p-8 text-center">
              <p className="editorial text-2xl text-white">
                Camino completado.
              </p>
              <p className="mt-2 text-[14px] text-[#8a8a93]">
                Revisa tu Readiness Score actualizado en Mi progreso.
              </p>
              <button
                onClick={() => router.push("/app/progress")}
                className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px]"
              >
                Ver mi progreso
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════ VISTA DE ACTIVIDAD ═══════════ */
function ActivityView({
  node,
  project,
  userId,
  onExit,
  onComplete,
}: {
  node: PathNode;
  project: Project;
  userId: string;
  onExit: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="mx-auto max-w-[760px]">
      <button
        onClick={onExit}
        className="mono mb-8 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#6a6a72] transition hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        Volver al camino
      </button>

      {node.type === "read" && (
        <ReadActivity summary={project.summary} onComplete={onComplete} />
      )}
      {node.type === "flashcards" && (
        <FlashcardsActivity cards={node.cards!} onComplete={onComplete} />
      )}
      {node.type === "quiz" && (
        <QuizActivity
          questions={node.questions!}
          isFinal={node.id === "quiz-final"}
          userId={userId}
          project={project}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}

function ReadActivity({
  summary,
  onComplete,
}: {
  summary: string;
  onComplete: () => void;
}) {
  return (
    <div>
      <h2 className="editorial mb-6 text-3xl text-white">Lee el resumen</h2>
      <div className="surface-panel p-8">
        <div className="whitespace-pre-wrap text-[15px] leading-[1.75] text-[#d4d4d8]">
          {summary}
        </div>
      </div>
      <button
        onClick={onComplete}
        className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px]"
      >
        <Check className="h-4 w-4" />
        Terminé de leer
      </button>
    </div>
  );
}

function FlashcardsActivity({
  cards,
  onComplete,
}: {
  cards: { question: string; answer: string }[];
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const isLast = index === cards.length - 1;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="editorial text-3xl text-white">Flashcards</h2>
        <span className="mono text-[11px] text-[#6a6a72]">
          {index + 1} / {cards.length}
        </span>
      </div>

      <div
        onClick={() => {
          sfx.flip();
          setShowAnswer(!showAnswer);
        }}
        className="surface-panel flex min-h-[260px] cursor-pointer flex-col items-center justify-center p-10 text-center"
      >
        <span className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-[#6a6a72]">
          {showAnswer ? "Respuesta" : "Pregunta"}
        </span>
        <p
          key={`${index}-${showAnswer}`}
          className="card-face text-xl font-medium leading-relaxed text-white"
        >
          {showAnswer ? cards[index].answer : cards[index].question}
        </p>
        {!showAnswer && (
          <p className="mt-5 text-[12px] text-[#6a6a72]">
            Click para revelar
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => {
            setShowAnswer(false);
            setIndex(Math.max(0, index - 1));
          }}
          disabled={index === 0}
          className="rounded-full border border-[rgba(255,255,255,0.08)] px-6 py-2.5 text-[13px] text-white transition hover:border-[rgba(255,255,255,0.16)] disabled:opacity-30"
        >
          Anterior
        </button>
        <button
          onClick={() => {
            if (isLast) {
              onComplete();
            } else {
              setShowAnswer(false);
              setIndex(index + 1);
            }
          }}
          className="btn-primary rounded-full px-6 py-2.5 text-[13px]"
        >
          {isLast ? "Terminar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}

function QuizActivity({
  questions,
  isFinal,
  userId,
  project,
  onComplete,
}: {
  questions: Project["quiz"];
  isFinal: boolean;
  userId: string;
  project: Project;
  onComplete: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [topicStats, setTopicStats] = useState<
    Record<string, { correct: number; total: number }>
  >({});

  const q = questions[current];

  const answer = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.correct) {
      setScore(score + 1);
      sfx.correct();
    } else {
      sfx.wrong();
    }

    const topic = (q as any).topic || "General";
    setTopicStats((prev) => ({
      ...prev,
      [topic]: {
        correct: (prev[topic]?.correct || 0) + (opt === q.correct ? 1 : 0),
        total: (prev[topic]?.total || 0) + 1,
      },
    }));
  };

  const next = async () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setFinished(true);
      // Tanto el mini quiz como el examen final alimentan el Readiness Score
      const finalScore = score;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        fetch("/api/readiness", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId,
            projectId: project.id,
            subject: project.title,
            quizScore: finalScore,
            quizTotal: questions.length,
            topicBreakdown: topicStats,
            flashcardsReviewed: project.flashcards?.length || 0,
            totalFlashcards: project.flashcards?.length || 0,
          }),
        }).catch(() => {});
      }
    }
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="surface-panel p-10 text-center">
        <p className="mono text-[10px] uppercase tracking-[0.2em] text-[#6a6a72]">
          Resultado
        </p>
        <p className="editorial mt-4 text-6xl text-white">
          {score}/{questions.length}
        </p>
        <p className="mt-3 text-[14px] text-[#8a8a93]">
          {pct >= 80
            ? "Excelente. Dominas esta parte."
            : pct >= 60
            ? "Bien. Repasa lo que fallaste y sigue."
            : "Vuelve a las flashcards y reintenta."}
        </p>
        <button
          onClick={onComplete}
          className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px]"
        >
          Continuar
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="editorial text-3xl text-white">
          {isFinal ? "Examen final" : "Mini quiz"}
        </h2>
        <span className="mono text-[11px] text-[#6a6a72]">
          {current + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((current + 1) / questions.length) * 100}%`,
            background: "linear-gradient(90deg, #C3F73A, #5EC8E8, #8B7FD8)",
          }}
        />
      </div>

      <div className="surface-panel p-8">
        <p className="mb-6 text-lg font-medium leading-relaxed text-white">
          {q.question}
        </p>
        <div className="space-y-3">
          {Object.entries(q.options || {}).map(([key, value]) => {
            const isCorrect = key === q.correct;
            const isSelected = selected === key;
            return (
              <button
                key={key}
                onClick={() => answer(key)}
                disabled={!!selected}
                className={`w-full rounded-xl border px-5 py-4 text-left text-[14px] transition ${
                  selected
                    ? isCorrect
                      ? "border-[#C3F73A] bg-[rgba(195,247,58,0.1)] text-white"
                      : isSelected
                      ? "border-red-500/50 bg-red-500/10 text-red-300"
                      : "border-[rgba(255,255,255,0.05)] text-[#6a6a72]"
                    : "border-[rgba(255,255,255,0.07)] text-white hover:border-[rgba(255,255,255,0.2)]"
                }`}
              >
                <span className="mono mr-3 text-[12px] font-semibold text-[#6a6a72]">
                  {key.toUpperCase()}.
                </span>
                {value}
              </button>
            );
          })}
        </div>

        {selected && (
          <>
            <div className="mt-6 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-5 text-[13px] leading-relaxed text-[#a8a8b0]">
              <span className="font-semibold text-white">Explicación: </span>
              {q.explanation}
            </div>
            <button
              onClick={next}
              className="btn-primary mt-6 w-full rounded-xl py-3 text-[14px]"
            >
              {current < questions.length - 1
                ? "Siguiente pregunta"
                : "Ver resultado"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
