import type { DigestEvent } from "../types.ts";
import {
  buildEventLink,
  lastsAtMostOneWeek,
  parseEventTime,
  toApiDate,
} from "./utils.ts";

const BASE_URL = "https://www.meetinzagreb.hr";
// Meet in Zagreb's site is a client-side SPA that returns the same shell
// for every URL — event detail pages don't actually render there. Both
// sites share the same event slugs/categories, and infozagreb.hr serves
// the real rendered page, so build event links against that domain.
const EVENT_PAGE_BASE_URL = "https://www.infozagreb.hr";
const EVENT_CATEGORIES = "90,91,92,93,94,95,96,284";

interface MeetInZagrebMediaImage {
  media_path: string | null;
  filename: string | null;
  extension: string | null;
}

interface MeetInZagrebMedia {
  heading_image: MeetInZagrebMediaImage;
  id_media: number | null;
}

interface MeetInZagrebLocation {
  id_objects: number;
  id_objects_types: number;
  name: string;
  link: string;
  date_created: string;
  date_created_unformatted: string;
  heading: string | null;
  pages_link: string;
  mainCategoryName: string;
  mainCategoryId: number;
  media: MeetInZagrebMedia;
}

interface MeetInZagrebDate {
  date_from: string;
  date_to: string | null;
  time_from: string;
  time_to: string;
  u_date_from: string;
  u_date_to: string | null;
  formatted_date: string;
}

interface MeetInZagrebEvent {
  id_objects: number;
  id_objects_types: number;
  name: string;
  link: string;
  date_created: string;
  date_created_unformatted: string;
  date_from: string;
  date_to: string | null;
  time_from: string;
  time_to: string;
  heading: string | null;
  pages_link: string;
  mainCategoryName: string;
  media: MeetInZagrebMedia;
  locations: MeetInZagrebLocation[];
  dates: MeetInZagrebDate[];
}

export async function crawl(): Promise<DigestEvent[]> {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    page: "1",
    category: EVENT_CATEGORIES,
    dateFrom: toApiDate(today),
    dateTo: toApiDate(nextWeek),
  });

  const url = `${BASE_URL}/page/getEvents?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      referer: `${BASE_URL}/dogadanja?dateFrom=${toApiDate(today)}&dateTo=${toApiDate(nextWeek)}&selected=5`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Meet in Zagreb API error: ${res.status} ${res.statusText}`,
    );
  }

  const events = (await res.json()) as MeetInZagrebEvent[];

  return events
    .filter((event) => lastsAtMostOneWeek(event.date_from, event.date_to))
    .map((event): DigestEvent => {
      const firstDate = event.dates[0];
      const location = event.locations[0]?.name;

      return {
        title: event.name,
        link: buildEventLink(EVENT_PAGE_BASE_URL, event.pages_link, event.link),
        date: firstDate?.u_date_from ?? new Date().toISOString(),
        dateFrom: event.date_from,
        dateTo: event.date_to ?? undefined,
        startTime: parseEventTime(firstDate?.time_from ?? event.time_from),
        summary: event.heading ?? "",
        source: "Meet in Zagreb",
        location,
        tags: [event.mainCategoryName],
      };
    });
}
