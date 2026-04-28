"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/app");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (error) throw error;
        setSuccess("Revisa tu email para confirmar tu cuenta.");
      }
    } catch (err: any) {
      setError(
        err.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos."
          : err.message === "User already registered"
          ? "Este email ya tiene cuenta. Inicia sesión."
          : err.message || "Algo salió mal. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-6">
      {/* Starfield-like background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(195,247,58,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(94,200,232,0.03) 0%, transparent 50%), radial-gradient(ellipse 40% 50% at 20% 80%, rgba(139,127,216,0.03) 0%, transparent 50%)",
        }}
      />

      <div className="relative w-full max-w-[420px]">
        {/* Logo */}
        <a href="/" className="mb-12 flex justify-center">
          <img
            src="/brand/logo-mark.png"
            alt="estudify.ai"
            style={{ height: "64px", width: "auto" }}
          />
        </a>

        {/* Card */}
        <div
          className="rounded-2xl border border-[rgba(255,255,255,0.07)] p-8"
          style={{ background: "rgba(10,10,12,0.8)", backdropFilter: "blur(20px)" }}
        >
          <h1 className="text-center text-2xl font-semibold tracking-tight text-white">
            {isLogin ? "Inicia sesión" : "Crea tu cuenta"}
          </h1>
          <p className="mt-2 text-center text-[14px] text-[#8a8a93]">
            {isLogin
              ? "Entra a tu laboratorio de estudio."
              : "Únete a la próxima generación de estudio."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.1em] text-[#6a6a72]">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[#C3F73A]"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.1em] text-[#6a6a72]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[#C3F73A]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.1em] text-[#6a6a72]">
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[#C3F73A]"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-[#C3F73A]/20 bg-[#C3F73A]/10 px-4 py-2.5 text-[13px] text-[#C3F73A]">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C3F73A] py-3.5 text-[14px] font-bold text-[#050507] transition hover:shadow-[0_0_40px_-8px_rgba(195,247,58,0.5)] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Entrar" : "Crear cuenta"}
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="text-[13px] text-[#8a8a93] transition hover:text-white"
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-[#4a4a52]">
          Al continuar aceptas nuestros términos y política de privacidad.
        </p>
      </div>
    </div>
  );
}
