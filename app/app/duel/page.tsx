"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { sfx } from "../../lib/feedback";
import { Swords, Loader2, ArrowLeft, RotateCcw, Brain } from "lucide-react";

interface QuizQ {
  question: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
}
interface Project {
  id: string;
  title: string;
  quiz: QuizQ[];
}

/* IQ → comportamiento del bot */
const botDelay = (iq: number) => 12000 - ((iq - 60) * 9000) / 80; // 12s → 3s
const botAccuracy = (iq: number) => 0.5 + ((iq - 60) * 0.45) / 80; // 50% → 95%

export default function DuelPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  /* setup */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [iq, setIq] = useState(100);
  const [phase, setPhase] = useState<"setup" | "battle" | "over">("setup");

  /* batalla */
  const [pool, setPool] = useState<QuizQ[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [botProgress, setBotProgress] = useState(0);
  const botTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRaf = useRef<number>(0);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("projects")
        .select("id, title, quiz")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      setProjects((data || []).filter((p) => p.quiz && p.quiz.length >= 3));
      setLoading(false);
    };
    load();
    return () => stopBot();
  }, [router]);

  const stopBot = () => {
    if (botTimer.current) clearTimeout(botTimer.current);
    cancelAnimationFrame(progressRaf.current);
  };

  const startDuel = () => {
    const proj = projects.find((p) => p.id === selectedId);
    if (!proj) return;
    const shuffled = [...proj.quiz].sort(() => Math.random() - 0.5);
    setPool(shuffled);
    setQIndex(0);
    setPlayerScore(0);
    setBotScore(0);
    setPhase("battle");
    launchRound();
  };

  const launchRound = () => {
    setSelected(null);
    setRoundResult(null);
    setBotProgress(0);

    const delay = botDelay(iq);
    const start = performance.now();

    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / delay) * 100);
      setBotProgress(pct);
      if (pct < 100) progressRaf.current = requestAnimationFrame(tick);
    };
    progressRaf.current = requestAnimationFrame(tick);

    botTimer.current = setTimeout(() => {
      // El bot responde: acierta según su accuracy
      const botCorrect = Math.random() < botAccuracy(iq);
      if (botCorrect) {
        sfx.wrong();
        setBotScore((s) => s + 1);
        setRoundResult("El bot respondió primero — y acertó.");
      } else {
        setRoundResult("El bot respondió primero — pero falló. Punto anulado.");
      }
      setSelected("__bot__");
    }, delay);
  };

  const answer = (opt: string) => {
    if (selected) return;
    stopBot();
    setSelected(opt);
    const q = pool[qIndex % pool.length];
    if (opt === q.correct) {
      sfx.correct();
      setPlayerScore((s) => s + 1);
      setRoundResult("Correcto. Punto tuyo.");
    } else {
      sfx.wrong();
      setBotScore((s) => s + 1);
      setRoundResult(`Incorrecto. La respuesta era ${q.correct.toUpperCase()}. Punto del bot.`);
    }
  };

  const nextRound = () => {
    const pWin = playerScore >= 3;
    const bWin = botScore >= 3;
    if (pWin || bWin) {
      if (pWin) sfx.complete();
      setPhase("over");
      stopBot();
      return;
    }
    setQIndex((i) => i + 1);
    launchRound();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#8B7FD8]" />
      </div>
    );
  }

  /* ─── SETUP ─── */
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-[640px]">
        <div className="app-reveal app-reveal-1 mb-10">
          <p className="mono text-[11px] uppercase tracking-[0.24em] text-[#6a6a72]">
            § Arena
          </p>
          <h1 className="editorial mt-3 text-[clamp(2rem,4vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-white">
            Duelo contra{" "}
            <span className="editorial-italic brand-gradient-text">el bot</span>
          </h1>
          <p className="mt-3 text-[14px] text-[#8a8a93]">
            Primero a 3 puntos. Responde antes que el bot — si fallas, punto
            para él.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="app-reveal app-reveal-2 surface-panel px-8 py-14 text-center">
            <Swords className="mx-auto mb-4 h-10 w-10 text-[#6a6a72]" />
            <p className="text-[15px] font-medium text-white">
              Necesitas un material con examen
            </p>
            <p className="mt-2 text-[13px] text-[#6a6a72]">
              Sube material y vuelve a la arena.
            </p>
          </div>
        ) : (
          <div className="app-reveal app-reveal-2 space-y-8">
            <div>
              <label className="mono mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-[#6a6a72]">
                Material
              </label>
              <select
                value={selectedId || ""}
                onChange={(e) => setSelectedId(e.target.value || null)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white outline-none focus:border-[rgba(139,127,216,0.5)]"
              >
                <option value="" className="bg-[#0a0a0c]">
                  Elige tu material
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0a0a0c]">
                    {p.title} ({p.quiz.length} preguntas)
                  </option>
                ))}
              </select>
            </div>

            <div className="surface-panel p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-[#8B7FD8]" />
                  <span className="mono text-[10px] uppercase tracking-[0.16em] text-[#6a6a72]">
                    IQ del bot
                  </span>
                </div>
                <span className="editorial text-3xl text-white">{iq}</span>
              </div>
              <input
                type="range"
                min={60}
                max={140}
                step={5}
                value={iq}
                onChange={(e) => setIq(Number(e.target.value))}
                className="w-full accent-[#8B7FD8]"
              />
              <div className="mt-2 flex justify-between text-[11px] text-[#6a6a72]">
                <span>Relajado (12s, falla mucho)</span>
                <span>Genio (3s, casi no falla)</span>
              </div>
            </div>

            <button
              onClick={startDuel}
              disabled={!selectedId}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] disabled:opacity-40"
            >
              <Swords className="h-4 w-4" />
              Empezar duelo
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─── FIN ─── */
  if (phase === "over") {
    const won = playerScore > botScore;
    return (
      <div className="mx-auto max-w-[560px]">
        <div className={won ? "brand-ring" : ""}>
          <div className="surface-panel !border-0 p-10 text-center">
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[#6a6a72]">
              {won ? "Victoria" : "Derrota"}
            </p>
            <p className="editorial mt-4 text-6xl text-white">
              {playerScore} — {botScore}
            </p>
            <p className="mt-4 text-[15px] text-[#8a8a93]">
              {won
                ? `Le ganaste a un bot de IQ ${iq}. Sube la dificultad.`
                : `El bot de IQ ${iq} te ganó esta vez. Repasa y vuelve.`}
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() => setPhase("setup")}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] px-6 py-3 text-[13px] text-white hover:border-[rgba(255,255,255,0.2)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Cambiar ajustes
              </button>
              <button
                onClick={startDuel}
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px]"
              >
                <RotateCcw className="h-4 w-4" />
                Revancha
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── BATALLA ─── */
  const q = pool[qIndex % pool.length];

  return (
    <div className="mx-auto max-w-[720px]">
      {/* Marcador */}
      <div className="mb-8 flex items-center justify-between">
        <div className="text-center">
          <p className="mono text-[10px] uppercase tracking-[0.16em] text-[#6a6a72]">
            Tú
          </p>
          <p className="editorial text-5xl text-[#C3F73A]">{playerScore}</p>
        </div>
        <div className="text-center">
          <Swords className="mx-auto h-5 w-5 text-[#6a6a72]" />
          <p className="mono mt-1 text-[10px] text-[#6a6a72]">Primero a 3</p>
        </div>
        <div className="text-center">
          <p className="mono text-[10px] uppercase tracking-[0.16em] text-[#6a6a72]">
            Bot · IQ {iq}
          </p>
          <p className="editorial text-5xl text-[#8B7FD8]">{botScore}</p>
        </div>
      </div>

      {/* Barra del bot */}
      <div className="mb-6">
        <div className="mb-1.5 flex justify-between text-[11px] text-[#6a6a72]">
          <span>El bot está pensando...</span>
          <span>{Math.round(botProgress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${botProgress}%`,
              background:
                botProgress > 75
                  ? "#ef4444"
                  : "linear-gradient(90deg, #8B7FD8, #5EC8E8)",
              transition: "background 0.3s",
            }}
          />
        </div>
      </div>

      {/* Pregunta */}
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
                    : "border-[rgba(255,255,255,0.07)] text-white hover:border-[rgba(139,127,216,0.5)]"
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

        {roundResult && (
          <>
            <p className="mt-6 text-center text-[14px] text-[#a8a8b0]">
              {roundResult}
            </p>
            <button
              onClick={nextRound}
              className="btn-primary mt-4 w-full rounded-xl py-3 text-[14px]"
            >
              {playerScore >= 3 || botScore >= 3
                ? "Ver resultado"
                : "Siguiente ronda"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
