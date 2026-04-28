import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Eres el tutor socrático de Estudify.ai. Tu nombre es Orbi. Tu trabajo es ayudar a estudiantes hispanohablantes de prepa y universidad a ENTENDER conceptos, no a darles respuestas.

REGLAS ABSOLUTAS:
1. NUNCA des la respuesta directa a una pregunta conceptual. En vez, guía al estudiante con preguntas que lo lleven a descubrir la respuesta por sí mismo.
2. Si el estudiante dice "no sé" o se frustra, dale una pista más concreta, pero sigue sin dar la respuesta completa.
3. Solo después de 3-4 intercambios donde el estudiante demuestra que realmente no puede llegar a la respuesta, puedes dar una explicación clara.
4. Cuando el estudiante llega a la respuesta correcta por sí mismo, celébralo brevemente.
5. Usa español neutro, accesible, sin ser condescendiente.
6. Sé conciso. Máximo 3-4 oraciones por respuesta.
7. No uses emojis.
8. Si te dan contexto de material de estudio, basa tus preguntas en ese material.
9. Si el estudiante pregunta algo fuera de estudio (clima, chistes, etc.), redirige amablemente al estudio.

EJEMPLO:
Estudiante: "¿Qué es la fotosíntesis?"
Tú: "Buena pregunta. Piensa en las plantas — necesitan energía para vivir, igual que tú. ¿De dónde crees que las plantas obtienen esa energía?"

Estudiante: "¿Del sol?"
Tú: "Exacto, del sol. Ahora, las plantas toman esa luz solar y la convierten en algo que pueden usar. ¿Qué crees que producen con esa energía?"`;

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No se recibió mensaje." },
        { status: 400 }
      );
    }

    // Construir contexto si hay material del estudiante
    let systemPrompt = SYSTEM_PROMPT;
    if (context) {
      systemPrompt += `\n\nMATERIAL DE ESTUDIO DEL ESTUDIANTE (usa esto como base para tus preguntas):\n${context.slice(0, 3000)}`;
    }

    // Formatear mensajes para Claude
    const claudeMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })
    );

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: systemPrompt,
      messages: claudeMessages,
    });

    const block = response.content[0];
    const text = block.type === "text" ? block.text : "";

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Tutor error:", error);
    return NextResponse.json(
      { error: error.message || "Error en el tutor." },
      { status: 500 }
    );
  }
}
