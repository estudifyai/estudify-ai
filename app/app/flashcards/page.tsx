"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  flashcards: any[];
  created_at: string;
}

export default function FlashcardsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("projects")
        .select("id, title, flashcards, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setProjects(
        (data || []).filter((p) => p.flashcards && p.flashcards.length > 0)
      );
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#5EC8E8]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Flashcards
        </h1>
        <p className="mt-2 text-[15px] text-[#8a8a93]">
          Practica con spaced repetition. Selecciona un material para empezar.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => router.push(`/app/summary/${p.id}?tab=flashcards`)}
              className="group flex w-full items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-6 text-left transition hover:border-[rgba(255,255,255,0.14)] hover:bg-[#111115]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(94,200,232,0.1)]">
                  <BookOpen className="h-5 w-5 text-[#5EC8E8]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-white">
                    {p.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#6a6a72]">
                    {p.flashcards.length} flashcards ·{" "}
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
        <div className="rounded-2xl border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-[#6a6a72]" />
          <p className="text-[15px] font-medium text-white">
            No hay flashcards aún
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-[#6a6a72]">
            Sube material y la IA generará flashcards automáticamente.
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
