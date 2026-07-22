"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  quiz: any[];
  created_at: string;
}

export default function ExamsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("projects")
        .select("id, title, quiz, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setProjects(
        (data || []).filter((p) => p.quiz && p.quiz.length > 0)
      );
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#8B7FD8]" />
      </div>
    );
  }

  return (
    <div>
      <div className="app-reveal app-reveal-1 mb-10">
        <p className="mono text-[11px] uppercase tracking-[0.24em] text-[#6a6a72]">
          § Práctica
        </p>
        <h1 className="editorial mt-3 text-[clamp(2rem,4vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-white">
          Exámenes de{" "}
          <span className="editorial-italic brand-gradient-text">práctica</span>
        </h1>
        <p className="mt-3 text-[14px] text-[#8a8a93]">
          Pon a prueba tu conocimiento con quizzes generados por IA.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="app-reveal app-reveal-2 space-y-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => router.push(`/app/summary/${p.id}?tab=quiz`)}
              className="group flex w-full items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-6 text-left transition hover:border-[rgba(255,255,255,0.14)] hover:bg-[#111115]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(139,127,216,0.1)]">
                  <GraduationCap className="h-5 w-5 text-[#8B7FD8]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-white">
                    {p.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#6a6a72]">
                    {p.quiz.length} preguntas ·{" "}
                    {new Date(p.created_at).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#6a6a72] transition group-hover:translate-x-1 group-hover:text-white" />
            </button>
          ))}
        </div>
      ) : (
        <div className="app-reveal app-reveal-2 surface-panel px-8 py-14 text-center">
          <GraduationCap className="mx-auto mb-4 h-10 w-10 text-[#6a6a72]" />
          <p className="text-[15px] font-medium text-white">
            No hay exámenes aún
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-[#6a6a72]">
            Sube material y la IA generará un examen de práctica automáticamente.
          </p>
          <button
            onClick={() => router.push("/app/upload")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C3F73A] px-6 py-3 text-[14px] font-bold text-[#050507]"
          >
            Subir material
          </button>
        </div>
      )}
    </div>
  );
}
