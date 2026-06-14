import type { DigestEvent } from "../types.ts";
import { toDateKey } from "../dateKeys.ts";

// Same event is often listed by multiple sources with slightly different
// titles (e.g. "Auto Sport Adria" vs "Auto Sport Adria 2026"). We dedupe by
// comparing normalized title similarity for events starting on the same day.

const SIMILARITY_THRESHOLD = 0.85;

/** Lowercases, strips diacritics/punctuation, collapses whitespace */
function normalize(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Levenshtein edit distance */
function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[rows - 1][cols - 1];
}

/** 0..1 similarity ratio — 1 means identical */
function titleSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/**
 * Drops events that are near-duplicates (similar title, same start date) of
 * an event already kept. The first occurrence wins.
 */
export function dedupeEvents(events: DigestEvent[]): DigestEvent[] {
  const kept: DigestEvent[] = [];

  for (const event of events) {
    const normalizedTitle = normalize(event.title);
    const dateKey = toDateKey(event);

    const isDuplicate = kept.some(
      (existing) =>
        toDateKey(existing) === dateKey &&
        titleSimilarity(normalize(existing.title), normalizedTitle) >= SIMILARITY_THRESHOLD,
    );

    if (!isDuplicate) kept.push(event);
  }

  return kept;
}
