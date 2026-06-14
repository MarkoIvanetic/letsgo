import { Resend } from "resend";
import type { DigestEvent } from "./types.ts";
import {
  addDays,
  dayIndex,
  endDateKey,
  longDateFromKey,
  shortDateFromKey,
  toDateKey,
  toGCalDate,
  toGCalDateTime,
  todayKey,
} from "./dateKeys.ts";

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
const SOURCE_BADGE_STYLES: Record<string, string> = {
  InfoZagreb: "background:#e8f1ff; color:#1f5fbf;",
  "Meet in Zagreb": "background:#fdeaea; color:#b42318;",
};

/** "21.06.2026" → "21.6." */
function shortDate(ddmmyyyy: string): string {
  const [d, m] = ddmmyyyy.split(".");
  return `${parseInt(d)}.${parseInt(m)}.`;
}

/**
 * The day an event should be grouped under. Events that started before
 * today but are still running (dateTo >= today) are pulled forward into
 * today's section instead of staying in their now-past start day.
 */
function effectiveDateKey(event: DigestEvent, today: string): string {
  const startKey = toDateKey(event);
  const endKey = endDateKey(event);
  return startKey < today && endKey >= today ? today : startKey;
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_EVENT_DURATION_MS = 2 * ONE_HOUR_MS;

/** Builds an "Add to Google Calendar" link, prefilled with the event's details */
function buildGoogleCalendarLink(event: DigestEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
  });

  if (event.startTime && !event.dateTo) {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + DEFAULT_EVENT_DURATION_MS);
    params.set(
      "dates",
      `${toGCalDateTime(start.toISOString())}/${toGCalDateTime(end.toISOString())}`,
    );
  } else {
    const startKey = toDateKey(event);
    const endKey = addDays(endDateKey(event), 1); // GCal end date is exclusive
    params.set("dates", `${toGCalDate(startKey)}/${toGCalDate(endKey)}`);
  }

  if (event.location) params.set("location", event.location);
  params.set(
    "details",
    [event.summary, event.link].filter(Boolean).join("\n\n"),
  );

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildSubject(events: DigestEvent[], today: string): string {
  if (events.length === 0) {
    return "[LetsGo] Događanja u Zagrebu";
  }

  const startKey = events
    .map((event) => effectiveDateKey(event, today))
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

function eventTiming(event: DigestEvent, today: string): string | undefined {
  if (event.dateTo && event.dateTo !== event.dateFrom) {
    const startKey = toDateKey(event);
    if (startKey < today) {
      // Ongoing event, shown in today's section — display the full range
      // so it's clear it started earlier.
      return `${shortDateFromKey(startKey)} - ${shortDate(event.dateTo)}`;
    }
    return `Do ${shortDate(event.dateTo)}`;
  }
  if (event.startTime) {
    return `U ${event.startTime}`;
  }
  return undefined;
}

function sourceBadgeStyle(source: string | undefined): string {
  if (!source) {
    return "background:#f3f4f6; color:#4b5563;";
  }

  return SOURCE_BADGE_STYLES[source] ?? "background:#f3f4f6; color:#4b5563;";
}

// ─── Grouping ─────────────────────────────────────────────────────────────────

function groupByDay(
  events: DigestEvent[],
  today: string,
): Array<{ key: string; label: string; items: DigestEvent[] }> {
  const map = new Map<string, DigestEvent[]>();

  for (const event of events) {
    const key = effectiveDateKey(event, today);
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

function buildEventLine(event: DigestEvent, today: string): string {
  const details = [eventTiming(event, today), event.location].filter(Boolean);
  const summary = event.summary?.trim();
  const sourceBadge = event.source
    ? `
      <p style="margin:10px 0 0;">
        <span style="display:inline-block; padding:5px 10px; border-radius:999px; font-size:12px; line-height:1; font-weight:700; ${sourceBadgeStyle(event.source)}">
          ${event.source}
        </span>
      </p>`
    : "";

  return `
    <div style="border-bottom:1px solid #ece7df; padding-left:16px; padding-bottom:16px; margin-bottom:16px;">
      <p style="font-size:16px; line-height:1.3; color:#111; font-weight:700;">
        ${event.title}
      </p>
      ${
        details.length > 0
          ? `
      <p style="margin:0; font-size:15px; line-height:1.6; color:#555;">
        ${details.join(" · ")}
      </p>`
          : ""
      }
      ${sourceBadge}
      ${
        summary
          ? `
      <p style="margin:10px 0 0; font-size:16px; line-height:1.7; color:#111;">
        ${summary}
      </p>`
          : ""
      }
      <p style="margin:12px 0 0; font-size:12px; line-height:1.4;">
        <a href="${buildGoogleCalendarLink(event)}"
           style="display:inline-block; padding:4px 6px; margin-right:8px;
                  border:1px solid #38bdf8; border-radius:6px;
                  color:#38bdf8; text-decoration:none; font-weight:700;">+ Kalendar</a>
        <a href="${event.link}"
           style="display:inline-block; padding:4px 6px;
                  background:#38bdf8; border-radius:6px;
                  color:#fff; text-decoration:none; font-weight:700;">Više</a>
      </p>
    </div>`;
}

function buildDaySection(
  day: { key: string; label: string; items: DigestEvent[] },
  today: string,
): string {
  const dateLabel = longDateFromKey(day.key);

  return `
    <div style="margin-bottom:24px;">
      <h2 style="font-size:14px; font-weight:700; letter-spacing:0.08em;
                 margin:0 0 8px; color:#111; text-transform:uppercase;">
        ${day.label}${dateLabel ? ` · ${dateLabel}` : ""}
      </h2>
      <div style="padding-left: 8px;">
        ${day.items.map((e) => buildEventLine(e, today)).join("")}
      </div>
    </div>`;
}

function buildHtml(events: DigestEvent[]): string {
  const today = todayKey();
  const days = groupByDay(events, today);
  const subject = buildSubject(events, today);
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
             max-width:1200px; margin:0 auto; padding:28px 24px;
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

  ${days.map((day) => buildDaySection(day, today)).join("")}

  <div style="margin-top:32px; padding-top:16px; border-top:1px solid #ddd;
              font-size:12px; color:#999; font-family:sans-serif;">
    Poslao LetsGo
  </div>

</body>
</html>`;
}

// ─── Send ─────────────────────────────────────────────────────────────────────

export async function sendDigestEmail(events: DigestEvent[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing env vars: RESEND_API_KEY");
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: process.env.TO_EMAIL ?? "",
    subject: process.env.EMAIL_SUBJECT || buildSubject(events, todayKey()),
    html: buildHtml(events),
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  console.log(`✅ Email sent! (id: ${data?.id})`);
}
