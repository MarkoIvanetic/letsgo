import type { DigestEvent } from '../src/types.ts';

const BASE_URL = 'https://www.infozagreb.hr';

// ─── API response types ───────────────────────────────────────────────────────

interface IZDate {
  date_from:      string;         // "14.06.2026."
  date_to:        string | null;  // "21.06.2026." or null
  time_from:      string;         // "20:30" or "00:00"
  u_date_from:    string;         // "2026-06-13T22:00:00.000Z" — ISO, for sorting
  formatted_date: string;
}

interface IZLocation {
  name:       string;
  pages_link: string;
}

interface IZEvent {
  id_objects:       number;
  name:             string;
  link:             string;        // slug, e.g. "anthrax-hr-69899bc4c8315"
  date_from:        string;        // "14.06.2026"
  date_to:          string | null; // "21.06.2026" or null
  heading:          string | null; // summary / subtitle
  pages_link:       string;        // "/hr/dogadanja/koncerti-i-glazbena-dogadanja"
  mainCategoryName: string;
  locations:        IZLocation[];
  dates:            IZDate[];
}

interface IZResponse {
  data:              IZEvent[];
  number_of_results: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format a JS Date to the DD.MM.YYYY the API expects */
function toApiDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d}.${m}.${date.getFullYear()}`;
}

/** "00:00" means no specific time — return undefined so we skip it in the email */
function parseTime(time: string): string | undefined {
  return !time || time === '00:00' ? undefined : time;
}

// ─── Crawler ─────────────────────────────────────────────────────────────────

export async function crawl(): Promise<DigestEvent[]> {
  const today    = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    menu_id:    '262',
    categories: '',
    date_from:  toApiDate(today),
    date_to:    toApiDate(nextWeek),
    str:        '1',
    type:       'EVENTS',
    orderField: 'od.date_from',
    per_page:   '200',
  });

  const url = `${BASE_URL}/API/hr/search?${params}`;

  const res = await fetch(url, {
    headers: {
      'accept':          'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'referer':         `${BASE_URL}/`,
    },
  });

  if (!res.ok) {
    throw new Error(`InfoZagreb API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IZResponse;

  return json.data.map((event): DigestEvent => {
    const firstDate = event.dates[0];
    const location  = event.locations[0]?.name;

    // Build the canonical event URL from the category page + slug
    const link = `${BASE_URL}${event.pages_link}/${event.link}`;

    return {
      title:     event.name,
      link,
      date:      firstDate?.u_date_from ?? new Date().toISOString(),
      dateFrom:  event.date_from,
      dateTo:    event.date_to ?? undefined,
      startTime: firstDate ? parseTime(firstDate.time_from) : undefined,
      summary:   event.heading ?? '',
      source:    'InfoZagreb',
      location,
      tags:      [event.mainCategoryName],
    };
  });
}
