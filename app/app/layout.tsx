"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  Upload,
  BookOpen,
  GraduationCap,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Sparkles,
  Users,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app" },
  { icon: Upload, label: "Subir material", href: "/app/upload" },
  { icon: BookOpen, label: "Flashcards", href: "/app/flashcards" },
  { icon: GraduationCap, label: "Exámenes", href: "/app/exams" },
  { icon: MessageCircle, label: "Tutor socrático", href: "/app/tutor" },
  { icon: Users, label: "Grupos", href: "/app/groups" },
  { icon: BarChart3, label: "Mi progreso", href: "/app/progress" },
  { icon: Settings, label: "Mi cuenta", href: "/app/account" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("/app");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      setLoading(false);

      // Redirect a onboarding si es primera vez
      const onboardingDone = localStorage.getItem("estudify_onboarding_done");
      if (!onboardingDone && window.location.pathname === "/app") {
        router.push("/app/onboarding");
      }
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/brand/logo-mark.png"
            alt="estudify.ai"
            style={{ height: "48px", width: "auto" }}
            className="animate-pulse"
          />
          <span className="text-[13px] text-[#6a6a72]">Cargando...</span>
        </div>
      </div>
    );
  }

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Estudiante";

  return (
    <div className="flex min-h-screen bg-black">
      {/* ═══ SIDEBAR ═══ */}
      <aside
        className={`sticky top-0 flex h-screen flex-col border-r border-[rgba(255,255,255,0.07)] bg-[#050507] transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] px-4 py-5">
          {!collapsed && (
            <a href="/app" className="flex items-center gap-2">
              <img
                src="/brand/logo-mark.png"
                alt=""
                style={{ height: "28px", width: "auto" }}
              />
              <span className="text-[15px] font-semibold tracking-tight text-white">
                estudify
                <span className="text-[#5EC8E8]">.ai</span>
              </span>
            </a>
          )}
          {collapsed && (
            <a href="/app" className="mx-auto">
              <img
                src="/brand/logo-mark.png"
                alt=""
                style={{ height: "28px", width: "auto" }}
              />
            </a>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`rounded-lg p-1.5 text-[#6a6a72] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-white ${
              collapsed ? "hidden" : ""
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = activePath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePath(item.href);
                  router.push(item.href);
                }}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  isActive
                    ? "bg-[rgba(94,200,232,0.08)] text-[#5EC8E8]"
                    : "text-[#8a8a93] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={`h-[18px] w-[18px] flex-shrink-0 ${
                    isActive ? "text-[#5EC8E8]" : "text-[#6a6a72] group-hover:text-white"
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* Plan badge */}
        {!collapsed && (
          <div className="mx-3 mb-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#8B7FD8]" />
              <span className="text-[12px] font-semibold text-white">Plan Free</span>
            </div>
            <p className="mt-1.5 text-[11px] text-[#6a6a72]">
              3 resúmenes restantes este mes.
            </p>
            <a
              href="/app/account"
              className="mt-3 block rounded-lg py-2 text-center text-[11px] font-semibold transition"
              style={{
                background: "linear-gradient(135deg, rgba(195,247,58,0.1), rgba(94,200,232,0.1))",
                color: "#7EE8C6",
              }}
            >
              Mejorar a Pro
            </a>
          </div>
        )}

        {/* User */}
        <div className="border-t border-[rgba(255,255,255,0.07)] px-3 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C3F73A] via-[#5EC8E8] to-[#8B7FD8] text-[12px] font-bold text-black">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white">
                  {userName}
                </p>
                <p className="truncate text-[11px] text-[#6a6a72]">
                  {user?.email}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-[#6a6a72] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-red-400"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="relative flex-1 overflow-y-auto">
        <div className="app-ambient" />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 py-8 md:px-10 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
