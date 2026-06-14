import type { DigestEvent } from "../types.ts";
import { dedupeEvents } from "./dedup.ts";
import { crawl as crawlInfoZagreb } from "./infozagreb.ts";
import { crawl as crawlMeetInZagreb } from "./meetinzagreb.ts";

const crawlers = [
  { name: "InfoZagreb", fn: crawlInfoZagreb },
  { name: "Meet in Zagreb", fn: crawlMeetInZagreb },
];

export async function fetchAllEvents(): Promise<DigestEvent[]> {
  console.log(`🔍 Running ${crawlers.length} crawler(s)…\n`);

  const results = await Promise.allSettled(
    crawlers.map((crawler) => crawler.fn()),
  );

  const events = results.flatMap((result, index) => {
    if (result.status === "fulfilled") {
      console.log(
        `  ✓ ${crawlers[index].name}: ${result.value.length} item(s)`,
      );
      return result.value;
    }

    console.warn(`  ✗ ${crawlers[index].name}: ${result.reason}`);
    return [];
  });

  const deduped = dedupeEvents(events);
  const duplicateCount = events.length - deduped.length;
  if (duplicateCount > 0) {
    console.log(`  ⚬ Removed ${duplicateCount} duplicate(s) across sources`);
  }

  return deduped;
}
