import { NextRequest, NextResponse } from "next/server";
import { extractText as extractPdfText } from "unpdf";
import { createClient } from "@supabase/supabase-js";
import { generateText, parseJsonObject } from "@/app/lib/ai";

export const maxDuration = 60;

function supabaseAsUser(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

const STUDY_PROMPT = `Eres un asistente de estudio para estudiantes hispanohablantes de prepa y universidad.

A partir del MATERIAL, genera un objeto JSON con resumen, flashcards y examen.

REGLAS:
- Solo usa información del material. No inventes datos, fechas ni conceptos.
- Español neutro, accesible para estudiante de 15-22 años.
- "summary": resumen en markdown, máximo 400 palabras, con títulos (##) y los conceptos clave al final.
- "flashcards": exactamente 10 objetos con "question" y "answer". Varía tipos: definición, aplicación, comparación, ejemplo.
- "quiz": exactamente 8 preguntas de opción múltiple con distractores plausibles. Dificultad progresiva. Cada pregunta incluye "topic": el subtema del material al que pertenece (2-4 palabras, usa 3-4 subtemas en total, repetidos entre preguntas).
- Respuestas breves y directas. No uses emojis.
- Responde SOLO con el objeto JSON, sin texto adicional ni backticks.

FORMATO JSON EXACTO:
{"summary":"## Título\\n\\nTexto...","flashcards":[{"question":"...","answer":"..."}],"quiz":[{"question":"...","topic":"...","options":{"a":"...","b":"...","c":"...","d":"..."},"correct":"a","explanation":"..."}]}

MATERIAL:
`;

async function extractText(file: File): Promise<string> {
  const buffer = new Uint8Array(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const { text } = await extractPdfText(buffer);
    return text.join("\n").slice(0, 6000);
  }

  // Texto plano
  return new TextDecoder().decode(buffer).slice(0, 6000);
}

async function generate(prompt: string, text: string): Promise<string> {
  return generateText({
    messages: [{ role: "user", content: prompt + text }],
    maxTokens: 5000,
    json: true,
  });
}

export async function POST(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace(
      "Bearer ",
      ""
    );
    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const supabase = supabaseAsUser(token);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sesión inválida. Vuelve a iniciar sesión." },
        { status: 401 }
      );
    }

    const userId = user.id;

    const { getUserPlan, countMaterialsThisMonth, FREE_MATERIALS_LIMIT } =
      await import("@/app/lib/plan");

    const plan = await getUserPlan(supabase, userId);
    if (plan === "free") {
      const used = await countMaterialsThisMonth(supabase, userId);
      if (used >= FREE_MATERIALS_LIMIT) {
        return NextResponse.json(
          {
            error: "LIMIT_REACHED",
            message:
              "Alcanzaste tus 3 materiales del mes. Mejora a Pro para materiales ilimitados.",
          },
          { status: 402 }
        );
      }
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const textInput = formData.get("text") as string | null;
    const title = (formData.get("title") as string) || "Sin título";
    const examDate = (formData.get("examDate") as string) || null;

    // Extraer texto del input
    let rawText = "";

    if (file && file.size > 0) {
      rawText = await extractText(file);
    } else if (textInput && textInput.trim().length > 0) {
      rawText = textInput.slice(0, 6000);
    } else {
      return NextResponse.json(
        { error: "No se recibió material para procesar." },
        { status: 400 }
      );
    }

    if (rawText.trim().length < 50) {
      return NextResponse.json(
        { error: "El material es demasiado corto. Necesito al menos un párrafo." },
        { status: 400 }
      );
    }

    const raw = await generate(STUDY_PROMPT, rawText);
    const parsed = parseJsonObject(raw);

    if (!parsed || typeof parsed.summary !== "string" || !parsed.summary.trim()) {
      console.error("Respuesta no parseable:", raw.slice(0, 500));
      return NextResponse.json(
        { error: "La IA no devolvió un resultado válido. Intenta de nuevo." },
        { status: 502 }
      );
    }

    const summary: string = parsed.summary;
    const flashcards: any[] = Array.isArray(parsed.flashcards)
      ? parsed.flashcards
      : [];
    const quiz: any[] = Array.isArray(parsed.quiz) ? parsed.quiz : [];

    // Guardar en Supabase
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title,
        exam_date: examDate,
        raw_text: rawText.slice(0, 5000), // Guardar preview del texto
        summary,
        flashcards,
        quiz,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error.message, error.details);
      // Aún así devolver el resumen aunque no se guarde
      return NextResponse.json({
        id: null,
        summary,
        flashcards,
        quiz,
        saved: false,
      });
    }

    return NextResponse.json({
      id: data.id,
      summary,
      flashcards,
      quiz,
      saved: true,
    });
  } catch (error: any) {
    console.error("Process error:", error);
    return NextResponse.json(
      { error: error.message || "Error procesando el material." },
      { status: 500 }
    );
  }
}
