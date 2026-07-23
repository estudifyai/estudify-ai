"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { sfx } from "../../lib/feedback";
import { localISO, computeStreak } from "../../lib/streak";
import { Flame, Check, X, Loader2, ArrowRight, Layers } from "lucide-react";

interface Card {
  projectId: string;
  projectTitle: string;
  cardIndex: number;
  question: string;
  answer: string;
  priority: number;
}

const DAILY_SIZE = 10;

export default function ReviewPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [doneToday, setDoneToday] = useState(false);

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [known, setKnown] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const uid = session.user.id;
      setUserId(uid);

      const [projRes, cardRes, dailyRes] = await Promise.all([
        supabase
          .from("projects")
          .select("id, title, flashcards")
          .eq("user_id", uid),
        supabase
          .from("card_reviews")
          .select("project_id, card_index, unknown_count, known_count, last_reviewed")
          .eq("user_id", uid),
        supabase
          .from("daily_reviews")
          .select("review_date")
          .eq("user_id", uid)
          .order("review_date", { ascending: false })
          .limit(90),
      ]);

      const dates = (dailyRes.data || []).map((d: any) => d.review_date);
      setStreak(computeStreak(dates));
      setDoneToday(dates.includes(localISO()));

      const stats = new Map<string, any>();
      (cardRes.data || []).forEach((r: any) =>
        stats.set(`${r.project_id}:${r.card_index}`, r)
      );

      const pool: Card[] = [];
      (projRes.data || []).forEach((p: any) => {
        (p.flashcards || []).forEach((c: any, i: number) => {
          if (!c?.question) return;
          const st = stats.get(`${p.id}:${i}`);
          // Prioridad alta = repasar primero
          let priority = 100; // nunca vista
          if (st) {
            const daysAgo = st.last_reviewed
              ? (Date.now() - new Date(st.last_reviewed).getTime()) / 86400000
              : 30;
            priority = st.unknown_count * 20 + daysAgo * 2 - st.known_count * 5;
          }
          pool.push({
            projectId: p.id,
            projectTitle: p.title,
            cardIndex: i,
            question: c.question,
            answer: c.answer,
            priority,
          });
        });
      });

      pool.sort((a, b) => b.priority - a.priority);
      setCards(pool.slice(0, DAILY_SIZE));
      setLoading(false);
    };
    load();
  }, [router]);

  const mark = async (didKnow: boolean) => {
    if (!userId) return;
    const card = cards[index];
    didKnow ? sfx.correct() : sfx.wrong();
    if (didKnow) setKnown((k) => k + 1);

    // Guarda memoria de la tarjeta
    const { data: existing } = await supabase
      .from("card_reviews")
      .select("known_count, unknown_count")
      .eq("user_id", userId)
      .eq("project_id", card.projectId)
      .eq("card_index", card.cardIndex)
      .maybeSingle();

    await supabase.from("card_reviews").upsert(
      {
        user_id: userId,
        project_id: card.projectId,
        card_index: card.cardIndex,
        known_count: (existing?.known_count || 0) + (didKnow ? 1 : 0),
        unknown_count: (existing?.unknown_count || 0) + (didKnow ? 0 : 1),
        last_reviewed: new Date().toISOString(),
      },
      { onConflict: "user_id,project_id,card_index" }
    );

    if (index < cards.length - 1) {
      setShowAnswer(false);
      setIndex(index + 1);
    } else {
      await finish(known + (didKnow ? 1 : 0));
    }
  };

  const finish = async (correct: number) => {
    if (!userId) return;
    await supabase.from("daily_reviews").upsert(
      {
        user_id: userId,
        review_date: localISO(),
        cards_reviewed: cards.length,
        cards_correct: correct,
      },
      { onConflict: "user_id,review_date" }
    );
    if (!doneToday) setStreak((s) => s + 1);
    sfx.complete();
    setFinished(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#C3F73A]" />
      </div>
    );
  }

  /* Sin material */
  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-[640px]">
        <Header streak={streak} />
        <div className="surface-panel px-8 py-14 text-center">
          <Layers className="mx-auto mb-4 h-10 w-10 text-[#6a6a72]" />
          <p className="text-[15px] font-medium text-white">
            Aún no hay tarjetas que repasar
          </p>
          <p className="mt-2 text-[13px] text-[#6a6a72]">
            Sube material y tus flashcards entrarán al repaso diario.
          </p>
          <button
            onClick={() => router.push("/app/upload")}
            className="btn-primary mt-6 rounded-full px-6 py-3 text-[13px]"
          >
            Subir material
          </button>
        </div>
      </div>
    );
  }

  /* Terminado */
  if (finished) {
    const pct = Math.round((known / cards.length) * 100);
    return (
      <div className="mx-auto max-w-[560px]">
        <div className="brand-ring">
          <div className="surface-panel !border-0 p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(255,159,64,0.3)] bg-[rgba(255,159,64,0.1)]">
              <Flame className="h-7 w-7 text-[#ff9f40]" />
            </div>
            <p className="editorial text-5xl text-white">{streak}</p>
            <p className="mono mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6a6a72]">
              {streak === 1 ? "día de racha" : "días de racha"}
            </p>
            <p className="mt-6 text-[15px] text-[#8a8a93]">
              Recordaste {known} de {cards.length} ({pct}%).{" "}
              {pct >= 80
                ? "Vas muy bien."
                : "Las que fallaste vuelven mañana primero."}
            </p>
            <button
              onClick={() => router.push("/app")}
              className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px]"
            >
              Volver al dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="mx-auto max-w-[720px]">
      <Header streak={streak} />

      <div className="mb-4 flex items-center justify-between">
        <span className="mono text-[11px] text-[#6a6a72]">
          {index + 1} / {cards.length}
        </span>
        <span className="mono text-[11px] text-[#6a6a72]">
          {card.projectTitle}
        </span>
      </div>

      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((index + 1) / cards.length) * 100}%`,
            background: "linear-gradient(90deg, #C3F73A, #5EC8E8, #8B7FD8)",
          }}
        />
      </div>

      <div className="flip-scene">
        <div
          className={`flip-card ${showAnswer ? "flipped" : ""}`}
          onClick={() => {
            sfx.flip();
            setShowAnswer(!showAnswer);
          }}
        >
          <div className="flip-face">
            <span className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-[#6a6a72]">
              Pregunta
            </span>
            <p className="text-xl font-medium leading-relaxed text-white">
              {card.question}
            </p>
            <p className="mt-5 text-[12px] text-[#6a6a72]">Click para revelar</p>
          </div>
          <div className="flip-face flip-back">
            <span className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-[#5EC8E8]">
              Respuesta
            </span>
            <p className="text-xl font-medium leading-relaxed text-white">
              {card.answer}
            </p>
          </div>
        </div>
      </div>

      {showAnswer && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => mark(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/8 py-3.5 text-[14px] font-medium text-red-300 transition hover:bg-red-500/15"
          >
            <X className="h-4 w-4" />
            No la sabía
          </button>
          <button
            onClick={() => mark(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[rgba(195,247,58,0.3)] bg-[rgba(195,247,58,0.08)] py-3.5 text-[14px] font-medium text-[#C3F73A] transition hover:bg-[rgba(195,247,58,0.15)]"
          >
            <Check className="h-4 w-4" />
            La sabía
          </button>
        </div>
      )}
    </div>
  );
}

function Header({ streak }: { streak: number }) {
  return (
    <div className="app-reveal app-reveal-1 mb-8 flex items-end justify-between">
      <div>
        <p className="mono text-[11px] uppercase tracking-[0.24em] text-[#6a6a72]">
          § Repaso diario
        </p>
        <h1 className="editorial mt-3 text-[clamp(1.8rem,3.5vw,2.4rem)] leading-[1.05] tracking-[-0.02em] text-white">
          10 tarjetas.{" "}
          <span className="editorial-italic brand-gradient-text">Hoy.</span>
        </h1>
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-2 rounded-full border border-[rgba(255,159,64,0.25)] bg-[rgba(255,159,64,0.08)] px-4 py-2">
          <Flame className="h-4 w-4 text-[#ff9f40]" />
          <span className="mono text-[13px] font-semibold text-[#ff9f40]">
            {streak}
          </span>
        </div>
      )}
    </div>
  );
}
