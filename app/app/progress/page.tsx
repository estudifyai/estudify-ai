"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { TrendingUp, BookOpen, GraduationCap, FileText, Target } from "lucide-react";

interface ReadinessScore {
  id: string;
  subject: string;
  score: number;
  quiz_score: number;
  flashcards_reviewed: number;
  total_flashcards: number;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  flashcards: any[];
  quiz: any[];
  created_at: string;
}

export default function ProgressPage() {
  const [scores, setScores] = useState<ReadinessScore[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const uid = session.user.id;

      const [scoresRes, projectsRes] = await Promise.all([
        supabase
          .from("readiness_scores")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("projects")
          .select("id, title, flashcards, quiz, created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false }),
      ]);

      setScores(scoresRes.data || []);
      setProjects(projectsRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  // Calcular stats generales
  const totalProjects = projects.length;
  const totalFlashcards = projects.reduce(
    (sum, p) => sum + (p.flashcards?.length || 0),
    0
  );
  const totalQuizQuestions = projects.reduce(
    (sum, p) => sum + (p.quiz?.length || 0),
    0
  );
  const latestScore = scores.length > 0 ? scores[0].score : null;
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
      : null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#C3F73A";
    if (score >= 70) return "#5EC8E8";
    if (score >= 50) return "#8B7FD8";
    return "#ef4444";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Listo para dominar.";
    if (score >= 70) return "Casi llegas. Repasa lo débil.";
    if (score >= 50) return "En progreso. Sigue practicando.";
    return "Empecemos por lo básico.";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C3F73A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Mi progreso
        </h1>
        <p className="mt-2 text-[15px] text-[#8a8a93]">
          Tu Exam Readiness Score y estadísticas de estudio.
        </p>
      </div>

      {/* Exam Readiness Score — hero card */}
      <div className="mb-8 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-8 md:p-10">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          {/* Score circle */}
          <div className="relative h-44 w-44 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#C3F73A" />
                  <stop offset="33%" stopColor="#7EE8C6" />
                  <stop offset="66%" stopColor="#5EC8E8" />
                  <stop offset="100%" stopColor="#8B7FD8" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="4"
              />
              {latestScore !== null && (
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="276.46"
                  strokeDashoffset={
                    276.46 - (276.46 * latestScore) / 100
                  }
                  style={{
                    transition:
                      "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-semibold tracking-tight text-white">
                {latestScore !== null ? latestScore : "—"}
              </span>
              {latestScore !== null && (
                <span className="text-[12px] text-[#6a6a72]">/ 100</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <Target className="h-4 w-4 text-[#C3F73A]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#C3F73A]">
                Exam Readiness Score
              </span>
            </div>
            <p className="mt-3 text-xl font-medium text-white">
              {latestScore !== null
                ? getScoreMessage(latestScore)
                : "Completa un quiz para ver tu score."}
            </p>
            <p className="mt-2 text-[14px] text-[#8a8a93]">
              {latestScore !== null
                ? "Basado en tu precisión en quizzes, retención en flashcards y cobertura del material."
                : "Sube material, toma un quiz, y tu Readiness Score aparecerá aquí."}
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Materiales"
          value={String(totalProjects)}
          sub="subidos"
        />
        <StatCard
          icon={BookOpen}
          label="Flashcards"
          value={String(totalFlashcards)}
          sub="generadas"
        />
        <StatCard
          icon={GraduationCap}
          label="Preguntas"
          value={String(totalQuizQuestions)}
          sub="de examen"
        />
        <StatCard
          icon={TrendingUp}
          label="Promedio"
          value={avgScore !== null ? `${avgScore}%` : "—"}
          sub="readiness"
          accent
        />
      </div>

      {/* Score history */}
      {scores.length > 0 && (
        <div>
          <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#6a6a72]">
            Historial de Readiness
          </h2>
          <div className="space-y-2">
            {scores.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] px-5 py-4"
              >
                <div>
                  <p className="text-[14px] font-medium text-white">
                    {s.subject}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#6a6a72]">
                    {new Date(s.created_at).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.score}%`,
                        background: getScoreColor(s.score),
                      }}
                    />
                  </div>
                  <span
                    className="min-w-[40px] text-right text-[14px] font-semibold"
                    style={{ color: getScoreColor(s.score) }}
                  >
                    {s.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {scores.length === 0 && projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] p-10 text-center">
          <TrendingUp className="mx-auto mb-4 h-10 w-10 text-[#6a6a72]" />
          <p className="text-[15px] font-medium text-white">
            Aún no hay datos de progreso
          </p>
          <p className="mt-2 text-[13px] text-[#6a6a72]">
            Sube material, practica flashcards y toma exámenes para ver tu
            Readiness Score aquí.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-5">
      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${accent ? "text-[#C3F73A]" : "text-[#6a6a72]"}`}
        />
        <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#6a6a72]">
          {label}
        </span>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 text-[12px] text-[#6a6a72]">{sub}</div>
    </div>
  );
}
