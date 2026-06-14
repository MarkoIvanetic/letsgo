import Parser from 'rss-parser';
import type { DigestEvent } from '../src/types.ts';

const parser = new Parser();
const MAX_ITEMS = 5;

function oneWeekAgo(): number {
  return Date.now() - 7 * 24 * 60 * 60 * 1000;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function crawl(): Promise<DigestEvent[]> {
  const feed = await parser.parseURL('https://news.ycombinator.com/rss');
  const cutoff = oneWeekAgo();

  return feed.items
    .filter(item => new Date(item.pubDate ?? 0).getTime() >= cutoff)
    .slice(0, MAX_ITEMS)
    .map(item => ({
      title:   item.title         ?? 'Untitled',
      link:    item.link          ?? item.guid ?? '#',
      date:    item.pubDate       ?? new Date().toISOString(),
      summary: stripHtml(item.contentSnippet ?? '').slice(0, 220),
      source:  'Hacker News',
    }));
}
