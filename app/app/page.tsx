"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Upload,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  ArrowRight,
  FileText,
  Sparkles,
  Target,
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
      {/* ═══ Header editorial — la marca entra a la app ═══ */}
      <div className="app-reveal app-reveal-1 mb-12">
        <p className="mono text-[11px] uppercase tracking-[0.24em] text-[#6a6a72]">
          {new Date().toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="editorial mt-3 text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-white">
          {greeting},{" "}
          <span className="editorial-italic brand-gradient-text">
            {userName.split(" ")[0]}
          </span>
          .
        </h1>
        <p className="mt-3 text-[15px] text-[#8a8a93]">
          Tu laboratorio de estudio te espera.
        </p>
      </div>

      {/* ═══ Hero: upload con anillo de marca ═══ */}
      <div className="app-reveal app-reveal-2 brand-ring mb-12">
        <div className="surface-panel !rounded-[24px] !border-0 px-8 py-12 text-center md:py-14">
          {/* Glow interior */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[420px] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(195,247,58,0.07), transparent 70%)",
            }}
          />

          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(195,247,58,0.2)] bg-[rgba(195,247,58,0.08)]">
            <Upload className="h-7 w-7 text-[#C3F73A]" />
          </div>

          <h2 className="editorial relative text-3xl text-white">
            Sube tu primer material
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[14px] leading-[1.6] text-[#8a8a93]">
            PDF, apuntes o texto. La IA genera resumen, flashcards y examen en
            menos de <span className="text-white">60 segundos</span>.
          </p>

          <button
            onClick={() => router.push("/app/upload")}
            className="btn-primary group relative mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px]"
          >
            <Sparkles className="h-4 w-4" />
            Subir material
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* ═══ Stats: una sola banda con divisores — no 4 cards ═══ */}
      <div className="app-reveal app-reveal-3 surface-panel mb-12 grid grid-cols-2 md:grid-cols-4">
        <StatCell
          icon={FileText}
          label="Resúmenes"
          value="0"
          sub="de 3 disponibles"
        />
        <StatCell
          icon={BookOpen}
          label="Flashcards"
          value="0"
          sub="completadas"
          divider
        />
        <StatCell
          icon={GraduationCap}
          label="Exámenes"
          value="0"
          sub="tomados"
          divider
        />
        <StatCell
          icon={Target}
          label="Readiness"
          value="—"
          sub="sube material"
          divider
          accent
        />
      </div>

      {/* ═══ Acciones: filas con jerarquía, no cajas iguales ═══ */}
      <div className="app-reveal app-reveal-4">
        <div className="mb-5 flex items-baseline justify-between">
          <h3 className="mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6a6a72]">
            § Acciones rápidas
          </h3>
        </div>
        <div className="space-y-2">
          <ActionRow
            icon={Upload}
            color="#C3F73A"
            title="Subir material"
            desc="PDF, foto o texto — genera todo con IA"
            onClick={() => router.push("/app/upload")}
          />
          <ActionRow
            icon={BookOpen}
            color="#5EC8E8"
            title="Practicar flashcards"
            desc="Repaso del día con spaced repetition"
            onClick={() => router.push("/app/flashcards")}
          />
          <ActionRow
            icon={Sparkles}
            color="#8B7FD8"
            title="Tutor socrático"
            desc="Orbi te guía hasta que lo descubres tú"
            onClick={() => router.push("/app/tutor")}
          />
        </div>
      </div>
    </div>
  );
}

function StatCell({
  icon: Icon,
  label,
  value,
  sub,
  divider,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  divider?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative px-6 py-6 ${
        divider ? "md:border-l md:border-[rgba(255,255,255,0.06)]" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={`h-3.5 w-3.5 ${accent ? "text-[#C3F73A]" : "text-[#5a5a62]"}`}
        />
        <span className="mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#6a6a72]">
          {label}
        </span>
      </div>
      <div className="editorial mt-3 text-4xl text-white">{value}</div>
      <div className="mt-1 text-[12px] text-[#6a6a72]">{sub}</div>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  color,
  title,
  desc,
  onClick,
}: {
  icon: any;
  color: string;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-5 rounded-2xl border border-transparent px-5 py-4 text-left transition-colors duration-200 hover:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.025)]"
    >
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105"
        style={{
          borderColor: `${color}26`,
          background: `${color}0f`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-white">{title}</p>
        <p className="mt-0.5 truncate text-[12px] text-[#6a6a72]">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#4a4a52] transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" />
    </button>
  );
}
