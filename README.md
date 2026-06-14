# LetsGo — Weekly Zagreb Events Digest

Node.js + TypeScript app that crawls Zagreb event sources, filters them, and sends a weekly HTML email digest in Croatian. Runs on GitHub Actions — no server needed.

---

## What it does

1. Runs crawlers for each event source in parallel
2. Filters out events that span longer than 7 days (exhibitions, ongoing fairs — not useful in a weekly digest)
3. Groups remaining events by day and sends a single HTML email via Resend
4. Scheduled twice a week: **Thursday at 17:00** and **Sunday at 12:00** (Zagreb time)

---

## Project structure

```
src/
  index.ts                  ← entry point; calls fetchAllEvents(), sends email
  types.ts                  ← shared DigestEvent interface (source of truth)
  emailer.ts                ← builds HTML email + sends via Resend
  send-test-email.ts        ← local test runner (npm run email:test)
  crawlers/
    index.ts                ← aggregator; registers all crawlers, exports fetchAllEvents()
    infozagreb.ts           ← crawler for infozagreb.hr API
    meetinzagreb.ts         ← crawler for meetinzagreb.hr API
    utils.ts                ← shared helpers (date formatting, time parsing, link building, filtering)
    _template.ts            ← copy this to add a new crawler
.env.example                ← required env vars
.github/workflows/
  weekly-digest.yml         ← GitHub Actions schedule
```

---

## DigestEvent interface (`src/types.ts`)

Every crawler must return `DigestEvent[]`. All fields except `title`, `link`, `date`, and `source` are optional.

```ts
interface DigestEvent {
  title: string; // event name
  link: string; // URL to event page
  date: string; // ISO 8601 — used for sorting
  dateFrom?: string; // human-readable start, e.g. "14.06.2026"
  dateTo?: string; // human-readable end — omit for single-day
  startTime?: string; // "20:30" — omit if no specific time
  summary: string; // short description
  source: string; // "InfoZagreb" | "Meet in Zagreb" | ...
  location?: string; // venue name
  tags?: string[];
}
```

---

## Adding a new crawler

1. Copy `src/crawlers/_template.ts` → `src/crawlers/mysource.ts`
2. Implement `crawl(): Promise<DigestEvent[]>`
3. Use helpers from `src/crawlers/utils.ts` for date parsing, time parsing, link building, and the 7-day filter
4. Register it in `src/crawlers/index.ts` — **this is the only file that needs to change**

```ts
// src/crawlers/index.ts
import { crawl as crawlMySource } from "./mysource.ts";

const crawlers = [...{ name: "My Source", fn: crawlMySource }];
```

---

## Crawler utils (`src/crawlers/utils.ts`)

| Function                           | Purpose                                              |
| ---------------------------------- | ---------------------------------------------------- |
| `toApiDate(date)`                  | JS Date → `"DD.MM.YYYY"` for API query params        |
| `parseTime(time)`                  | `"00:00"` → `undefined`, `"20:30"` → `"20:30"`       |
| `buildLink(base, pagesLink, slug)` | Assembles canonical event URL                        |
| `parseCroatianDate(str)`           | `"14.06.2026"` → `"2026-06-14"` (for sorting)        |
| `isWithinOneWeek(event)`           | Returns `false` for events spanning more than 7 days |

---

## Email (`src/emailer.ts`)

- **Language:** Croatian (days, CTA, footer)
- **Grouped by day**, with header format: `PETAK · 20.06.2026.`
- **Source badges:** InfoZagreb = blue, Meet in Zagreb = red
- **Dynamic subject:** `[LetsGo] Događanja u Zagrebu 14.06. - 21.06.2026.`
- Resend is instantiated inside `sendDigestEmail()`, not at module load — avoids crash if `RESEND_API_KEY` is missing during imports

---

## Environment variables

```bash
# .env (local) or GitHub Secrets (CI)
RESEND_API_KEY=re_...         # required — Resend API key
TO_EMAIL=you@email.com        # required — recipient
EMAIL_FROM=digest@domain.com  # optional — falls back to onboarding@resend.dev
```

---

## Running locally

```bash
npm install
cp .env.example .env          # fill in your values

npm run email:test            # sends a real email using today's events
npm start                     # same as CI — runs full flow
npm run typecheck             # tsc --noEmit
```

---

## GitHub Actions schedule

Defined in `.github/workflows/weekly-digest.yml`:

```yaml
schedule:
  - cron: "0 15 * * 4" # Thursday 17:00 Zagreb (UTC+2)
  - cron: "0 10 * * 0" # Sunday   12:00 Zagreb (UTC+2)
workflow_dispatch: # manual trigger from Actions tab
```

Secrets required in repo: `RESEND_API_KEY`, `TO_EMAIL`. `EMAIL_FROM` is optional.

---

## Current event sources

| Source         | Type     | URL                           |
| -------------- | -------- | ----------------------------- |
| InfoZagreb     | REST API | `infozagreb.hr/API/hr/search` |
| Meet in Zagreb | REST API | `meetinzagreb.hr`             |
