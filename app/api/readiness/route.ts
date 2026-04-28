import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, projectId, subject, quizScore, quizTotal, flashcardsReviewed, totalFlashcards } =
      await request.json();

    if (!userId || !projectId) {
      return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
    }

    // Calcular Exam Readiness Score
    // Fórmula del Bible: precisión + retención + cobertura + consistencia
    const precision = quizTotal > 0 ? (quizScore / quizTotal) * 100 : 0;
    const retention =
      totalFlashcards > 0
        ? (flashcardsReviewed / totalFlashcards) * 100
        : 0;
    const coverage = Math.min(
      100,
      ((quizTotal > 0 ? 1 : 0) + (totalFlashcards > 0 ? 1 : 0)) * 50
    );

    // Score ponderado: 40% precisión, 30% retención, 20% cobertura, 10% bonus por completar ambos
    const completionBonus =
      quizTotal > 0 && totalFlashcards > 0 ? 10 : 0;
    const score = Math.round(
      precision * 0.4 +
        retention * 0.3 +
        coverage * 0.2 +
        completionBonus
    );

    const finalScore = Math.min(100, Math.max(0, score));

    // Guardar en Supabase
    const { data, error } = await supabase
      .from("readiness_scores")
      .insert({
        user_id: userId,
        project_id: projectId,
        subject: subject || "General",
        quiz_score: precision,
        flashcards_reviewed: flashcardsReviewed || 0,
        total_flashcards: totalFlashcards || 0,
        score: finalScore,
      })
      .select("id, score")
      .single();

    if (error) {
      console.error("Readiness save error:", error);
      return NextResponse.json({ score: finalScore, saved: false });
    }

    return NextResponse.json({ score: finalScore, saved: true, id: data.id });
  } catch (error: any) {
    console.error("Readiness error:", error);
    return NextResponse.json(
      { error: error.message || "Error calculando score." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "No userId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("readiness_scores")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ scores: [] });
    }

    return NextResponse.json({ scores: data || [] });
  } catch {
    return NextResponse.json({ scores: [] });
  }
}
