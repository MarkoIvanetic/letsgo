// ─────────────────────────────────────────────────────────────────
//  CRAWLER TEMPLATE
//  1. Copy this file  →  crawlers/mysource.ts
//  2. Fill in the crawl() function below
//  3. Import and add it to the `crawlers` array in src/crawlers/index.ts
// ─────────────────────────────────────────────────────────────────

import type { DigestEvent } from "../types.ts";

// Uncomment if your source is an RSS/Atom feed:
// import Parser from 'rss-parser';
// const parser = new Parser();

export async function crawl(): Promise<DigestEvent[]> {
  const events: DigestEvent[] = [];

  // ── RSS / Atom feed ──────────────────────────────────────────────
  //
  // const feed = await parser.parseURL('https://yoursite.com/feed');
  // for (const item of feed.items) {
  //   events.push({
  //     title:   item.title         ?? 'Untitled',
  //     link:    item.link          ?? '#',
  //     date:    item.pubDate       ?? new Date().toISOString(),
  //     summary: item.contentSnippet ?? '',
  //     source:  'Your Source Name',
  //   });
  // }

  // ── REST API ─────────────────────────────────────────────────────
  //
  // const res = await fetch('https://api.yoursite.com/articles');
  // if (!res.ok) throw new Error(`API error: ${res.status}`);
  // const data = await res.json() as YourApiType[];
  //
  // for (const item of data) {
  //   events.push({
  //     title:   item.title,
  //     link:    item.url,
  //     date:    item.publishedAt,
  //     summary: item.description,
  //     source:  'Your Source Name',
  //     tags:    item.tags,          // optional
  //   });
  // }

  return events;
}
