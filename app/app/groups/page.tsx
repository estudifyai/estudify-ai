"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Users,
  Plus,
  LogIn,
  Copy,
  Check,
  Crown,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  join_code: string;
  member_count: number;
  role: string;
  created_at: string;
}

export default function GroupsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadGroups(session.user.id);
      }
    });
  }, []);

  const loadGroups = async (uid: string) => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }
    const res = await fetch(`/api/groups?userId=${uid}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    setGroups(data.groups || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!userId || !groupName.trim()) return;
    setActionLoading(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setActionLoading(false);
      return;
    }

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        action: "create",
        userId,
        groupName: groupName.trim(),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setSuccess(`Grupo "${data.group.name}" creado. Código: ${data.group.join_code}`);
      setGroupName("");
      setShowCreate(false);
      loadGroups(userId);
    }
    setActionLoading(false);
  };

  const handleJoin = async () => {
    if (!userId || !joinCode.trim()) return;
    setActionLoading(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setActionLoading(false);
      return;
    }

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        action: "join",
        userId,
        joinCode: joinCode.trim(),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setSuccess(`Te uniste a "${data.group.name}".`);
      setJoinCode("");
      setShowJoin(false);
      loadGroups(userId);
    }
    setActionLoading(false);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#C3F73A]" />
      </div>
    );
  }

  return (
    <div>
      <div className="app-reveal app-reveal-1 mb-10 flex items-start justify-between">
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.24em] text-[#6a6a72]">
            § Equipo
          </p>
          <h1 className="editorial mt-3 text-[clamp(2rem,4vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-white">
            Grupos de{" "}
            <span className="editorial-italic brand-gradient-text">clase</span>
          </h1>
          <p className="mt-3 text-[14px] text-[#8a8a93]">
            Estudia con tu equipo. Comparte material y compite en quizzes.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowJoin(true);
              setShowCreate(false);
              setError("");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] px-4 py-2.5 text-[13px] font-medium text-white transition hover:border-[rgba(255,255,255,0.14)]"
          >
            <LogIn className="h-4 w-4" />
            Unirse
          </button>
          <button
            onClick={() => {
              setShowCreate(true);
              setShowJoin(false);
              setError("");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#C3F73A] px-4 py-2.5 text-[13px] font-bold text-[#050507] transition hover:shadow-[0_0_20px_-4px_rgba(195,247,58,0.4)]"
          >
            <Plus className="h-4 w-4" />
            Crear grupo
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-xl border border-[#C3F73A]/20 bg-[#C3F73A]/10 px-4 py-3 text-[13px] text-[#C3F73A]">
          {success}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="mb-8 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-6">
          <h3 className="mb-4 text-[14px] font-semibold text-white">
            Crear grupo nuevo
          </h3>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Nombre del grupo (ej: Bio 301 — Equipo A)"
            className="mb-4 w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white placeholder:text-[#4a4a52] outline-none focus:border-[#C3F73A]"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={actionLoading || !groupName.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C3F73A] px-5 py-2.5 text-[13px] font-bold text-[#050507] disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Crear
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="rounded-xl px-5 py-2.5 text-[13px] text-[#8a8a93] hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Join modal */}
      {showJoin && (
        <div className="mb-8 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-6">
          <h3 className="mb-4 text-[14px] font-semibold text-white">
            Unirse a un grupo
          </h3>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Código de 6 letras (ej: ABC123)"
            maxLength={6}
            className="mb-4 w-full max-w-xs rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-center font-mono text-lg tracking-[0.3em] text-white placeholder:text-[#4a4a52] placeholder:tracking-normal placeholder:text-[14px] placeholder:font-sans outline-none focus:border-[#C3F73A]"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleJoin}
              disabled={actionLoading || joinCode.length < 4}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C3F73A] px-5 py-2.5 text-[13px] font-bold text-[#050507] disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Unirme
            </button>
            <button
              onClick={() => setShowJoin(false)}
              className="rounded-xl px-5 py-2.5 text-[13px] text-[#8a8a93] hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Groups list */}
      {groups.length > 0 ? (
        <div className="space-y-3">
          {groups.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0c] p-6 transition hover:border-[rgba(255,255,255,0.14)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(195,247,58,0.15)] to-[rgba(94,200,232,0.15)]">
                  <Users className="h-5 w-5 text-[#C3F73A]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-medium text-white">
                      {g.name}
                    </p>
                    {g.role === "owner" && (
                      <Crown className="h-3.5 w-3.5 text-[#C3F73A]" />
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#6a6a72]">
                    {g.member_count}{" "}
                    {g.member_count === 1 ? "miembro" : "miembros"} · Creado{" "}
                    {new Date(g.created_at).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] px-3 py-2 sm:flex">
                  <span className="font-mono text-[13px] tracking-wider text-[#8a8a93]">
                    {g.join_code}
                  </span>
                  <button
                    onClick={() => copyCode(g.join_code, g.id)}
                    className="text-[#6a6a72] transition hover:text-white"
                  >
                    {copiedId === g.id ? (
                      <Check className="h-3.5 w-3.5 text-[#C3F73A]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="app-reveal app-reveal-2 surface-panel px-8 py-14 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-[#6a6a72]" />
          <p className="text-[15px] font-medium text-white">
            No tienes grupos aún
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-[#6a6a72]">
            Crea un grupo para tu clase y comparte el código con tus
            compañeros. Estudien juntos y compitan en quizzes.
          </p>
        </div>
      )}
    </div>
  );
}
