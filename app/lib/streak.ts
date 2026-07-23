/** Fecha local YYYY-MM-DD (evita el bug de UTC en México). */
export function localISO(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Racha de días consecutivos. Si hoy aún no repasa, la racha de ayer sigue viva. */
export function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  const cursor = new Date();
  if (!set.has(localISO(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(localISO(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function reviewedToday(dates: string[]): boolean {
  return dates.includes(localISO());
}
