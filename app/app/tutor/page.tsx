"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { Send, Loader2, Trash2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Project {
  id: string;
  title: string;
  summary: string;
}

export default function TutorPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadProjects(session.user.id);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadProjects = async (uid: string) => {
    const { data } = await supabase
      .from("projects")
      .select("id, title, summary")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setProjects(data || []);
  };

  const sendMessage = async (forcedText?: string) => {
    const text = (forcedText ?? input).trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      let context = "";
      if (selectedProject) {
        const proj = projects.find((p) => p.id === selectedProject);
        if (proj) context = proj.summary;
      }

      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Hubo un error. Intenta de nuevo en unos segundos.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col">
      {/* Header editorial */}
      <div className="app-reveal app-reveal-1 mb-6 flex items-end justify-between">
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.24em] text-[#6a6a72]">
            § Orbi
          </p>
          <h1 className="editorial mt-2 text-[clamp(1.8rem,3.5vw,2.4rem)] leading-[1.05] tracking-[-0.02em] text-white">
            Tutor{" "}
            <span className="editorial-italic brand-gradient-text">
              socrático
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {projects.length > 0 && (
            <select
              value={selectedProject || ""}
              onChange={(e) => setSelectedProject(e.target.value || null)}
              className="max-w-[220px] rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[12px] text-white outline-none transition focus:border-[rgba(94,200,232,0.5)]"
            >
              <option value="" className="bg-[#0a0a0c]">
                Pregunta general
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0a0a0c]">
                  {p.title}
                </option>
              ))}
            </select>
          )}
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="rounded-full border border-[rgba(255,255,255,0.08)] p-2 text-[#6a6a72] transition hover:border-[rgba(255,255,255,0.16)] hover:text-white"
              title="Nueva conversación"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="app-reveal app-reveal-2 surface-panel min-h-0 flex-1 !overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 py-10">
            <div className="relative mb-7">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "radial-gradient(circle, rgba(139,127,216,0.14) 0%, rgba(94,200,232,0.08) 45%, transparent 75%)",
                  filter: "blur(24px)",
                }}
              />
              <img
                src="/brand/logo-mark.png"
                alt="Orbi"
                className="relative"
                style={{ height: "72px", width: "auto" }}
              />
            </div>
            <p className="editorial text-center text-2xl text-white">
              No te doy la respuesta.
            </p>
            <p className="editorial-italic mt-1 text-center text-2xl text-[#8a8a93]">
              Te guío hasta que la descubres tú.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-2">
              {[
                "¿Qué es la mitosis?",
                "Explícame la ley de Ohm",
                "¿Cómo funciona la fotosíntesis?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-[12px] text-[#8a8a93] transition hover:border-[rgba(139,127,216,0.4)] hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[75%] rounded-2xl rounded-br-md bg-[#C3F73A] px-5 py-3 text-[14px] leading-[1.6] text-[#050507]">
                    {msg.content}
                  </div>
                ) : (
                  <div
                    className="max-w-[75%] rounded-2xl rounded-bl-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-5 py-3.5"
                    style={{ borderLeft: "2px solid rgba(139,127,216,0.5)" }}
                  >
                    <span className="mono mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B7FD8]">
                      Orbi
                    </span>
                    <span className="text-[14px] leading-[1.65] text-[#d4d4d8]">
                      {msg.content}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2.5 rounded-2xl rounded-bl-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-5 py-3.5">
                  <img
                    src="/brand/logo-mark.png"
                    alt=""
                    className="h-4 w-4 animate-pulse"
                  />
                  <span className="text-[13px] text-[#6a6a72]">Pensando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="app-reveal app-reveal-3 mt-4 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe tu pregunta..."
          disabled={loading}
          className="flex-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-6 py-3.5 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[rgba(139,127,216,0.5)] focus:shadow-[0_0_0_3px_rgba(139,127,216,0.08)] disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full text-[#050507] transition hover:shadow-[0_0_24px_-6px_rgba(126,232,198,0.5)] disabled:opacity-30"
          style={{
            background: "linear-gradient(135deg, #C3F73A, #7EE8C6, #5EC8E8)",
          }}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
