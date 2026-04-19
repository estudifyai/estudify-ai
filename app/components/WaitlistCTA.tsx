"use client";

import { useState } from "react";

export default function WaitlistCTA() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (email && email.includes("@") && email.includes(".")) {
      setError(false);
      setShowModal(true);
      setEmail("");
    } else {
      setError(true);
    }
  };

  return (
    <>
      <section
        id="waitlist"
        className="py-16 md:py-24 px-6 md:px-8 border-y border-[var(--border)] relative overflow-hidden"
        style={{ background: "var(--bg2)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(108,63,160,0.2), transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-[580px] mx-auto text-center relative z-10 fade-up">
          <div className="text-[12px] font-semibold text-[var(--purple-light)] uppercase tracking-[0.12em] mb-4">
            Beta privada
          </div>
          <h2 className="text-[32px] md:text-[42px] font-bold text-white tracking-[-0.02em] leading-[1.1] mb-4">
            Sé de los primeros.
          </h2>
          <p className="text-[16px] text-[var(--text2)] leading-relaxed mb-8">
            Acceso anticipado y precio especial de por vida para los primeros
            1,000 usuarios.
          </p>

          <div className="flex gap-2 max-w-[420px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="tucorreo@ejemplo.com"
              className="flex-1 h-12 px-5 rounded-full bg-[var(--bg)] border text-white text-[14px] outline-none transition-colors placeholder:text-[var(--text2)]"
              style={{
                borderColor: error
                  ? "rgba(239,68,68,0.6)"
                  : "var(--border)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--purple-light)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = error
                  ? "rgba(239,68,68,0.6)"
                  : "var(--border)")
              }
              aria-label="Correo electrónico"
            />
            <button
              onClick={handleSubmit}
              className="h-12 px-6 rounded-full bg-white text-[var(--bg)] text-[14px] font-semibold hover:bg-[rgba(255,255,255,0.88)] transition-colors whitespace-nowrap"
            >
              Unirme
            </button>
          </div>

          {error && (
            <p className="text-[12px] text-red-400 mt-2">
              Ingresa un correo válido.
            </p>
          )}

          <p className="text-[12px] text-[var(--text2)] mt-4">
            Sin spam. Solo avisos del lanzamiento.
          </p>
        </div>
      </section>

      {showModal && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.75)] z-[1000] flex items-center justify-center backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-[var(--bg2)] border border-[var(--border)] rounded-3xl p-8 md:p-10 text-center max-w-[400px] w-full"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "modalIn 0.2s ease-out" }}
          >
            <div className="w-12 h-12 rounded-full bg-[rgba(168,224,110,0.1)] border border-[rgba(168,224,110,0.2)] flex items-center justify-center mx-auto mb-5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--green)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3
              id="modal-title"
              className="text-[20px] font-bold text-white mb-2 tracking-tight"
            >
              Ya estás dentro.
            </h3>
            <p className="text-[14px] text-[var(--text2)] mb-7 leading-relaxed">
              Te avisamos en cuanto la beta esté lista.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="h-11 px-8 rounded-full bg-white text-[var(--bg)] text-[14px] font-semibold hover:bg-[rgba(255,255,255,0.88)] transition-colors"
            >
              Perfecto
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </>
  );
}
