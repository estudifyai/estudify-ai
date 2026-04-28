"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Upload,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  FileText,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Estudiante";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {greeting}, {userName}
        </h1>
        <p className="mt-2 text-[15px] text-[#8a8a93]">
          Tu laboratorio de estudio te espera. Sube material para empezar.
        </p>
      </div>

      {/* Upload CTA — estado vacío */}
      <div className="mb-10 rounded-2xl border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(195,247,58,0.1)]">
          <Upload className="h-6 w-6 text-[#C3F73A]" />
        </div>
        <h2 className="text-xl font-semibold text-white">
          Sube tu primer material
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-[#8a8a93]">
          PDF, foto de apuntes o texto pegado. La IA genera resumen, flashcards
          y examen en menos de 60 segundos.
        </p>
        <button
          onClick={() => router.push("/app/upload")}
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#C3F73A] px-6 py-3 text-[14px] font-bold text-[#050507] transition hover:shadow-[0_0_40px_-8px_rgba(195,247,58,0.5)]"
        >
          <Upload className="h-4 w-4" />
          Subir material
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Quick stats (vacías por ahora) */}
      <div className="mb-10 grid gap-4 md:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Resúmenes"
          value="0"
          sub="de 3 disponibles"
        />
        <StatCard
          icon={BookOpen}
          label="Flashcards"
          value="0"
          sub="completadas"
        />
        <StatCard
          icon={GraduationCap}
          label="Exámenes"
          value="0"
          sub="tomados"
        />
        <StatCard
          icon={TrendingUp}
          label="Readiness"
          value="—"
          sub="sube material para empezar"
          accent
        />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#6a6a72]">
          Acciones rápidas
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          <QuickAction
            icon={Upload}
            title="Subir material"
            desc="PDF, foto o texto"
            onClick={() => router.push("/app/upload")}
          />
          <QuickAction
            icon={BookOpen}
            title="Practicar flashcards"
            desc="Repaso del día"
            onClick={() => router.push("/app/flashcards")}
            disabled
          />
          <QuickAction
            icon={Sparkles}
            title="Tutor socrático"
            desc="Pregunta lo que no entiendas"
            onClick={() => router.push("/app/tutor")}
            disabled
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-5">
      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${
            accent ? "text-[#C3F73A]" : "text-[#6a6a72]"
          }`}
        />
        <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#6a6a72]">
          {label}
        </span>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 text-[12px] text-[#6a6a72]">{sub}</div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  desc,
  onClick,
  disabled,
}: {
  icon: any;
  title: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-5 text-left transition ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-[rgba(255,255,255,0.14)] hover:bg-[#111115]"
      }`}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.04)]">
        <Icon className="h-5 w-5 text-[#8a8a93]" />
      </div>
      <div>
        <p className="text-[14px] font-medium text-white">{title}</p>
        <p className="text-[12px] text-[#6a6a72]">{desc}</p>
      </div>
    </button>
  );
}
