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
    if (dropped) {
      validateAndSetFile(dropped);
    }
  }, []);

  const validateAndSetFile = (f: File) => {
    const maxSize = 4 * 1024 * 1024; // 4MB — límite de Vercel Serverless
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "text/markdown",
    ];

    if (f.size > maxSize) {
      setError("El archivo es muy grande. Máximo 4MB.");
      return;
    }

    if (!allowedTypes.includes(f.type) && !f.name.endsWith(".md") && !f.name.endsWith(".txt")) {
      setError("Solo se aceptan PDF, TXT o MD por ahora.");
      return;
    }

    setFile(f);
    setError("");
    if (!title) {
      setTitle(f.name.replace(/\.[^/.]+$/, ""));
    }
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

      if (mode === "file" && file) {
        formData.append("file", file);
      } else {
        formData.append("text", textInput);
      }

      setProgress("La IA está generando tu resumen, flashcards y examen...");

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error procesando el material.");
      }

      // Redirigir al resumen generado
      if (data.id) {
        router.push(`/app/summary/${data.id}`);
      } else {
        // Si no se guardó en DB, mostrar en una página temporal
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
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Subir material
        </h1>
        <p className="mt-2 text-[15px] text-[#8a8a93]">
          Sube un PDF, pega texto o apuntes. La IA genera todo en menos de 60 segundos.
        </p>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.1em] text-[#6a6a72]">
          Título del material
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Biología — Mitosis"
          className="w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[#C3F73A]"
        />
      </div>

      {/* Mode toggle */}
      <div className="mb-6 inline-flex rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-1">
        <button
          onClick={() => setMode("file")}
          className={`rounded-lg px-4 py-2 text-[13px] font-medium transition ${
            mode === "file"
              ? "bg-[rgba(195,247,58,0.1)] text-[#C3F73A]"
              : "text-[#8a8a93] hover:text-white"
          }`}
        >
          Subir archivo
        </button>
        <button
          onClick={() => setMode("text")}
          className={`rounded-lg px-4 py-2 text-[13px] font-medium transition ${
            mode === "text"
              ? "bg-[rgba(195,247,58,0.1)] text-[#C3F73A]"
              : "text-[#8a8a93] hover:text-white"
          }`}
        >
          Pegar texto
        </button>
      </div>

      {/* File upload */}
      {mode === "file" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition ${
            dragOver
              ? "border-[#C3F73A] bg-[rgba(195,247,58,0.05)]"
              : file
              ? "border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.02)]"
              : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.01)] hover:border-[rgba(255,255,255,0.2)]"
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(195,247,58,0.1)]">
                <FileText className="h-6 w-6 text-[#C3F73A]" />
              </div>
              <div className="text-left">
                <p className="text-[14px] font-medium text-white">
                  {file.name}
                </p>
                <p className="text-[12px] text-[#6a6a72]">
                  {(file.size / 1024).toFixed(0)} KB
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
              <Upload className="mx-auto mb-4 h-10 w-10 text-[#6a6a72]" />
              <p className="text-[15px] font-medium text-white">
                Arrastra tu archivo aquí o haz click para buscar
              </p>
              <p className="mt-2 text-[13px] text-[#6a6a72]">
                PDF, TXT o MD — Máximo 4MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Text input */}
      {mode === "text" && (
        <div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Pega tus apuntes, notas de clase, o cualquier texto que quieras estudiar..."
            rows={12}
            className="w-full rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] px-5 py-4 text-[14px] leading-relaxed text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[#C3F73A]"
          />
          <p className="mt-2 text-right text-[12px] text-[#6a6a72]">
            {textInput.length} caracteres
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="group inline-flex items-center gap-2 rounded-full bg-[#C3F73A] px-8 py-3.5 text-[14px] font-bold text-[#050507] transition hover:shadow-[0_0_40px_-8px_rgba(195,247,58,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Loading state — processing animation */}
      {loading && (
        <div className="mt-8 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-8">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 flex-shrink-0">
              <img
                src="/brand/logo-mark.png"
                alt=""
                className="h-12 w-12 animate-pulse"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div>
              <p className="text-[15px] font-medium text-white">{progress}</p>
              <p className="mt-1 text-[12px] text-[#6a6a72]">
                Esto toma menos de 60 segundos.
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
            <div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #C3F73A, #5EC8E8, #8B7FD8)",
                animation: "progress-indeterminate 2s ease-in-out infinite",
                width: "40%",
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
