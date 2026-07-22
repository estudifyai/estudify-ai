type ChatMessage = { role: "user" | "assistant"; content: string };

const PROVIDER = (process.env.AI_PROVIDER || "groq").toLowerCase();
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

interface GenerateOpts {
  system?: string;
  messages: ChatMessage[];
  maxTokens?: number;
}

/** Punto único de generación. Cambia de proveedor con AI_PROVIDER. */
export async function generateText({
  system,
  messages,
  maxTokens = 4096,
}: GenerateOpts): Promise<string> {
  if (PROVIDER === "anthropic") {
    return generateAnthropic({ system, messages, maxTokens });
  }
  return generateGroq({ system, messages, maxTokens });
}

/* ─── Groq (API compatible con OpenAI) ─── */
async function generateGroq({ system, messages, maxTokens }: GenerateOpts) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Falta GROQ_API_KEY.");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_completion_tokens: maxTokens,
      temperature: 0.7,
      messages: system
        ? [{ role: "system", content: system }, ...messages]
        : messages,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Groq ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

/* ─── Anthropic (para cuando pongas créditos) ─── */
async function generateAnthropic({ system, messages, maxTokens }: GenerateOpts) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Falta ANTHROPIC_API_KEY.");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      ...(system ? { system } : {}),
      messages,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Anthropic ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const block = data?.content?.[0];
  return block?.type === "text" ? block.text : "";
}

/** Extrae el primer array JSON válido, aunque venga con backticks o preámbulo. */
export function parseJsonArray(raw: string): any[] {
  if (!raw) return [];
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    const direct = JSON.parse(cleaned);
    return Array.isArray(direct) ? direct : [];
  } catch {
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1 || end <= start) return [];
    try {
      const sliced = JSON.parse(cleaned.slice(start, end + 1));
      return Array.isArray(sliced) ? sliced : [];
    } catch {
      return [];
    }
  }
}
