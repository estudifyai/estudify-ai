"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [title, setTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSetFile(dropped);
  }, []);

  const validateAndSetFile = (f: File) => {
    const maxSize = 4 * 1024 * 1024; // 4MB — límite de Vercel Serverless
    const allowedTypes = ["application/pdf", "text/plain", "text/markdown"];

    if (f.size > maxSize) {
      setError("El archivo es muy grande. Máximo 4MB.");
      return;
    }
    if (
      !allowedTypes.includes(f.type) &&
      !f.name.endsWith(".md") &&
      !f.name.endsWith(".txt")
    ) {
      setError("Solo se aceptan PDF, TXT o MD por ahora.");
      return;
    }

    setFile(f);
    setError("");
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError("Necesitas iniciar sesión.");
      return;
    }
    if (mode === "file" && !file) {
      setError("Selecciona un archivo primero.");
      return;
    }
    if (mode === "text" && textInput.trim().length < 50) {
      setError("Escribe al menos un párrafo (50 caracteres).");
      return;
    }

    setLoading(true);
    setError("");
    setProgress("Subiendo material...");

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("title", title || "Sin título");
      if (examDate) formData.append("examDate", examDate);
      if (mode === "file" && file) {
        formData.append("file", file);
      } else {
        formData.append("text", textInput);
      }

      setProgress("La IA está generando tu material...");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

      const res = await fetch("/api/process", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error procesando el material.");

      if (data.id) {
        router.push(`/app/summary/${data.id}`);
      } else {
        sessionStorage.setItem("temp_result", JSON.stringify(data));
        router.push("/app/summary/temp");
      }
    } catch (err: any) {
      setError(err.message || "Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="mx-auto max-w-[780px]">
      {/* Header editorial */}
      <div className="app-reveal app-reveal-1 mb-10">
        <p className="mono text-[11px] uppercase tracking-[0.24em] text-[#6a6a72]">
          § Nuevo material
        </p>
        <h1 className="editorial mt-3 text-[clamp(2rem,4vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-white">
          ¿Qué estudiamos{" "}
          <span className="editorial-italic brand-gradient-text">hoy</span>?
        </h1>
        <p className="mt-3 text-[14px] text-[#8a8a93]">
          Sube un PDF o pega tus apuntes. Resumen, flashcards y examen en menos
          de 60 segundos.
        </p>
      </div>

      {/* Título */}
      <div className="app-reveal app-reveal-2 mb-6">
        <label className="mono mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-[#6a6a72]">
          Título del material
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Biología — Mitosis"
          className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[rgba(94,200,232,0.5)] focus:shadow-[0_0_0_3px_rgba(94,200,232,0.08)]"
        />
      </div>

      {/* Fecha del examen */}
      <div className="app-reveal app-reveal-2 mb-6">
        <label className="mono mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-[#6a6a72]">
          Fecha del examen{" "}
          <span className="normal-case tracking-normal text-[#4a4a52]">
            (opcional)
          </span>
        </label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[rgba(94,200,232,0.5)] [color-scheme:dark]"
        />
      </div>

      {/* Toggle */}
      <div className="app-reveal app-reveal-2 mb-5 inline-flex rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-1">
        {(["file", "text"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${
              mode === m
                ? "bg-[rgba(195,247,58,0.12)] text-[#C3F73A]"
                : "text-[#8a8a93] hover:text-white"
            }`}
          >
            {m === "file" ? "Subir archivo" : "Pegar texto"}
          </button>
        ))}
      </div>

      {/* Dropzone */}
      {mode === "file" && (
        <div className={`app-reveal app-reveal-3 ${dragOver || file ? "brand-ring" : ""}`}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`surface-panel cursor-pointer px-8 py-12 text-center transition-colors ${
              dragOver ? "!border-transparent" : file ? "!border-transparent" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) validateAndSetFile(f);
              }}
            />

            {file ? (
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(195,247,58,0.2)] bg-[rgba(195,247,58,0.08)]">
                  <FileText className="h-5 w-5 text-[#C3F73A]" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-medium text-white">{file.name}</p>
                  <p className="mono mt-0.5 text-[11px] text-[#6a6a72]">
                    {(file.size / 1024).toFixed(0)} KB — listo
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="rounded-lg p-2 text-[#6a6a72] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                  <Upload
                    className={`h-6 w-6 transition-colors ${
                      dragOver ? "text-[#C3F73A]" : "text-[#6a6a72]"
                    }`}
                  />
                </div>
                <p className="editorial text-xl text-white">
                  Arrastra tu archivo aquí
                </p>
                <p className="mono mt-2 text-[11px] uppercase tracking-[0.14em] text-[#6a6a72]">
                  PDF · TXT · MD — máx 4MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Texto */}
      {mode === "text" && (
        <div className="app-reveal app-reveal-3">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Pega tus apuntes, notas de clase, o cualquier texto que quieras estudiar..."
            rows={10}
            className="w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-5 py-4 text-[14px] leading-relaxed text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[rgba(94,200,232,0.5)] focus:shadow-[0_0_0_3px_rgba(94,200,232,0.08)]"
          />
          <p className="mono mt-2 text-right text-[11px] text-[#6a6a72]">
            {textInput.length} caracteres
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="app-reveal app-reveal-4 mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[14px] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {progress}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generar resumen, flashcards y examen
            </>
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="surface-panel mt-8 p-7">
          <div className="flex items-center gap-4">
            <img
              src="/brand/logo-mark.png"
              alt=""
              className="h-11 w-11 animate-pulse"
              style={{ objectFit: "contain" }}
            />
            <div>
              <p className="text-[14px] font-medium text-white">{progress}</p>
              <p className="mono mt-1 text-[11px] uppercase tracking-[0.12em] text-[#6a6a72]">
                Menos de 60 segundos
              </p>
            </div>
          </div>
          <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
            <div
              className="h-full w-2/5 rounded-full"
              style={{
                background: "linear-gradient(90deg, #C3F73A, #5EC8E8, #8B7FD8)",
                animation: "progress-indeterminate 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(360%); }
        }
      `}</style>
    </div>
  );
}
