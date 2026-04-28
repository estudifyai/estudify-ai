import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { extractText as extractPdfText } from "unpdf";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Prompt del Project Bible
const SUMMARY_PROMPT = `Eres un asistente de estudio para estudiantes hispanohablantes de prepa y universidad. Tu tarea es crear un resumen claro y estructurado del siguiente material.

REGLAS:
- Solo usa información del material proporcionado.
- No inventes datos, fechas o conceptos que no estén en el texto.
- Estructura con títulos (##) y subtítulos (###).
- Máximo 800 palabras.
- Al final, lista los 5 conceptos clave.
- Si hay algo confuso o contradictorio en el material, marcarlo explícitamente.
- Si el material no contiene suficiente información, dilo claramente.
- Lenguaje: español neutro, accesible para estudiante de 15-22 años.

MATERIAL:
`;

const FLASHCARDS_PROMPT = `Crea flashcards de estudio basadas en el siguiente material.

REGLAS:
- Genera entre 10 y 20 flashcards según la densidad del material.
- Cada flashcard tiene "question" y "answer".
- Varía los tipos: definición, aplicación, comparación, ejemplo, causa-efecto.
- Solo usa información del material proporcionado. No inventes.
- Responde SOLO con un JSON array válido, sin texto adicional, sin backticks.
- Formato exacto: [{"question":"...","answer":"..."},{"question":"...","answer":"..."}]

MATERIAL:
`;

const QUIZ_PROMPT = `Crea un examen de práctica basado en el siguiente material.

REGLAS:
- Genera 10 preguntas de opción múltiple.
- Cada pregunta tiene 4 opciones (a, b, c, d) con distractores plausibles.
- Incluye la respuesta correcta y una explicación breve.
- Dificultad progresiva: 3 fáciles, 4 medias, 3 difíciles.
- Solo usa información del material. No inventes datos.
- Responde SOLO con un JSON array válido, sin texto adicional, sin backticks.
- Formato: [{"question":"...","options":{"a":"...","b":"...","c":"...","d":"..."},"correct":"a","explanation":"..."}]

MATERIAL:
`;

async function extractText(file: File): Promise<string> {
  const buffer = new Uint8Array(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const { text } = await extractPdfText(buffer);
    return text.join("\n").slice(0, 15000);
  }

  // Texto plano
  return new TextDecoder().decode(buffer).slice(0, 15000);
}

async function generateWithClaude(
  prompt: string,
  text: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt + text,
      },
    ],
  });

  const block = message.content[0];
  if (block.type === "text") {
    return block.text;
  }
  return "";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const textInput = formData.get("text") as string | null;
    const title = (formData.get("title") as string) || "Sin título";
    const userId = formData.get("userId") as string;

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Extraer texto del input
    let rawText = "";

    if (file && file.size > 0) {
      rawText = await extractText(file);
    } else if (textInput && textInput.trim().length > 0) {
      rawText = textInput.slice(0, 15000);
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

    // Generar resumen con Claude
    const summary = await generateWithClaude(SUMMARY_PROMPT, rawText);

    // Generar flashcards en paralelo
    let flashcards: any[] = [];
    let quiz: any[] = [];

    try {
      const [flashcardsRaw, quizRaw] = await Promise.all([
        generateWithClaude(FLASHCARDS_PROMPT, rawText),
        generateWithClaude(QUIZ_PROMPT, rawText),
      ]);

      // Parsear JSON, limpiar posibles backticks
      const cleanJson = (str: string) =>
        str.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      try {
        flashcards = JSON.parse(cleanJson(flashcardsRaw));
      } catch {
        flashcards = [];
      }

      try {
        quiz = JSON.parse(cleanJson(quizRaw));
      } catch {
        quiz = [];
      }
    } catch {
      // Si flashcards/quiz fallan, el resumen sigue siendo válido
    }

    // Guardar en Supabase
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title,
        raw_text: rawText.slice(0, 5000), // Guardar preview del texto
        summary,
        flashcards,
        quiz,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
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
