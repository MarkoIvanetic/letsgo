import type { DigestEvent } from "./types.ts";

// Shared date-key helpers used by the email builder and the
// "Add to Google Calendar" link builder.

/** "14.06.2026" or ISO string → "2026-06-14" (safe for new Date()) */
export function toDateKey(event: DigestEvent): string {
  if (event.dateFrom) {
    const [d, m, y] = event.dateFrom.split(".");
    return `${y}-${m}-${d}`;
  }
  return event.date.split("T")[0];
}

/** Falls back to `toDateKey` when the event has no `dateTo` */
export function endDateKey(event: DigestEvent): string {
  if (event.dateTo) {
    const [d, m, y] = event.dateTo.split(".");
    return `${y}-${m}-${d}`;
  }
  return toDateKey(event);
}

/** "2026-06-14" → 0-6 day index, noon-anchored to avoid DST edge cases */
export function dayIndex(dateKey: string): number {
  return new Date(`${dateKey}T12:00:00`).getDay();
}

/** "2026-06-14" → "14.06.2026." */
export function longDateFromKey(dateKey: string): string {
  const [y, m, d] = dateKey.split("-");
  return `${d}.${m}.${y}.`;
}

/** "2026-06-14" → "20260614" */
export function toGCalDate(dateKey: string): string {
  return dateKey.replace(/-/g, "");
}

/** "2026-06-14" + 1 → "2026-06-15" (for Google Calendar's exclusive end date) */
export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** ISO datetime → "20260614T180000Z" for Google Calendar */
export function toGCalDateTime(iso: string): string {
  return iso.replace(/[-:]/g, "").split(".")[0] + "Z";
}

/** Today's date as "2026-06-14" (local time) */
export function todayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** "2026-06-14" → "14.6." */
export function shortDateFromKey(dateKey: string): string {
  const [, m, d] = dateKey.split("-");
  return `${parseInt(d)}.${parseInt(m)}.`;
}
