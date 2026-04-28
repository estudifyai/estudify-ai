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

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Obtener contexto del material seleccionado
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
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Tutor socrático
          </h1>
          <p className="mt-1 text-[14px] text-[#8a8a93]">
            No te da la respuesta. Te guía hasta que la descubres tú.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="rounded-xl p-2 text-[#6a6a72] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
            title="Nueva conversación"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Material selector */}
      {projects.length > 0 && (
        <div className="mb-4">
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-[#6a6a72]">
            Estudiar sobre
          </label>
          <select
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(e.target.value || null)}
            className="w-full max-w-xs rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[13px] text-white outline-none transition focus:border-[#C3F73A]"
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
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#050507]">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-10">
            <img
              src="/brand/logo-mark.png"
              alt="Orbi"
              className="mb-6 opacity-40"
              style={{ height: "64px", width: "auto" }}
            />
            <p className="text-center text-[15px] text-[#6a6a72]">
              Pregunta lo que no entiendas de tu material.
              <br />
              Te guío con preguntas hasta que lo descubras.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "¿Qué es la mitosis?",
                "Explícame la ley de Ohm",
                "¿Cómo funciona la fotosíntesis?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="rounded-full border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-[12px] text-[#8a8a93] transition hover:border-[rgba(255,255,255,0.14)] hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-[14px] leading-[1.6] ${
                    msg.role === "user"
                      ? "bg-[#C3F73A] text-[#050507]"
                      : "bg-[rgba(255,255,255,0.04)] text-[#d4d4d8]"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="mb-2 flex items-center gap-2">
                      <img
                        src="/brand/logo-mark.png"
                        alt=""
                        style={{ height: "16px", width: "auto" }}
                      />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6a6a72]">
                        Orbi
                      </span>
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-[rgba(255,255,255,0.04)] px-5 py-3.5">
                  <img
                    src="/brand/logo-mark.png"
                    alt=""
                    className="animate-pulse"
                    style={{ height: "16px", width: "auto" }}
                  />
                  <span className="text-[13px] text-[#6a6a72]">
                    Pensando...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe tu pregunta..."
          disabled={loading}
          className="flex-1 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-5 py-3.5 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[#C3F73A] disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-xl bg-[#C3F73A] text-[#050507] transition hover:shadow-[0_0_20px_-4px_rgba(195,247,58,0.4)] disabled:opacity-30"
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
