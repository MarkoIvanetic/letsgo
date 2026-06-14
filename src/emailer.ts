import { Resend } from "resend";
import type { DigestEvent } from "./types.ts";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Date/time helpers ────────────────────────────────────────────────────────

const DAY_NAMES = [
  "nedjelja",
  "ponedjeljak",
  "utorak",
  "srijeda",
  "četvrtak",
  "petak",
  "subota",
];

/** "14.06.2026" or ISO string → "2026-06-14" (safe for new Date()) */
function toDateKey(event: DigestEvent): string {
  if (event.dateFrom) {
    const [d, m, y] = event.dateFrom.split(".");
    return `${y}-${m}-${d}`;
  }
  return event.date.split("T")[0];
}

/** "2026-06-14" → 0-6 day index, noon-anchored to avoid DST edge cases */
function dayIndex(dateKey: string): number {
  return new Date(`${dateKey}T12:00:00`).getDay();
}

/** "21.06.2026" → "21.6." */
function shortDate(ddmmyyyy: string): string {
  const [d, m] = ddmmyyyy.split(".");
  return `${parseInt(d)}.${parseInt(m)}.`;
}

/** "2026-06-14" → "14.06.2026." */
function longDateFromKey(dateKey: string): string {
  const [y, m, d] = dateKey.split("-");
  return `${d}.${m}.${y}.`;
}

function endDateKey(event: DigestEvent): string {
  if (event.dateTo) {
    const [d, m, y] = event.dateTo.split(".");
    return `${y}-${m}-${d}`;
  }
  return toDateKey(event);
}

function buildSubject(events: DigestEvent[]): string {
  if (events.length === 0) {
    return "[LetsGo] Događanja u Zagrebu";
  }

  const startKey = events
    .map((event) => toDateKey(event))
    .sort()[0];
  const endKey = events
    .map((event) => endDateKey(event))
    .sort()
    .at(-1);

  if (!startKey || !endKey) {
    return "[LetsGo] Događanja u Zagrebu";
  }

  return `[LetsGo] Događanja u Zagrebu ${longDateFromKey(startKey)} - ${longDateFromKey(endKey)}`;
}

function eventTiming(event: DigestEvent): string | undefined {
  if (event.dateTo && event.dateTo !== event.dateFrom) {
    return `Do ${shortDate(event.dateTo)}`;
  }
  if (event.startTime) {
    return `U ${event.startTime}`;
  }
  return undefined;
}

// ─── Grouping ─────────────────────────────────────────────────────────────────

function groupByDay(
  events: DigestEvent[],
): Array<{ key: string; label: string; items: DigestEvent[] }> {
  const map = new Map<string, DigestEvent[]>();

  for (const event of events) {
    const key = toDateKey(event);
    const group = map.get(key) ?? [];
    group.push(event);
    map.set(key, group);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, items]) => ({
      key,
      label: DAY_NAMES[dayIndex(key)],
      items,
    }));
}

// ─── HTML builders ────────────────────────────────────────────────────────────

function buildEventLine(event: DigestEvent): string {
  const details = [
    eventTiming(event),
    event.location,
    event.source ? `Izvor: ${event.source}` : undefined,
  ].filter(
    Boolean,
  );
  const summary = event.summary?.trim();

  return `
    <div style="margin:0 0 18px; padding:0 0 22px; border-bottom:1px solid #ece7df;">
      <p style="margin:0 0 6px; font-size:20px; line-height:1.3; color:#111; font-weight:700;">
        ${event.title}
      </p>
      <p style="margin:0; font-size:15px; line-height:1.6; color:#555;">
        ${details.join(" · ")}
      </p>
      ${
        summary
          ? `
      <p style="margin:10px 0 0; font-size:16px; line-height:1.7; color:#111;">
        ${summary}
      </p>`
          : ""
      }
      <p style="margin:12px 0 0; font-size:15px; line-height:1.4;">
        <a href="${event.link}"
           style="color:#d4620a; text-decoration:none; font-weight:700;">Više</a>
      </p>
    </div>`;
}

function buildDaySection(day: { label: string; items: DigestEvent[] }): string {
  return `
    <div style="margin-bottom:24px;">
      <h2 style="font-size:14px; font-weight:700; letter-spacing:0.08em;
                 margin:0 0 8px; color:#111; text-transform:uppercase;">
        ${day.label}
      </h2>
      <div style="padding-left: 8px;">
        ${day.items.map((e) => buildEventLine(e)).join("")}
      </div>
    </div>`;
}

function buildHtml(events: DigestEvent[]): string {
  const days = groupByDay(events);
  const subject = buildSubject(events);
  const startKey = days[0]?.key;
  const endKey = days.at(-1)?.key;
  const rangeLabel =
    startKey && endKey
      ? `${longDateFromKey(startKey)} - ${longDateFromKey(endKey)}`
      : "Pregled aktualnih događanja";

  return `<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family:Georgia,'Times New Roman',serif;
             max-width:600px; margin:0 auto; padding:28px 24px;
             background:#ffffff; color:#111111;">

  <div style="margin-bottom:28px; padding-bottom:16px; border-bottom:2px solid #111;">
    <p style="margin:0; font-size:13px; color:#666; text-transform:uppercase;
              letter-spacing:0.08em;">
      ${rangeLabel}
    </p>
    <h1 style="margin:6px 0 0; font-size:22px; font-weight:700;">
      Događanja u Zagrebu
    </h1>
  </div>

  ${days.map(buildDaySection).join("")}

  <div style="margin-top:32px; padding-top:16px; border-top:1px solid #ddd;
              font-size:12px; color:#999; font-family:sans-serif;">
    Poslao LetsGo
  </div>

</body>
</html>`;
}

// ─── Send ─────────────────────────────────────────────────────────────────────

export async function sendDigestEmail(events: DigestEvent[]): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: process.env.TO_EMAIL ?? "",
    subject: process.env.EMAIL_SUBJECT || buildSubject(events),
    html: buildHtml(events),
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  console.log(`✅ Email sent! (id: ${data?.id})`);
}
