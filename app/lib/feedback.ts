/** Sonidos sutiles generados con Web Audio — sin archivos, sin peso. */
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("estudify_muted") === "true";
}

export function toggleMute(): boolean {
  const next = !isMuted();
  localStorage.setItem("estudify_muted", String(next));
  return next;
}

function tone(freq: number, start: number, dur: number, vol = 0.06) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  gain.gain.setValueAtTime(0, c.currentTime + start);
  gain.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.05);
}

export const sfx = {
  flip: () => !isMuted() && tone(520, 0, 0.09, 0.035),
  correct: () => {
    if (isMuted()) return;
    tone(587.33, 0, 0.12);
    tone(880, 0.07, 0.18);
  },
  wrong: () => !isMuted() && tone(196, 0, 0.22, 0.05),
  complete: () => {
    if (isMuted()) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(f, i * 0.09, 0.3, 0.055)
    );
  },
};
