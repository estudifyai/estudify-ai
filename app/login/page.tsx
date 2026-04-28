"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Starfield from "../components/Starfield";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
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
      {/* Starfield + nebula — mismo feel que la landing */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 30% 20%, rgba(195,247,58,0.05) 0%, transparent 50%), radial-gradient(ellipse 40% 50% at 70% 30%, rgba(94,200,232,0.04) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 50% 80%, rgba(139,127,216,0.05) 0%, transparent 50%)",
        }}
      />
      <Starfield />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo flotante con glow */}
        <a href="/" className="mb-10 flex justify-center">
          <div className="relative">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[160px] w-[160px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(195,247,58,0.12) 0%, rgba(94,200,232,0.08) 40%, rgba(139,127,216,0.06) 65%, transparent 80%)",
                filter: "blur(25px)",
              }}
            />
            <img
              src="/brand/logo-mark.png"
              alt="estudify.ai"
              className="relative"
              style={{ height: "72px", width: "auto" }}
            />
          </div>
        </a>

        {/* Card con borde gradiente sutil */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Gradient border */}
          <div
            className="absolute inset-0 rounded-2xl p-[1px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(195,247,58,0.2), rgba(94,200,232,0.15), rgba(139,127,216,0.2), rgba(195,247,58,0.1))",
            }}
          >
            <div className="h-full w-full rounded-2xl bg-[#08080a]" />
          </div>

          <div className="relative rounded-2xl p-8 md:p-10">
            {/* Top shine */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-32"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.03), transparent 70%)",
              }}
            />

            <h1 className="relative text-center text-2xl font-semibold tracking-tight text-white">
              {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
            </h1>
            <p className="mt-2 text-center text-[14px] text-[#8a8a93]">
              {isLogin
                ? "Entra a tu laboratorio de estudio."
                : "Únete a la próxima generación de estudio."}
            </p>

            <form onSubmit={handleSubmit} className="relative mt-8 space-y-4">
              {!isLogin && (
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.12em] text-[#6a6a72]">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[rgba(94,200,232,0.5)] focus:shadow-[0_0_0_3px_rgba(94,200,232,0.08)]"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.12em] text-[#6a6a72]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[rgba(94,200,232,0.5)] focus:shadow-[0_0_0_3px_rgba(94,200,232,0.08)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.12em] text-[#6a6a72]">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[14px] text-white placeholder:text-[#4a4a52] outline-none transition focus:border-[rgba(94,200,232,0.5)] focus:shadow-[0_0_0_3px_rgba(94,200,232,0.08)]"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-[#5EC8E8]/20 bg-[#5EC8E8]/10 px-4 py-2.5 text-[13px] text-[#5EC8E8]">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-bold text-[#050507] transition disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #C3F73A, #7EE8C6, #5EC8E8)",
                  backgroundSize: "200% 100%",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundPosition = "100% 0";
                  (e.target as HTMLElement).style.boxShadow =
                    "0 0 40px -8px rgba(126,232,198,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundPosition = "0% 0";
                  (e.target as HTMLElement).style.boxShadow = "none";
                }}
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

            <div className="relative mt-6 text-center">
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
        </div>

        <p className="mt-8 text-center text-[11px] text-[#4a4a52]">
          Al continuar aceptas nuestros{" "}
          <a href="/terms" className="underline hover:text-[#8a8a93]">
            términos
          </a>{" "}
          y{" "}
          <a href="/privacy" className="underline hover:text-[#8a8a93]">
            política de privacidad
          </a>
          .
        </p>
      </div>
    </div>
  );
}
