import { crawl as crawlInfoZagreb } from "./infozagreb.ts";

const crawlers = [{ name: "InfoZagreb", fn: crawlInfoZagreb }];

export async function fetchAllEvents() {
  console.log(`🔍 Running ${crawlers.length} crawler(s)…\n`);

  const results = await Promise.allSettled(
    crawlers.map((crawler) => crawler.fn()),
  );

  return results.flatMap((result, index) => {
    if (result.status === "fulfilled") {
      console.log(
        `  ✓ ${crawlers[index].name}: ${result.value.length} item(s)`,
      );
      return result.value;
    }

    console.warn(`  ✗ ${crawlers[index].name}: ${result.reason}`);
    return [];
  });
}
